-- ============ ENUMS ============
create type public.app_role as enum ('agency_admin', 'client_user');
create type public.servicio_slug as enum ('diseno-web', 'seo', 'go-high-level', 'agentes-ia');
create type public.tarea_estado as enum ('backlog', 'en-progreso', 'revision', 'completado');
create type public.tarea_prioridad as enum ('alta', 'media', 'baja');
create type public.invitation_status as enum ('pending_approval', 'approved', 'rejected');

-- ============ SHARED TRIGGER FN ============
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============ CLINICAS ============
create table public.clinicas (
  id uuid primary key default gen_random_uuid(),
  nombre_clinica text not null,
  nombre_doctor text not null,
  paquete text not null default 'Pro',
  fecha_inicio date not null default current_date,
  asesor text not null default '',
  whatsapp_link text not null default '',
  servicios_contratados servicio_slug[] not null default '{}',
  color text not null default '#0A7C6A',
  iniciales text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.clinicas to authenticated;
grant all on public.clinicas to service_role;
alter table public.clinicas enable row level security;
create trigger clinicas_updated_at before update on public.clinicas
  for each row execute function public.update_updated_at_column();

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key,
  email text,
  nombre text,
  clinica_id uuid references public.clinicas(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- ============ USER ROLES ============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create or replace function public.is_agency(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(_user_id, 'agency_admin')
$$;

create or replace function public.my_clinica_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinica_id from public.profiles where id = auth.uid()
$$;

-- profile creation on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nombre)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'nombre', new.email))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'client_user')
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- policies: roles
create policy "users read own roles" on public.user_roles
  for select to authenticated using (user_id = auth.uid() or public.is_agency(auth.uid()));

-- policies: profiles
create policy "read own or agency reads all" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_agency(auth.uid()));
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "agency manages profiles" on public.profiles
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));

-- policies: clinicas
create policy "agency manages clinicas" on public.clinicas
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own clinica" on public.clinicas
  for select to authenticated using (id = public.my_clinica_id());

-- ============ ENTREGABLES ============
create table public.entregables (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  nombre text not null,
  servicio_slug servicio_slug not null,
  version text not null default 'v1',
  status text not null default 'Borrador',
  fecha date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.entregables to authenticated;
grant all on public.entregables to service_role;
alter table public.entregables enable row level security;
create trigger entregables_updated_at before update on public.entregables
  for each row execute function public.update_updated_at_column();
create policy "agency manages entregables" on public.entregables
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own entregables" on public.entregables
  for select to authenticated using (clinica_id = public.my_clinica_id());

-- ============ TAREAS ============
create table public.tareas (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  servicio_slug servicio_slug not null,
  entregable_id uuid references public.entregables(id) on delete set null,
  titulo text not null,
  descripcion text,
  estado tarea_estado not null default 'backlog',
  prioridad tarea_prioridad not null default 'media',
  fecha_entrega date,
  creado_por text not null default 'agencia',
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.tareas to authenticated;
grant all on public.tareas to service_role;
alter table public.tareas enable row level security;
create trigger tareas_updated_at before update on public.tareas
  for each row execute function public.update_updated_at_column();
create policy "agency manages tareas" on public.tareas
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own tareas" on public.tareas
  for select to authenticated using (clinica_id = public.my_clinica_id());
create policy "client creates tareas" on public.tareas
  for insert to authenticated with check (clinica_id = public.my_clinica_id());
create policy "client updates own clinica tareas" on public.tareas
  for update to authenticated using (clinica_id = public.my_clinica_id()) with check (clinica_id = public.my_clinica_id());
create policy "client deletes own tareas" on public.tareas
  for delete to authenticated using (clinica_id = public.my_clinica_id() and created_by = auth.uid());

-- ============ COMENTARIOS ============
create table public.tarea_comentarios (
  id uuid primary key default gen_random_uuid(),
  tarea_id uuid not null references public.tareas(id) on delete cascade,
  autor text not null,
  texto text not null,
  created_by uuid,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.tarea_comentarios to authenticated;
grant all on public.tarea_comentarios to service_role;
alter table public.tarea_comentarios enable row level security;
create policy "agency manages comentarios" on public.tarea_comentarios
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads comentarios" on public.tarea_comentarios
  for select to authenticated using (
    exists (select 1 from public.tareas t where t.id = tarea_id and t.clinica_id = public.my_clinica_id())
  );
create policy "client writes comentarios" on public.tarea_comentarios
  for insert to authenticated with check (
    exists (select 1 from public.tareas t where t.id = tarea_id and t.clinica_id = public.my_clinica_id())
  );

-- ============ PASOS ============
create table public.pasos (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  servicio_slug servicio_slug,
  texto text not null,
  fecha_iso date,
  tipo text not null default 'accion',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.pasos to authenticated;
grant all on public.pasos to service_role;
alter table public.pasos enable row level security;
create trigger pasos_updated_at before update on public.pasos
  for each row execute function public.update_updated_at_column();
create policy "agency manages pasos" on public.pasos
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own pasos" on public.pasos
  for select to authenticated using (clinica_id = public.my_clinica_id());

-- ============ LOOMS ============
create table public.looms (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  semana integer not null default 1,
  fecha date,
  titulo text not null,
  duracion text not null default '5 min',
  tags text[] not null default '{}',
  servicios_slugs servicio_slug[] not null default '{}',
  resumen text[] not null default '{}',
  link_loom text not null default '',
  visto_cliente boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.looms to authenticated;
grant all on public.looms to service_role;
alter table public.looms enable row level security;
create trigger looms_updated_at before update on public.looms
  for each row execute function public.update_updated_at_column();
create policy "agency manages looms" on public.looms
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own looms" on public.looms
  for select to authenticated using (clinica_id = public.my_clinica_id());
create policy "client updates visto" on public.looms
  for update to authenticated using (clinica_id = public.my_clinica_id()) with check (clinica_id = public.my_clinica_id());

-- ============ RECURSOS ============
create table public.recursos (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  titulo text not null,
  descripcion text not null default '',
  tipo text not null default 'link',
  categoria text not null default 'accesos',
  link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.recursos to authenticated;
grant all on public.recursos to service_role;
alter table public.recursos enable row level security;
create trigger recursos_updated_at before update on public.recursos
  for each row execute function public.update_updated_at_column();
create policy "agency manages recursos" on public.recursos
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own recursos" on public.recursos
  for select to authenticated using (clinica_id = public.my_clinica_id());

-- ============ METRICAS ============
create table public.metricas (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  servicio_slug servicio_slug not null,
  metric_name text not null,
  current_value text not null default '0',
  trend_percentage text not null default '0%',
  positivo boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.metricas to authenticated;
grant all on public.metricas to service_role;
alter table public.metricas enable row level security;
create trigger metricas_updated_at before update on public.metricas
  for each row execute function public.update_updated_at_column();
create policy "agency manages metricas" on public.metricas
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own metricas" on public.metricas
  for select to authenticated using (clinica_id = public.my_clinica_id());

-- ============ MIEMBROS ============
create table public.miembros (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  nombre text not null,
  rol text not null default '',
  equipo text not null default 'cliente',
  email text,
  avatar_color text not null default '#0A7C6A',
  iniciales text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.miembros to authenticated;
grant all on public.miembros to service_role;
alter table public.miembros enable row level security;
create trigger miembros_updated_at before update on public.miembros
  for each row execute function public.update_updated_at_column();
create policy "agency manages miembros" on public.miembros
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own miembros" on public.miembros
  for select to authenticated using (clinica_id = public.my_clinica_id());

-- ============ INVITACIONES ============
create table public.team_invitations (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  nombre text not null,
  email text not null,
  rol text not null default 'Miembro',
  status invitation_status not null default 'pending_approval',
  invited_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.team_invitations to authenticated;
grant all on public.team_invitations to service_role;
alter table public.team_invitations enable row level security;
create trigger team_invitations_updated_at before update on public.team_invitations
  for each row execute function public.update_updated_at_column();
create policy "agency manages invitations" on public.team_invitations
  for all to authenticated using (public.is_agency(auth.uid())) with check (public.is_agency(auth.uid()));
create policy "client reads own invitations" on public.team_invitations
  for select to authenticated using (clinica_id = public.my_clinica_id());
create policy "client creates invitations" on public.team_invitations
  for insert to authenticated with check (clinica_id = public.my_clinica_id() and status = 'pending_approval');

-- ============ SEED CLINICAS ============
insert into public.clinicas (nombre_clinica, nombre_doctor, paquete, fecha_inicio, asesor, whatsapp_link, servicios_contratados, color, iniciales) values
  ('Clínica Dental García', 'Dr. Carlos García', 'Pro', current_date - 60, 'Emilio Sandoval', 'https://wa.me/50200000000', '{diseno-web,seo,go-high-level,agentes-ia}', '#0A7C6A', 'CG'),
  ('Sonrisas del Valle', 'Dra. Ana Ruiz', 'Starter', current_date - 30, 'Emilio Sandoval', 'https://wa.me/50200000000', '{diseno-web,seo}', '#2563EB', 'SV'),
  ('OrtoMax Dental', 'Dr. Luis Pérez', 'Completo', current_date - 15, 'Emilio Sandoval', 'https://wa.me/50200000000', '{diseno-web,seo,go-high-level}', '#EA580C', 'OM');