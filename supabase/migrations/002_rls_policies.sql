-- ============================================================
-- 002_rls_policies.sql  — Row Level Security
-- Pattern: client=own rows, staff=assigned rows, admin/ceo=all
-- ============================================================

-- Helper: check if the current user has a given role
create or replace function has_role(check_role text)
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = check_role)
$$;

create or replace function is_staff_or_above()
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('staff','admin','ceo'))
$$;

create or replace function is_admin_or_ceo()
returns boolean language sql security definer stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('admin','ceo'))
$$;

-- ===== profiles =====
alter table profiles enable row level security;
create policy "profiles: own row" on profiles for select using (id = auth.uid());
create policy "profiles: staff see all" on profiles for select using (is_staff_or_above());
create policy "profiles: own update" on profiles for update using (id = auth.uid());

-- ===== clients =====
alter table clients enable row level security;
create policy "clients: own row" on clients for select using (profile_id = auth.uid());
create policy "clients: assigned staff" on clients for select using (assigned_staff_id = auth.uid());
create policy "clients: admin all" on clients for all using (is_admin_or_ceo());
create policy "clients: staff see all" on clients for select using (is_staff_or_above());
create policy "clients: staff update assigned" on clients for update using (assigned_staff_id = auth.uid());

-- ===== cases =====
alter table cases enable row level security;
create policy "cases: client own" on cases for select using (
  client_id in (select id from clients where profile_id = auth.uid())
);
create policy "cases: assigned staff" on cases for select using (assigned_staff_id = auth.uid());
create policy "cases: staff see all" on cases for select using (is_staff_or_above());
create policy "cases: staff write" on cases for insert with check (is_staff_or_above());
create policy "cases: staff update" on cases for update using (is_staff_or_above());
create policy "cases: admin delete" on cases for delete using (is_admin_or_ceo());

-- ===== documents =====
alter table documents enable row level security;
create policy "documents: client own" on documents for select using (
  client_id in (select id from clients where profile_id = auth.uid())
);
create policy "documents: staff see all" on documents for select using (is_staff_or_above());
create policy "documents: client upload" on documents for insert with check (
  client_id in (select id from clients where profile_id = auth.uid())
);
create policy "documents: staff write" on documents for insert with check (is_staff_or_above());
create policy "documents: staff update" on documents for update using (is_staff_or_above());

-- ===== messages =====
alter table messages enable row level security;
create policy "messages: case participants" on messages for select using (
  case_id in (
    select c.id from cases c
    join clients cl on cl.id = c.client_id
    where cl.profile_id = auth.uid() or c.assigned_staff_id = auth.uid()
  )
  or is_staff_or_above()
);
create policy "messages: participants send" on messages for insert with check (sender_id = auth.uid());

-- ===== appointments =====
alter table appointments enable row level security;
create policy "appointments: client own" on appointments for select using (
  client_id in (select id from clients where profile_id = auth.uid())
);
create policy "appointments: staff" on appointments for select using (staff_id = auth.uid() or is_admin_or_ceo());
create policy "appointments: client book" on appointments for insert with check (
  client_id in (select id from clients where profile_id = auth.uid())
);
create policy "appointments: staff write" on appointments for all using (is_staff_or_above());

-- ===== invoices =====
alter table invoices enable row level security;
create policy "invoices: client own" on invoices for select using (
  client_id in (select id from clients where profile_id = auth.uid())
);
create policy "invoices: staff all" on invoices for all using (is_staff_or_above());

-- ===== leads =====
alter table leads enable row level security;
create policy "leads: staff see all" on leads for select using (is_staff_or_above());
create policy "leads: public insert" on leads for insert with check (true);

-- ===== asset_cache =====
alter table asset_cache enable row level security;
create policy "asset_cache: public read" on asset_cache for select using (true);
create policy "asset_cache: service write" on asset_cache for all using (is_staff_or_above());

-- ===== audit_log =====
alter table audit_log enable row level security;
create policy "audit_log: admin read" on audit_log for select using (is_admin_or_ceo());
create policy "audit_log: service insert" on audit_log for insert with check (true);
