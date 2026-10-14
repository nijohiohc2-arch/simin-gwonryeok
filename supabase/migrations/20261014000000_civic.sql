-- 시민권력 OS (가칭) — dialog-platform 프로젝트 안의 독립 스키마 civic.
-- 기존 객체는 건드리지 않음. auth.users 트리거 없음(가입 흐름 영향 0). Data API 노출 없이 public.civic_* RPC로만 접근.
create schema civic;
create schema civic_private;
revoke all on schema civic, civic_private from public, anon, authenticated;
grant usage on schema civic_private to anon, authenticated;

create table civic.profiles (id uuid primary key references auth.users(id) on delete cascade, nickname text not null check (char_length(nickname) between 1 and 30), created_at timestamptz not null default now());
create table civic.votes (user_id uuid not null references auth.users(id) on delete cascade, issue_id text not null check (char_length(issue_id) <= 40), statement_id int not null check (statement_id between 1 and 500), choice text not null check (choice in ('agree','disagree','pass')), created_at timestamptz not null default now(), primary key (user_id, issue_id, statement_id));
create table civic.statements (id bigint generated always as identity primary key, user_id uuid not null references auth.users(id) on delete cascade, issue_id text not null check (char_length(issue_id) <= 40), body text not null check (char_length(body) between 1 and 140), status text not null default '검토 대기', created_at timestamptz not null default now());
create table civic.supports (user_id uuid not null references auth.users(id) on delete cascade, issue_id text not null check (char_length(issue_id) <= 40), supported boolean not null default true, role text check (char_length(role) <= 40), team_joined_at timestamptz, created_at timestamptz not null default now(), primary key (user_id, issue_id));
create table civic.proposals (id bigint generated always as identity primary key, user_id uuid not null references auth.users(id) on delete cascade, title text not null check (char_length(title) between 1 and 120), body jsonb not null default '{}'::jsonb, status text not null default '접수', created_at timestamptz not null default now());
create table civic.tasks (user_id uuid not null references auth.users(id) on delete cascade, issue_id text not null check (char_length(issue_id) <= 40), task text not null check (char_length(task) <= 120), created_at timestamptz not null default now(), primary key (user_id, issue_id));
create index on civic.statements (user_id); create index on civic.proposals (user_id); create index on civic.votes (issue_id); create index on civic.supports (issue_id);
-- RLS 켜고 정책 없음 = 직접 접근 전면 차단. 모든 접근은 아래 definer 함수(본인 auth.uid()만)로.
alter table civic.profiles enable row level security; alter table civic.votes enable row level security; alter table civic.statements enable row level security;
alter table civic.supports enable row level security; alter table civic.proposals enable row level security; alter table civic.tasks enable row level security;

create function civic_private.me() returns uuid language plpgsql stable set search_path='' as $$ begin if auth.uid() is null then raise exception 'not authenticated'; end if; return auth.uid(); end $$;

create function civic_private.ensure_profile(p_nick text) returns text language plpgsql security definer set search_path='' as $$
declare u uuid := civic_private.me(); n text;
begin insert into civic.profiles(id,nickname) values (u, left(coalesce(nullif(trim(p_nick),''),'시민'),30)) on conflict (id) do nothing;
select nickname into n from civic.profiles where id=u; return n; end $$;
create function civic_private.get_votes(p_issue text) returns jsonb language sql stable security definer set search_path='' as $$
  select coalesce(jsonb_object_agg(statement_id::text, choice), '{}'::jsonb) from civic.votes where user_id=civic_private.me() and issue_id=p_issue $$;
create function civic_private.set_votes(p_issue text, p_votes jsonb) returns void language plpgsql security definer set search_path='' as $$
declare u uuid := civic_private.me(); begin delete from civic.votes where user_id=u and issue_id=p_issue;
insert into civic.votes(user_id,issue_id,statement_id,choice) select u,p_issue,k::int,v from jsonb_each_text(coalesce(p_votes,'{}'::jsonb)) as t(k,v); end $$;
create function civic_private.get_join(p_issue text) returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object('supported',supported,'role',role,'team',team_joined_at is not null) from civic.supports where user_id=civic_private.me() and issue_id=p_issue $$;
create function civic_private.set_join(p_issue text, p_supported boolean, p_role text, p_team boolean) returns void language plpgsql security definer set search_path='' as $$
declare u uuid := civic_private.me(); begin
if not p_supported and not p_team then delete from civic.supports where user_id=u and issue_id=p_issue; return; end if;
insert into civic.supports(user_id,issue_id,supported,role,team_joined_at) values (u,p_issue,p_supported,case when p_team then p_role end,case when p_team then now() end)
on conflict (user_id,issue_id) do update set supported=excluded.supported, role=excluded.role, team_joined_at=case when p_team then coalesce(civic.supports.team_joined_at, now()) end; end $$;
create function civic_private.get_task(p_issue text) returns text language sql stable security definer set search_path='' as $$ select task from civic.tasks where user_id=civic_private.me() and issue_id=p_issue $$;
create function civic_private.set_task(p_issue text, p_task text) returns void language plpgsql security definer set search_path='' as $$
declare u uuid := civic_private.me(); begin if coalesce(p_task,'')='' then delete from civic.tasks where user_id=u and issue_id=p_issue;
else insert into civic.tasks(user_id,issue_id,task) values (u,p_issue,p_task) on conflict (user_id,issue_id) do update set task=excluded.task; end if; end $$;
create function civic_private.get_statements(p_issue text) returns jsonb language sql stable security definer set search_path='' as $$
  select coalesce(jsonb_agg(body order by id),'[]'::jsonb) from civic.statements where user_id=civic_private.me() and issue_id=p_issue $$;
create function civic_private.add_statement(p_issue text, p_body text) returns void language sql security definer set search_path='' as $$
  insert into civic.statements(user_id,issue_id,body) values (civic_private.me(),p_issue,p_body) $$;
create function civic_private.get_proposals() returns jsonb language sql stable security definer set search_path='' as $$
  select coalesce(jsonb_agg(jsonb_build_object('title',title,'created_at',created_at) order by id),'[]'::jsonb) from civic.proposals where user_id=civic_private.me() $$;
create function civic_private.add_proposal(p_title text, p_body jsonb) returns void language sql security definer set search_path='' as $$
  insert into civic.proposals(user_id,title,body) values (civic_private.me(),p_title,coalesce(p_body,'{}'::jsonb)) $$;
-- 공개: 숫자만
create function civic_private.issue_counts(p_issue text) returns table (supporters bigint, team bigint, voters bigint) language sql stable security definer set search_path='' as $$
  select (select count(*) from civic.supports s where s.issue_id=p_issue and s.supported),
         (select count(*) from civic.supports s where s.issue_id=p_issue and s.team_joined_at is not null),
         (select count(distinct v.user_id) from civic.votes v where v.issue_id=p_issue) $$;
-- 탈퇴: civic 기록만 삭제. auth 계정은 dialog-platform과 공유되므로 삭제하지 않음.
create function civic_private.delete_me() returns void language plpgsql security definer set search_path='' as $$
declare u uuid := civic_private.me(); begin
delete from civic.votes where user_id=u; delete from civic.statements where user_id=u; delete from civic.supports where user_id=u;
delete from civic.proposals where user_id=u; delete from civic.tasks where user_id=u; delete from civic.profiles where id=u; end $$;

revoke all on all functions in schema civic_private from public, anon, authenticated;
grant execute on all functions in schema civic_private to authenticated;
grant execute on function civic_private.issue_counts(text) to anon;

-- public 래퍼(invoker, civic_ 접두사)
create function public.civic_ensure_profile(p_nick text) returns text language sql set search_path='' as $$ select civic_private.ensure_profile(p_nick) $$;
create function public.civic_get_votes(p_issue text) returns jsonb language sql stable set search_path='' as $$ select civic_private.get_votes(p_issue) $$;
create function public.civic_set_votes(p_issue text, p_votes jsonb) returns void language sql set search_path='' as $$ select civic_private.set_votes(p_issue,p_votes) $$;
create function public.civic_get_join(p_issue text) returns jsonb language sql stable set search_path='' as $$ select civic_private.get_join(p_issue) $$;
create function public.civic_set_join(p_issue text, p_supported boolean, p_role text, p_team boolean) returns void language sql set search_path='' as $$ select civic_private.set_join(p_issue,p_supported,p_role,p_team) $$;
create function public.civic_get_task(p_issue text) returns text language sql stable set search_path='' as $$ select civic_private.get_task(p_issue) $$;
create function public.civic_set_task(p_issue text, p_task text) returns void language sql set search_path='' as $$ select civic_private.set_task(p_issue,p_task) $$;
create function public.civic_get_statements(p_issue text) returns jsonb language sql stable set search_path='' as $$ select civic_private.get_statements(p_issue) $$;
create function public.civic_add_statement(p_issue text, p_body text) returns void language sql set search_path='' as $$ select civic_private.add_statement(p_issue,p_body) $$;
create function public.civic_get_proposals() returns jsonb language sql stable set search_path='' as $$ select civic_private.get_proposals() $$;
create function public.civic_add_proposal(p_title text, p_body jsonb) returns void language sql set search_path='' as $$ select civic_private.add_proposal(p_title,p_body) $$;
create function public.civic_issue_counts(p_issue text) returns table (supporters bigint, team bigint, voters bigint) language sql stable set search_path='' as $$ select * from civic_private.issue_counts(p_issue) $$;
create function public.civic_delete_me() returns void language sql set search_path='' as $$ select civic_private.delete_me() $$;
revoke all on function public.civic_ensure_profile(text), public.civic_get_votes(text), public.civic_set_votes(text,jsonb), public.civic_get_join(text), public.civic_set_join(text,boolean,text,boolean), public.civic_get_task(text), public.civic_set_task(text,text), public.civic_get_statements(text), public.civic_add_statement(text,text), public.civic_get_proposals(), public.civic_add_proposal(text,jsonb), public.civic_issue_counts(text), public.civic_delete_me() from public, anon;
grant execute on function public.civic_ensure_profile(text), public.civic_get_votes(text), public.civic_set_votes(text,jsonb), public.civic_get_join(text), public.civic_set_join(text,boolean,text,boolean), public.civic_get_task(text), public.civic_set_task(text,text), public.civic_get_statements(text), public.civic_add_statement(text,text), public.civic_get_proposals(), public.civic_add_proposal(text,jsonb), public.civic_issue_counts(text), public.civic_delete_me() to authenticated;
grant execute on function public.civic_issue_counts(text) to anon;

-- (civic_block_anonymous) dialog-platform은 익명 로그인을 허용하므로 civic 함수에서는 익명 세션 차단
create or replace function civic_private.me() returns uuid language plpgsql stable set search_path='' as $$ begin if auth.uid() is null or coalesce((auth.jwt()->>'is_anonymous')::boolean, false) then raise exception 'not authenticated'; end if; return auth.uid(); end $$;
