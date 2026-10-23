-- 내 정보(그래프 뷰) 편집: civic.profiles에 동네·관심 분야·역할 추가 + 본인 전용 RPC. 민감정보(전화·상세주소·사진) 없음.
alter table civic.profiles
  add column if not exists neighborhood text check (neighborhood is null or char_length(neighborhood) <= 30),
  add column if not exists interests text[] not null default '{}' check (cardinality(interests) <= 8),
  add column if not exists role text not null default '참여자' check (role in ('참여자','실행팀','조직자','관찰자')),
  add column if not exists updated_at timestamptz not null default now();

create or replace function civic_private.get_profile() returns jsonb language sql stable security definer set search_path='' as $$
  select jsonb_build_object('nickname',nickname,'neighborhood',neighborhood,'interests',to_jsonb(interests),'role',role) from civic.profiles where id=civic_private.me() $$;

create or replace function civic_private.update_profile(p_nickname text, p_neighborhood text, p_interests text[], p_role text) returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid := civic_private.me(); n text := trim(coalesce(p_nickname,'')); nb text := nullif(trim(coalesce(p_neighborhood,'')),''); it text[];
begin
  if char_length(n) < 1 or char_length(n) > 30 then raise exception 'nickname length'; end if;
  if nb is not null and char_length(nb) > 30 then raise exception 'neighborhood length'; end if;
  select coalesce(array_agg(distinct x),'{}') into it from (select trim(v) x from unnest(coalesce(p_interests,'{}')) v) s where char_length(x) between 1 and 20;
  if cardinality(it) > 8 then raise exception 'too many interests'; end if;
  if coalesce(p_role,'참여자') not in ('참여자','실행팀','조직자','관찰자') then raise exception 'invalid role'; end if;
  insert into civic.profiles(id,nickname,neighborhood,interests,role,updated_at) values (u,n,nb,it,coalesce(p_role,'참여자'),now())
  on conflict (id) do update set nickname=excluded.nickname, neighborhood=excluded.neighborhood, interests=excluded.interests, role=excluded.role, updated_at=now();
  return civic_private.get_profile();
end $$;
revoke all on function civic_private.get_profile(), civic_private.update_profile(text,text,text[],text) from public, anon, authenticated;
grant execute on function civic_private.get_profile(), civic_private.update_profile(text,text,text[],text) to authenticated;

create or replace function public.civic_get_profile() returns jsonb language sql stable set search_path='' as $$ select civic_private.get_profile() $$;
create or replace function public.civic_update_profile(p_nickname text, p_neighborhood text, p_interests text[], p_role text) returns jsonb language sql set search_path='' as $$ select civic_private.update_profile(p_nickname,p_neighborhood,p_interests,p_role) $$;
revoke all on function public.civic_get_profile(), public.civic_update_profile(text,text,text[],text) from public, anon;
grant execute on function public.civic_get_profile(), public.civic_update_profile(text,text,text[],text) to authenticated;
