-- 시민권력 OS (가칭) — 참여 기록 스키마
-- 원칙: 개인정보 최소(카카오 고유 ID는 auth.users에만, 공개 테이블엔 별칭만), 본인 행만 읽기/쓰기, 공개는 집계 숫자만.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 30),
  created_at timestamptz not null default now()
);
create table public.votes (
  user_id uuid not null references auth.users(id) on delete cascade,
  issue_id text not null check (char_length(issue_id) <= 40),
  statement_id int not null check (statement_id between 1 and 500),
  choice text not null check (choice in ('agree','disagree','pass')),
  created_at timestamptz not null default now(),
  primary key (user_id, issue_id, statement_id)
);
create table public.statements_submitted (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  issue_id text not null check (char_length(issue_id) <= 40),
  body text not null check (char_length(body) between 1 and 140),
  status text not null default '검토 대기',
  created_at timestamptz not null default now()
);
create table public.supports (
  user_id uuid not null references auth.users(id) on delete cascade,
  issue_id text not null check (char_length(issue_id) <= 40),
  supported boolean not null default true,
  role text check (char_length(role) <= 40),
  team_joined_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, issue_id)
);
create table public.proposals (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  body jsonb not null default '{}'::jsonb,
  status text not null default '접수',
  created_at timestamptz not null default now()
);
create table public.tasks (
  user_id uuid not null references auth.users(id) on delete cascade,
  issue_id text not null check (char_length(issue_id) <= 40),
  task text not null check (char_length(task) <= 120),
  created_at timestamptz not null default now(),
  primary key (user_id, issue_id)
);
create index on public.statements_submitted (user_id);
create index on public.proposals (user_id);

alter table public.profiles enable row level security;
alter table public.votes enable row level security;
alter table public.statements_submitted enable row level security;
alter table public.supports enable row level security;
alter table public.proposals enable row level security;
alter table public.tasks enable row level security;

-- 본인 행만 (status는 사용자가 바꿀 수 없도록 proposals/statements는 update 정책 없음)
create policy "own profile" on public.profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "own votes" on public.votes for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own supports" on public.supports for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own tasks" on public.tasks for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own proposals read" on public.proposals for select to authenticated using ((select auth.uid()) = user_id);
create policy "own proposals insert" on public.proposals for insert to authenticated with check ((select auth.uid()) = user_id and status = '접수');
create policy "own proposals delete" on public.proposals for delete to authenticated using ((select auth.uid()) = user_id);
create policy "own statements read" on public.statements_submitted for select to authenticated using ((select auth.uid()) = user_id);
create policy "own statements insert" on public.statements_submitted for insert to authenticated with check ((select auth.uid()) = user_id and status = '검토 대기');
create policy "own statements delete" on public.statements_submitted for delete to authenticated using ((select auth.uid()) = user_id);

-- 공개 집계: 비노출 스키마의 security definer 함수 + public 래퍼(invoker). 숫자만 반환.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to anon, authenticated;
create or replace function private.issue_counts_impl(p_issue text)
returns table (supporters bigint, team bigint, voters bigint)
language sql security definer set search_path = '' stable as $$
  select (select count(*) from public.supports s where s.issue_id = p_issue and s.supported),
         (select count(*) from public.supports s where s.issue_id = p_issue and s.team_joined_at is not null),
         (select count(distinct v.user_id) from public.votes v where v.issue_id = p_issue);
$$;
revoke all on function private.issue_counts_impl(text) from public;
grant execute on function private.issue_counts_impl(text) to anon, authenticated;
create or replace function public.issue_counts(p_issue text)
returns table (supporters bigint, team bigint, voters bigint)
language sql security invoker set search_path = '' stable as $$ select * from private.issue_counts_impl(p_issue); $$;
grant execute on function public.issue_counts(text) to anon, authenticated;

-- 가입 시 프로필 자동 생성: 카카오 닉네임만 사용(실명·전화·이메일 저장 안 함)
create or replace function private.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, left(coalesce(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'nickname', new.raw_user_meta_data->>'preferred_username', '시민'), 30))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

-- 탈퇴: 본인 계정 삭제(모든 기록은 on delete cascade로 함께 삭제)
create or replace function private.delete_me_impl()
returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function private.delete_me_impl() from public, anon;
grant execute on function private.delete_me_impl() to authenticated;
create or replace function public.delete_me()
returns void language sql security invoker set search_path = '' as $$ select private.delete_me_impl(); $$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;
