-- Authenticated-only row level security for the generic farm schema.
-- Run this after `supabase_farm_schema.sql`.

create or replace function public.is_farm_owner(farm_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.farms f
    where f.id = farm_uuid
      and f.created_by = auth.uid()
  );
$$;

create or replace function public.can_access_farm(farm_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_farm_owner(farm_uuid)
    or exists (
      select 1
      from public.farm_members m
      where m.farm_id = farm_uuid
        and m.user_id = auth.uid()
    );
$$;

create or replace function public.can_access_batch(batch_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.batches b
    where b.id = batch_uuid
      and public.can_access_farm(b.farm_id)
  );
$$;

create or replace function public.can_access_location(location_uuid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.locations l
    where l.id = location_uuid
      and public.can_access_farm(l.farm_id)
  );
$$;

alter table if exists public.farm_types enable row level security;
alter table if exists public.farms enable row level security;
alter table if exists public.farm_members enable row level security;
alter table if exists public.units enable row level security;
alter table if exists public.categories enable row level security;
alter table if exists public.sub_categories enable row level security;
alter table if exists public.partners enable row level security;
alter table if exists public.locations enable row level security;
alter table if exists public.items enable row level security;
alter table if exists public.batches enable row level security;
alter table if exists public.batch_locations enable row level security;
alter table if exists public.expenses enable row level security;
alter table if exists public.sales enable row level security;
alter table if exists public.inventory_movements enable row level security;
alter table if exists public.batch_metrics enable row level security;
alter table if exists public.farm_app_state enable row level security;

drop policy if exists farm_types_authenticated_access on public.farm_types;
create policy farm_types_authenticated_access
on public.farm_types
for all
to authenticated
using (true)
with check (true);

drop policy if exists units_authenticated_access on public.units;
create policy units_authenticated_access
on public.units
for all
to authenticated
using (true)
with check (true);

drop policy if exists categories_authenticated_access on public.categories;
create policy categories_authenticated_access
on public.categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists sub_categories_authenticated_access on public.sub_categories;
create policy sub_categories_authenticated_access
on public.sub_categories
for all
to authenticated
using (true)
with check (true);

drop policy if exists partners_authenticated_access on public.partners;
create policy partners_authenticated_access
on public.partners
for all
to authenticated
using (true)
with check (true);

drop policy if exists items_authenticated_access on public.items;
create policy items_authenticated_access
on public.items
for all
to authenticated
using (true)
with check (true);

drop policy if exists farms_authenticated_select on public.farms;
create policy farms_authenticated_select
on public.farms
for select
to authenticated
using (public.can_access_farm(id));

drop policy if exists farms_authenticated_insert on public.farms;
create policy farms_authenticated_insert
on public.farms
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists farms_authenticated_update on public.farms;
create policy farms_authenticated_update
on public.farms
for update
to authenticated
using (public.can_access_farm(id))
with check (public.can_access_farm(id) and created_by = auth.uid());

drop policy if exists farms_authenticated_delete on public.farms;
create policy farms_authenticated_delete
on public.farms
for delete
to authenticated
using (public.can_access_farm(id));

drop policy if exists farm_members_authenticated_select on public.farm_members;
create policy farm_members_authenticated_select
on public.farm_members
for select
to authenticated
using (public.can_access_farm(farm_id) or user_id = auth.uid());

drop policy if exists farm_members_authenticated_insert on public.farm_members;
create policy farm_members_authenticated_insert
on public.farm_members
for insert
to authenticated
with check (public.is_farm_owner(farm_id));

drop policy if exists farm_members_authenticated_update on public.farm_members;
create policy farm_members_authenticated_update
on public.farm_members
for update
to authenticated
using (public.is_farm_owner(farm_id))
with check (public.is_farm_owner(farm_id));

drop policy if exists farm_members_authenticated_delete on public.farm_members;
create policy farm_members_authenticated_delete
on public.farm_members
for delete
to authenticated
using (public.is_farm_owner(farm_id));

drop policy if exists locations_authenticated_select on public.locations;
create policy locations_authenticated_select
on public.locations
for select
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists locations_authenticated_insert on public.locations;
create policy locations_authenticated_insert
on public.locations
for insert
to authenticated
with check (public.can_access_farm(farm_id));

drop policy if exists locations_authenticated_update on public.locations;
create policy locations_authenticated_update
on public.locations
for update
to authenticated
using (public.can_access_farm(farm_id))
with check (public.can_access_farm(farm_id));

drop policy if exists locations_authenticated_delete on public.locations;
create policy locations_authenticated_delete
on public.locations
for delete
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists batches_authenticated_select on public.batches;
create policy batches_authenticated_select
on public.batches
for select
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists batches_authenticated_insert on public.batches;
create policy batches_authenticated_insert
on public.batches
for insert
to authenticated
with check (public.can_access_farm(farm_id));

drop policy if exists batches_authenticated_update on public.batches;
create policy batches_authenticated_update
on public.batches
for update
to authenticated
using (public.can_access_farm(farm_id))
with check (public.can_access_farm(farm_id));

drop policy if exists batches_authenticated_delete on public.batches;
create policy batches_authenticated_delete
on public.batches
for delete
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists batch_locations_authenticated_select on public.batch_locations;
create policy batch_locations_authenticated_select
on public.batch_locations
for select
to authenticated
using (public.can_access_batch(batch_id) and public.can_access_location(location_id));

drop policy if exists batch_locations_authenticated_insert on public.batch_locations;
create policy batch_locations_authenticated_insert
on public.batch_locations
for insert
to authenticated
with check (public.can_access_batch(batch_id) and public.can_access_location(location_id));

drop policy if exists batch_locations_authenticated_update on public.batch_locations;
create policy batch_locations_authenticated_update
on public.batch_locations
for update
to authenticated
using (public.can_access_batch(batch_id) and public.can_access_location(location_id))
with check (public.can_access_batch(batch_id) and public.can_access_location(location_id));

drop policy if exists batch_locations_authenticated_delete on public.batch_locations;
create policy batch_locations_authenticated_delete
on public.batch_locations
for delete
to authenticated
using (public.can_access_batch(batch_id) and public.can_access_location(location_id));

drop policy if exists expenses_authenticated_select on public.expenses;
create policy expenses_authenticated_select
on public.expenses
for select
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists expenses_authenticated_insert on public.expenses;
create policy expenses_authenticated_insert
on public.expenses
for insert
to authenticated
with check (
  public.can_access_farm(farm_id)
  and (batch_id is null or public.can_access_batch(batch_id))
);

drop policy if exists expenses_authenticated_update on public.expenses;
create policy expenses_authenticated_update
on public.expenses
for update
to authenticated
using (public.can_access_farm(farm_id))
with check (
  public.can_access_farm(farm_id)
  and (batch_id is null or public.can_access_batch(batch_id))
);

drop policy if exists expenses_authenticated_delete on public.expenses;
create policy expenses_authenticated_delete
on public.expenses
for delete
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists sales_authenticated_select on public.sales;
create policy sales_authenticated_select
on public.sales
for select
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists sales_authenticated_insert on public.sales;
create policy sales_authenticated_insert
on public.sales
for insert
to authenticated
with check (
  public.can_access_farm(farm_id)
  and (batch_id is null or public.can_access_batch(batch_id))
);

drop policy if exists sales_authenticated_update on public.sales;
create policy sales_authenticated_update
on public.sales
for update
to authenticated
using (public.can_access_farm(farm_id))
with check (
  public.can_access_farm(farm_id)
  and (batch_id is null or public.can_access_batch(batch_id))
);

drop policy if exists sales_authenticated_delete on public.sales;
create policy sales_authenticated_delete
on public.sales
for delete
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists inventory_movements_authenticated_select on public.inventory_movements;
create policy inventory_movements_authenticated_select
on public.inventory_movements
for select
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists inventory_movements_authenticated_insert on public.inventory_movements;
create policy inventory_movements_authenticated_insert
on public.inventory_movements
for insert
to authenticated
with check (
  public.can_access_farm(farm_id)
  and (batch_id is null or public.can_access_batch(batch_id))
);

drop policy if exists inventory_movements_authenticated_update on public.inventory_movements;
create policy inventory_movements_authenticated_update
on public.inventory_movements
for update
to authenticated
using (public.can_access_farm(farm_id))
with check (
  public.can_access_farm(farm_id)
  and (batch_id is null or public.can_access_batch(batch_id))
);

drop policy if exists inventory_movements_authenticated_delete on public.inventory_movements;
create policy inventory_movements_authenticated_delete
on public.inventory_movements
for delete
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists batch_metrics_authenticated_select on public.batch_metrics;
create policy batch_metrics_authenticated_select
on public.batch_metrics
for select
to authenticated
using (public.can_access_batch(batch_id));

drop policy if exists batch_metrics_authenticated_insert on public.batch_metrics;
create policy batch_metrics_authenticated_insert
on public.batch_metrics
for insert
to authenticated
with check (public.can_access_batch(batch_id));

drop policy if exists batch_metrics_authenticated_update on public.batch_metrics;
create policy batch_metrics_authenticated_update
on public.batch_metrics
for update
to authenticated
using (public.can_access_batch(batch_id))
with check (public.can_access_batch(batch_id));

drop policy if exists batch_metrics_authenticated_delete on public.batch_metrics;
create policy batch_metrics_authenticated_delete
on public.batch_metrics
for delete
to authenticated
using (public.can_access_batch(batch_id));

drop policy if exists farm_app_state_authenticated_select on public.farm_app_state;
create policy farm_app_state_authenticated_select
on public.farm_app_state
for select
to authenticated
using (public.can_access_farm(farm_id));

drop policy if exists farm_app_state_authenticated_insert on public.farm_app_state;
create policy farm_app_state_authenticated_insert
on public.farm_app_state
for insert
to authenticated
with check (public.can_access_farm(farm_id));

drop policy if exists farm_app_state_authenticated_update on public.farm_app_state;
create policy farm_app_state_authenticated_update
on public.farm_app_state
for update
to authenticated
using (public.can_access_farm(farm_id))
with check (public.can_access_farm(farm_id));

drop policy if exists farm_app_state_authenticated_delete on public.farm_app_state;
create policy farm_app_state_authenticated_delete
on public.farm_app_state
for delete
to authenticated
using (public.can_access_farm(farm_id));
