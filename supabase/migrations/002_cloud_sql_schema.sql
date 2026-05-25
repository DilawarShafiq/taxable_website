-- ============================================================
-- 002_cloud_sql_schema.sql
-- Adapted for Cloud SQL PostgreSQL (no Supabase auth.users dependency)
-- profiles.id uses Firebase UID (text), not uuid FK to auth.users
-- ============================================================

-- Profiles (keyed by Firebase UID)
create table if not exists profiles (
  id text primary key,
  email text,
  full_name text not null,
  role text not null default 'client' check (role in ('client','staff','admin','ceo')),
  phone text,
  preferred_jurisdiction text check (preferred_jurisdiction in ('usa','uk','saudi','pakistan')),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clients (business/individual client records)
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  profile_id text unique references profiles(id) on delete set null,
  company_name text,
  business_type text check (business_type in ('sole_trader','limited_company','partnership','individual','llc','corporation')),
  jurisdictions text[] not null default '{}',
  assigned_staff_id text references profiles(id) on delete set null,
  status text not null default 'onboarding' check (status in ('active','inactive','onboarding')),
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Cases
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  assigned_staff_id text references profiles(id) on delete set null,
  type text not null check (type in ('tax_filing','audit','accounting','consultation')),
  jurisdiction text not null check (jurisdiction in ('usa','uk','saudi','pakistan')),
  tax_year int,
  status text not null default 'open' check (status in ('open','in_review','pending_docs','filed','closed')),
  title text not null,
  notes text,
  due_date date,
  filed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  case_id uuid references cases(id) on delete set null,
  uploaded_by text references profiles(id) on delete set null,
  requested_by text references profiles(id) on delete set null,
  file_path text not null,
  file_name text not null,
  file_size_bytes bigint,
  mime_type text,
  processing_status text not null default 'pending' check (processing_status in ('pending','processing','done','failed')),
  extracted_data jsonb,
  created_at timestamptz not null default now()
);

-- Messages (per case thread)
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  sender_id text not null references profiles(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

-- Appointments
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  staff_id text not null references profiles(id) on delete cascade,
  starts_at timestamptz not null,
  duration_minutes int not null default 60,
  type text check (type in ('consultation','review','follow_up')),
  notes text,
  status text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  created_at timestamptz not null default now()
);

-- Invoices
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  case_id uuid references cases(id) on delete set null,
  amount_usd numeric(10,2) not null check (amount_usd > 0),
  currency text not null default 'USD',
  status text not null default 'draft' check (status in ('draft','sent','paid','overdue')),
  due_date date,
  paid_at timestamptz,
  line_items jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Leads (from marketing website — not linked to auth)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  jurisdiction text,
  service_interest text,
  message text,
  source text check (source in ('chatbot','contact_form','demo','asset_dashboard')),
  converted_client_id uuid references clients(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Asset price cache (financial data)
create table if not exists asset_cache (
  id uuid primary key default gen_random_uuid(),
  asset_type text not null check (asset_type in ('stock','crypto','real_estate')),
  symbol text not null,
  time_range text not null check (time_range in ('1y','3y','5y','10y')),
  data_points jsonb not null default '[]',
  source text,
  last_updated timestamptz not null default now(),
  unique (symbol, time_range)
);

-- Audit log (immutable)
create table if not exists audit_log (
  id bigserial primary key,
  actor_id text references profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- updated_at triggers
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger set_profiles_updated_at before update on profiles for each row execute procedure set_updated_at();
create trigger set_clients_updated_at before update on clients for each row execute procedure set_updated_at();
create trigger set_cases_updated_at before update on cases for each row execute procedure set_updated_at();
create trigger set_invoices_updated_at before update on invoices for each row execute procedure set_updated_at();
