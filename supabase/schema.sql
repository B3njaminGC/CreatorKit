-- CreatorKit: cuentas + Pro real en Supabase (plan gratis).
-- Pégalo completo en Supabase → SQL Editor → Run. Se puede ejecutar más de una vez.

-- 1) Quién tiene Pro (permanente para esa cuenta)
create table if not exists public.pro_users (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  activated_at timestamptz not null default now()
);

-- 2) Códigos de compra de UN SOLO USO (solo se guarda el hash, nunca el código)
create table if not exists public.pro_codes (
  code_hash text primary key,
  used_by   uuid references auth.users(id),
  used_at   timestamptz
);

-- 3) Contenido Pro: vive solo en el servidor y solo lo puede leer una cuenta Pro
create table if not exists public.packs (
  id   text primary key,
  name text  not null,
  data jsonb not null
);

alter table public.pro_users enable row level security;
alter table public.pro_codes enable row level security;
alter table public.packs     enable row level security;

drop policy if exists "ver mi propio estado pro" on public.pro_users;
create policy "ver mi propio estado pro" on public.pro_users
  for select to authenticated using (auth.uid() = user_id);

-- pro_codes no tiene políticas a propósito: nadie puede leerla ni escribirla desde la app.

drop policy if exists "packs solo para cuentas pro" on public.packs;
create policy "packs solo para cuentas pro" on public.packs
  for select to authenticated
  using (exists (select 1 from public.pro_users p where p.user_id = auth.uid()));

-- 4) Canje de código: lo ejecuta el servidor, la app solo lo llama
create or replace function public.redeem_code(code text)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  h    text;
  rows int;
begin
  if auth.uid() is null then
    raise exception 'Necesitas iniciar sesión';
  end if;

  -- si ya es Pro, no gastamos otro código
  if exists (select 1 from pro_users where user_id = auth.uid()) then
    return true;
  end if;

  h := encode(digest(upper(regexp_replace(code, '[^A-Za-z0-9]', '', 'g')), 'sha256'), 'hex');

  update pro_codes
     set used_by = auth.uid(), used_at = now()
   where code_hash = h and used_by is null;
  get diagnostics rows = row_count;

  if rows = 0 then
    return false;            -- código inexistente o ya usado
  end if;

  insert into pro_users (user_id) values (auth.uid()) on conflict do nothing;
  return true;
end;
$$;

revoke all on function public.redeem_code(text) from public, anon;
grant execute on function public.redeem_code(text) to authenticated;
