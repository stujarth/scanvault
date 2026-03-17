-- ScanVault Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Organisations
create table organisations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in ('garage', 'hire_company', 'insurance', 'dealership', 'police', 'car_park')),
  address text,
  postcode text,
  phone text,
  email text,
  logo_url text,
  default_grading_profile text default 'private_sale',
  subscription text default 'free' check (subscription in ('free', 'starter', 'professional', 'enterprise')),
  created_at timestamptz default now()
);

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null,
  role text not null default 'individual' check (role in ('individual', 'garage', 'hire_company', 'insurance', 'dealership', 'police', 'car_park', 'admin')),
  organisation_id uuid references organisations(id),
  avatar_url text,
  created_at timestamptz default now()
);

-- Vehicles
create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  registration_plate text not null,
  vin text,
  make text not null,
  model text not null,
  year integer not null,
  colour text,
  vehicle_type text not null check (vehicle_type in ('saloon', 'hatchback', 'suv', 'estate', 'van', 'pickup', 'coupe', 'convertible')),
  fuel_type text,
  mileage integer default 0,
  mot_expiry date,
  organisation_id uuid references organisations(id),
  owner_id uuid references profiles(id) not null,
  created_at timestamptz default now()
);

-- Scans
create table scans (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid references vehicles(id) not null,
  performed_by uuid references profiles(id) not null,
  type text not null default 'exterior_full' check (type in ('exterior_full', 'exterior_partial', 'undercarriage', 'interior')),
  status text not null default 'in_progress' check (status in ('in_progress', 'processing', 'complete', 'failed')),
  context text,
  mileage_at_scan integer,
  location text,
  notes text,
  weather_conditions text,
  duration integer, -- seconds
  image_count integer default 0,
  grade_overall integer,
  grade_label text,
  grade_profile text,
  grade_per_panel jsonb default '{}',
  created_at timestamptz default now()
);

-- Scan Images
create table scan_images (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid references scans(id) on delete cascade not null,
  position text not null, -- 'front', 'rear', 'left', 'right', 'front_left', 'front_right', 'rear_left', 'rear_right'
  image_url text not null,
  width integer,
  height integer,
  created_at timestamptz default now()
);

-- Damage Items
create table damage_items (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid references scans(id) on delete cascade not null,
  vehicle_id uuid references vehicles(id) not null,
  type text not null check (type in ('scratch', 'scuff', 'dent', 'chip', 'crack', 'rust', 'paint_peel', 'corrosion', 'structural')),
  severity text not null check (severity in ('negligible', 'minor', 'moderate', 'significant', 'severe')),
  panel text not null,
  description text,
  length_mm integer,
  width_mm integer,
  depth_mm integer,
  position_x numeric, -- 0-1 normalised
  position_y numeric, -- 0-1 normalised
  repair_cost_gbp numeric,
  repair_method text,
  is_new boolean default true,
  first_detected_scan_id uuid references scans(id),
  confidence numeric, -- AI confidence score 0-1
  created_at timestamptz default now()
);

-- Reports
create table reports (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid references vehicles(id) not null,
  scan_ids uuid[] not null,
  type text not null check (type in ('condition_report', 'hire_checkout', 'hire_return', 'mot_advisory', 'insurance_assessment', 'comparison', 'provenance')),
  title text not null,
  generated_by uuid references profiles(id) not null,
  grading_profile text,
  grade_overall integer,
  grade_label text,
  grade_per_panel jsonb default '{}',
  created_at timestamptz default now()
);

-- Shared Reports
create table shared_reports (
  id uuid primary key default uuid_generate_v4(),
  report_id uuid references reports(id) on delete cascade not null,
  shared_with_email text,
  shared_with_org_id uuid references organisations(id),
  access_level text default 'view' check (access_level in ('view', 'download')),
  access_token text unique default encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz,
  created_at timestamptz default now()
);

-- RPC: create an organisation for the current user and link their profile
create or replace function public.create_org_for_user(org_name text, org_type text)
returns uuid as $$
declare
  new_org_id uuid;
begin
  insert into organisations (name, type)
  values (org_name, org_type)
  returning id into new_org_id;

  update profiles
  set organisation_id = new_org_id
  where id = auth.uid();

  return new_org_id;
end;
$$ language plpgsql security definer;

-- Row Level Security
alter table organisations enable row level security;
alter table profiles enable row level security;
alter table vehicles enable row level security;
alter table scans enable row level security;
alter table scan_images enable row level security;
alter table damage_items enable row level security;
alter table reports enable row level security;
alter table shared_reports enable row level security;

-- Organisation policies
create policy "Users can read own org" on organisations for select
  using (id in (select organisation_id from profiles where id = auth.uid()));
create policy "Users can update own org" on organisations for update
  using (id in (select organisation_id from profiles where id = auth.uid()));
create policy "Service role can insert orgs" on organisations for insert
  with check (true); -- create_org_for_user runs as security definer

-- Profile policies
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can read org members" on profiles for select
  using (organisation_id in (select organisation_id from profiles where id = auth.uid()));

-- Vehicle policies: owner OR org members can read; only owner can insert
create policy "Users can read org vehicles" on vehicles for select
  using (
    owner_id = auth.uid()
    OR organisation_id IN (
      SELECT organisation_id FROM profiles WHERE id = auth.uid()
    )
  );
create policy "Users can insert own vehicles" on vehicles for insert with check (owner_id = auth.uid());
create policy "Users can update own vehicles" on vehicles for update using (owner_id = auth.uid());

-- Scan policies: performer OR org member (via vehicle) can read
create policy "Users can read org scans" on scans for select
  using (
    performed_by = auth.uid()
    OR vehicle_id IN (
      SELECT id FROM vehicles WHERE organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
      )
    )
  );
create policy "Users can insert own scans" on scans for insert with check (performed_by = auth.uid());
create policy "Users can update own scans" on scans for update using (performed_by = auth.uid());

-- Scan image policies: org-scoped via scan
create policy "Users can read org scan images" on scan_images for select
  using (scan_id IN (
    SELECT id FROM scans WHERE performed_by = auth.uid()
    OR vehicle_id IN (
      SELECT id FROM vehicles WHERE organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
      )
    )
  ));
create policy "Users can insert own scan images" on scan_images for insert
  with check (scan_id IN (SELECT id FROM scans WHERE performed_by = auth.uid()));

-- Damage item policies: org-scoped via vehicle
create policy "Users can read org damage items" on damage_items for select
  using (
    vehicle_id IN (
      SELECT id FROM vehicles WHERE owner_id = auth.uid()
      OR organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
      )
    )
  );
create policy "Users can insert own damage items" on damage_items for insert
  with check (scan_id IN (SELECT id FROM scans WHERE performed_by = auth.uid()));

-- Report policies: generator OR org members can read
create policy "Users can read org reports" on reports for select
  using (
    generated_by = auth.uid()
    OR vehicle_id IN (
      SELECT id FROM vehicles WHERE organisation_id IN (
        SELECT organisation_id FROM profiles WHERE id = auth.uid()
      )
    )
  );
create policy "Users can insert own reports" on reports for insert with check (generated_by = auth.uid());

-- Shared report policies: public access by token, org members can manage
create policy "Anyone can read shared reports by token" on shared_reports for select
  using (true); -- Token validation done at application level
create policy "Users can insert shared reports" on shared_reports for insert
  with check (report_id IN (SELECT id FROM reports WHERE generated_by = auth.uid()));
create policy "Users can delete own shared reports" on shared_reports for delete
  using (report_id IN (SELECT id FROM reports WHERE generated_by = auth.uid()));

-- Storage bucket for scan images
-- Run this separately or via Supabase dashboard:
-- insert into storage.buckets (id, name, public) values ('scan-images', 'scan-images', true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), coalesce(new.raw_user_meta_data->>'role', 'individual'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
