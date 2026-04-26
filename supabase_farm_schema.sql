-- Generic farm management schema for Supabase/Postgres
-- Supports pig, chicken, fish, and other farm types.
-- Run this in the Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.farm_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  sale_type text not null default 'per_kilo',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.farm_types
  add column if not exists sale_type text not null default 'per_kilo';

create table if not exists public.farms (
  id uuid primary key default gen_random_uuid(),
  farm_type_id uuid not null references public.farm_types(id) on delete restrict,
  name text not null,
  location text,
  notes text,
  created_by uuid not null default auth.uid(),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.farm_members (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (farm_id, user_id)
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  unit_type text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  farm_type_id uuid references public.farm_types(id) on delete set null,
  code text not null unique,
  name text not null,
  category_group text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (farm_type_id, code)
);

create table if not exists public.sub_categories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  code text not null,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (category_id, code)
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  partner_type text not null,
  contact_no text,
  address text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  location_type text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (farm_id, name)
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  farm_type_id uuid references public.farm_types(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  sub_category_id uuid references public.sub_categories(id) on delete set null,
  code text,
  name text not null,
  default_unit_id uuid references public.units(id) on delete set null,
  sku text,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  name text not null,
  batch_type text,
  status text not null default 'active',
  start_date date,
  end_date date,
  opening_qty numeric(14,2),
  opening_uom_id uuid references public.units(id) on delete set null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (farm_id, name)
);

alter table if exists public.batches
  drop constraint if exists batches_farm_id_batch_code_key;

alter table if exists public.batches
  drop constraint if exists batches_farm_id_name_key;

alter table if exists public.batches
  drop column if exists batch_code;

alter table if exists public.batches
  add constraint batches_farm_id_name_key unique (farm_id, name);

create table if not exists public.batch_locations (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (batch_id, location_id)
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  expense_date date not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  sub_category_id uuid references public.sub_categories(id) on delete set null,
  item_id uuid references public.items(id) on delete set null,
  partner_id uuid references public.partners(id) on delete set null,
  quantity numeric(14,2),
  unit_id uuid references public.units(id) on delete set null,
  unit_cost numeric(14,2),
  total_amount numeric(14,2) not null default 0,
  remarks text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  sale_date date not null,
  item_id uuid references public.items(id) on delete set null,
  partner_id uuid references public.partners(id) on delete set null,
  quantity numeric(14,2) not null default 0,
  unit_id uuid references public.units(id) on delete set null,
  unit_price numeric(14,2) not null default 0,
  total_amount numeric(14,2) not null default 0,
  remarks text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade,
  batch_id uuid references public.batches(id) on delete set null,
  movement_date date not null,
  item_id uuid not null references public.items(id) on delete restrict,
  from_location_id uuid references public.locations(id) on delete set null,
  to_location_id uuid references public.locations(id) on delete set null,
  movement_type text not null,
  quantity numeric(14,2) not null default 0,
  unit_id uuid references public.units(id) on delete set null,
  reference_type text,
  reference_id uuid,
  remarks text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.batch_metrics (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.batches(id) on delete cascade,
  metric_date date not null,
  metric_name text not null,
  metric_value numeric(14,4) not null,
  unit_id uuid references public.units(id) on delete set null,
  remarks text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.farm_app_state (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid not null references public.farms(id) on delete cascade unique,
  state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_farms_farm_type_id on public.farms (farm_type_id);
create index if not exists idx_farm_members_farm_id on public.farm_members (farm_id);
create index if not exists idx_farm_members_user_id on public.farm_members (user_id);
create index if not exists idx_categories_farm_type_id on public.categories (farm_type_id);
create index if not exists idx_sub_categories_category_id on public.sub_categories (category_id);
create index if not exists idx_items_category_id on public.items (category_id);
create index if not exists idx_items_sub_category_id on public.items (sub_category_id);
create index if not exists idx_batches_farm_id on public.batches (farm_id);
create index if not exists idx_expenses_farm_id on public.expenses (farm_id);
create index if not exists idx_expenses_batch_id on public.expenses (batch_id);
create index if not exists idx_sales_farm_id on public.sales (farm_id);
create index if not exists idx_sales_batch_id on public.sales (batch_id);
create index if not exists idx_inventory_movements_farm_id on public.inventory_movements (farm_id);
create index if not exists idx_inventory_movements_batch_id on public.inventory_movements (batch_id);
create index if not exists idx_batch_metrics_batch_id on public.batch_metrics (batch_id);
create index if not exists idx_farm_app_state_farm_id on public.farm_app_state (farm_id);

drop trigger if exists trg_farm_types_updated_at on public.farm_types;
create trigger trg_farm_types_updated_at
before update on public.farm_types
for each row execute function public.set_updated_at();

drop trigger if exists trg_farms_updated_at on public.farms;
create trigger trg_farms_updated_at
before update on public.farms
for each row execute function public.set_updated_at();

drop trigger if exists trg_farm_members_updated_at on public.farm_members;
create trigger trg_farm_members_updated_at
before update on public.farm_members
for each row execute function public.set_updated_at();

create or replace function public.add_farm_owner_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.farm_members (farm_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (farm_id, user_id) do update
    set role = excluded.role,
        updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_farms_add_owner_member on public.farms;
create trigger trg_farms_add_owner_member
after insert on public.farms
for each row execute function public.add_farm_owner_member();

drop trigger if exists trg_units_updated_at on public.units;
create trigger trg_units_updated_at
before update on public.units
for each row execute function public.set_updated_at();

drop trigger if exists trg_categories_updated_at on public.categories;
create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_sub_categories_updated_at on public.sub_categories;
create trigger trg_sub_categories_updated_at
before update on public.sub_categories
for each row execute function public.set_updated_at();

drop trigger if exists trg_partners_updated_at on public.partners;
create trigger trg_partners_updated_at
before update on public.partners
for each row execute function public.set_updated_at();

drop trigger if exists trg_locations_updated_at on public.locations;
create trigger trg_locations_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

drop trigger if exists trg_items_updated_at on public.items;
create trigger trg_items_updated_at
before update on public.items
for each row execute function public.set_updated_at();

drop trigger if exists trg_batches_updated_at on public.batches;
create trigger trg_batches_updated_at
before update on public.batches
for each row execute function public.set_updated_at();

drop trigger if exists trg_expenses_updated_at on public.expenses;
create trigger trg_expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

drop trigger if exists trg_sales_updated_at on public.sales;
create trigger trg_sales_updated_at
before update on public.sales
for each row execute function public.set_updated_at();

drop trigger if exists trg_inventory_movements_updated_at on public.inventory_movements;
create trigger trg_inventory_movements_updated_at
before update on public.inventory_movements
for each row execute function public.set_updated_at();

drop trigger if exists trg_batch_metrics_updated_at on public.batch_metrics;
create trigger trg_batch_metrics_updated_at
before update on public.batch_metrics
for each row execute function public.set_updated_at();

drop trigger if exists trg_farm_app_state_updated_at on public.farm_app_state;
create trigger trg_farm_app_state_updated_at
before update on public.farm_app_state
for each row execute function public.set_updated_at();

insert into public.farm_types (code, name, sale_type)
values
  ('pig', 'Pig', 'per_kilo'),
  ('chicken', 'Chicken', 'per_kilo'),
  ('fish', 'Fish', 'per_quantity')
on conflict (code) do update
  set name = excluded.name,
      sale_type = excluded.sale_type;

insert into public.units (code, name, unit_type)
values
  ('kg', 'Kilogram', 'mass'),
  ('g', 'Gram', 'mass'),
  ('head', 'Head', 'count'),
  ('pc', 'Piece', 'count'),
  ('sack', 'Sack', 'volume'),
  ('bag', 'Bag', 'volume'),
  ('bottle', 'Bottle', 'volume'),
  ('liter', 'Liter', 'volume'),
  ('box', 'Box', 'count')
on conflict (code) do nothing;

insert into public.categories (code, name, category_group)
values
  ('feed', 'Feed', 'Operating'),
  ('stock_purchase', 'Stock Purchase', 'Operating'),
  ('medication', 'Medication', 'Operating'),
  ('labor', 'Labor', 'Operating'),
  ('transport', 'Transport', 'Operating'),
  ('utilities', 'Utilities', 'Operating'),
  ('equipment', 'Equipment', 'Capital'),
  ('misc', 'Miscellaneous', 'Operating')
on conflict (code) do nothing;

insert into public.sub_categories (category_id, code, name)
select c.id, x.code, x.name
from public.categories c
join (
  values
    ('feed', 'starter', 'Starter'),
    ('feed', 'grower', 'Grower'),
    ('feed', 'finisher', 'Finisher'),
    ('feed', 'pre_starter', 'Pre-Starter'),
    ('stock_purchase', 'piglets', 'Piglets'),
    ('stock_purchase', 'chicks', 'Chicks'),
    ('stock_purchase', 'fingerlings', 'Fingerlings'),
    ('medication', 'vitamins', 'Vitamins'),
    ('medication', 'antibiotics', 'Antibiotics'),
    ('medication', 'deworming', 'Deworming'),
    ('transport', 'pickup', 'Pickup'),
    ('transport', 'delivery', 'Delivery')
) as x(category_code, code, name)
  on c.code = x.category_code
on conflict (category_id, code) do nothing;
