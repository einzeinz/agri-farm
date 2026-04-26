-- Demo seed data for the generic farm schema.
-- Run this after the schema and RLS scripts.
-- Replace the demo user UUID if you want the farm to belong to a real auth user.

create extension if not exists pgcrypto;

do $$
declare
  demo_owner_id uuid := '11111111-1111-1111-1111-111111111111';
  v_pig_type_id uuid;
  v_farm_id uuid;
  v_feed_category_id uuid;
  v_stock_category_id uuid;
  v_starter_subcategory_id uuid;
  v_grower_subcategory_id uuid;
  v_piglets_subcategory_id uuid;
  v_kg_unit_id uuid;
  v_head_unit_id uuid;
  v_sack_unit_id uuid;
  v_bottle_unit_id uuid;
  v_supplier_partner_id uuid;
  v_buyer_partner_id uuid;
  v_main_location_id uuid;
  v_grower_location_id uuid;
  v_batch_id uuid;
  v_starter_feed_item_id uuid;
  v_grower_feed_item_id uuid;
  v_piglet_item_id uuid;
  v_vitamins_item_id uuid;
begin
  select id into demo_owner_id
  from auth.users
  order by created_at asc
  limit 1;

  if demo_owner_id is null then
    demo_owner_id := gen_random_uuid();

    insert into auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    )
    values (
      demo_owner_id,
      'authenticated',
      'authenticated',
      'demo@farm.local',
      crypt('ChangeMe123!', gen_salt('bf')),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"seeded":true}'::jsonb,
      timezone('utc', now()),
      timezone('utc', now())
    )
    on conflict (id) do nothing;
  end if;

  select id into v_pig_type_id from public.farm_types where code = 'pig' limit 1;
  select id into v_feed_category_id from public.categories where code = 'feed' limit 1;
  select id into v_stock_category_id from public.categories where code = 'stock_purchase' limit 1;
  select sc.id into v_starter_subcategory_id
  from public.sub_categories sc
  join public.categories c on c.id = sc.category_id
  where c.code = 'feed' and sc.code = 'starter'
  limit 1;
  select sc.id into v_grower_subcategory_id
  from public.sub_categories sc
  join public.categories c on c.id = sc.category_id
  where c.code = 'feed' and sc.code = 'grower'
  limit 1;
  select sc.id into v_piglets_subcategory_id
  from public.sub_categories sc
  join public.categories c on c.id = sc.category_id
  where c.code = 'stock_purchase' and sc.code = 'piglets'
  limit 1;
  select id into v_kg_unit_id from public.units where code = 'kg' limit 1;
  select id into v_head_unit_id from public.units where code = 'head' limit 1;
  select id into v_sack_unit_id from public.units where code = 'sack' limit 1;
  select id into v_bottle_unit_id from public.units where code = 'bottle' limit 1;

  if v_pig_type_id is null or v_feed_category_id is null or v_stock_category_id is null then
    raise exception 'Required seed master data is missing. Run the schema seed inserts first.';
  end if;

  select id into v_farm_id
  from public.farms
  where name = 'Demo Pig Farm'
  limit 1;

  if v_farm_id is null then
    insert into public.farms (farm_type_id, name, location, notes, created_by)
    values (v_pig_type_id, 'Demo Pig Farm', 'Sample Location', 'Seeded farm for testing', demo_owner_id)
    returning id into v_farm_id;
  end if;

  insert into public.farm_members (farm_id, user_id, role)
  values (v_farm_id, demo_owner_id, 'owner')
  on conflict (farm_id, user_id) do update
    set role = excluded.role;

  select id into v_supplier_partner_id
  from public.partners
  where name = 'ABC Feeds Supply'
  limit 1;
  if v_supplier_partner_id is null then
    insert into public.partners (name, partner_type, contact_no, address, notes)
    values ('ABC Feeds Supply', 'supplier', '09170000001', 'Sample City', 'Demo supplier')
    returning id into v_supplier_partner_id;
  end if;

  select id into v_buyer_partner_id
  from public.partners
  where name = 'Local Buyer'
  limit 1;
  if v_buyer_partner_id is null then
    insert into public.partners (name, partner_type, contact_no, address, notes)
    values ('Local Buyer', 'buyer', '09170000002', 'Market Road', 'Demo buyer')
    returning id into v_buyer_partner_id;
  end if;

  select id into v_main_location_id
  from public.locations
  where farm_id = v_farm_id and name = 'Main Pen'
  limit 1;
  if v_main_location_id is null then
    insert into public.locations (farm_id, name, location_type, notes)
    values (v_farm_id, 'Main Pen', 'pen', 'Primary housing area')
    returning id into v_main_location_id;
  end if;

  select id into v_grower_location_id
  from public.locations
  where farm_id = v_farm_id and name = 'Grower Pen'
  limit 1;
  if v_grower_location_id is null then
    insert into public.locations (farm_id, name, location_type, notes)
    values (v_farm_id, 'Grower Pen', 'pen', 'Grower area')
    returning id into v_grower_location_id;
  end if;

  select id into v_batch_id
  from public.batches
  where farm_id = v_farm_id and name = 'Pig Batch 001'
  limit 1;
  if v_batch_id is null then
    insert into public.batches (
      farm_id,
      name,
      batch_type,
      status,
      start_date,
      opening_qty,
      opening_uom_id,
      notes
    )
    values (
      v_farm_id,
      'Pig Batch 001',
      'grow-out',
      'active',
      current_date - 30,
      26,
      v_head_unit_id,
      'Demo batch'
    )
    returning id into v_batch_id;
  end if;

  insert into public.batch_locations (batch_id, location_id)
  values (v_batch_id, v_main_location_id)
  on conflict (batch_id, location_id) do nothing;

  select id into v_starter_feed_item_id
  from public.items
  where code = 'starter_feed'
  limit 1;
  if v_starter_feed_item_id is null then
    insert into public.items (
      farm_type_id,
      category_id,
      sub_category_id,
      code,
      name,
      default_unit_id,
      sku,
      notes
    )
    values (
      v_pig_type_id,
      v_feed_category_id,
      v_starter_subcategory_id,
      'starter_feed',
      'Starter Feed',
      v_sack_unit_id,
      'FEED-STARTER',
      'Demo feed item'
    )
    returning id into v_starter_feed_item_id;
  end if;

  select id into v_grower_feed_item_id
  from public.items
  where code = 'grower_feed'
  limit 1;
  if v_grower_feed_item_id is null then
    insert into public.items (
      farm_type_id,
      category_id,
      sub_category_id,
      code,
      name,
      default_unit_id,
      sku,
      notes
    )
    values (
      v_pig_type_id,
      v_feed_category_id,
      v_grower_subcategory_id,
      'grower_feed',
      'Grower Feed',
      v_sack_unit_id,
      'FEED-GROWER',
      'Demo feed item'
    )
    returning id into v_grower_feed_item_id;
  end if;

  select id into v_piglet_item_id
  from public.items
  where code = 'piglet_stock'
  limit 1;
  if v_piglet_item_id is null then
    insert into public.items (
      farm_type_id,
      category_id,
      sub_category_id,
      code,
      name,
      default_unit_id,
      sku,
      notes
    )
    values (
      v_pig_type_id,
      v_stock_category_id,
      v_piglets_subcategory_id,
      'piglet_stock',
      'Piglet Stock',
      v_head_unit_id,
      'STOCK-PIGLET',
      'Demo stock item'
    )
    returning id into v_piglet_item_id;
  end if;

  select id into v_vitamins_item_id
  from public.items
  where code = 'vitamins'
  limit 1;
  if v_vitamins_item_id is null then
    insert into public.items (
      farm_type_id,
      category_id,
      code,
      name,
      default_unit_id,
      sku,
      notes
    )
    values (
      v_pig_type_id,
      v_feed_category_id,
      'vitamins',
      'Vitamins',
      v_bottle_unit_id,
      'MED-VITAMINS',
      'Demo medicine item'
    )
    returning id into v_vitamins_item_id;
  end if;

  delete from public.expenses
  where farm_id = v_farm_id
    and remarks in ('Starter feed purchase', 'Piglet purchase', 'Grower feed purchase');

  insert into public.expenses (
    farm_id,
    batch_id,
    expense_date,
    category_id,
    sub_category_id,
    item_id,
    partner_id,
    quantity,
    unit_id,
    unit_cost,
    total_amount,
    remarks
  )
  values
    (
      v_farm_id,
      v_batch_id,
      current_date - 28,
      v_feed_category_id,
      v_starter_subcategory_id,
      v_starter_feed_item_id,
      v_supplier_partner_id,
      10,
      v_sack_unit_id,
      950,
      9500,
      'Starter feed purchase'
    ),
    (
      v_farm_id,
      v_batch_id,
      current_date - 20,
      v_stock_category_id,
      v_piglets_subcategory_id,
      v_piglet_item_id,
      v_supplier_partner_id,
      26,
      v_head_unit_id,
      3800,
      98800,
      'Piglet purchase'
    ),
    (
      v_farm_id,
      v_batch_id,
      current_date - 10,
      v_feed_category_id,
      v_grower_subcategory_id,
      v_grower_feed_item_id,
      v_supplier_partner_id,
      8,
      v_sack_unit_id,
      1050,
      8400,
      'Grower feed purchase'
    );

  delete from public.sales
  where farm_id = v_farm_id
    and remarks in ('Partial batch sale', 'Second batch sale');

  insert into public.sales (
    farm_id,
    batch_id,
    sale_date,
    item_id,
    partner_id,
    quantity,
    unit_id,
    unit_price,
    total_amount,
    remarks
  )
  values
    (
      v_farm_id,
      v_batch_id,
      current_date - 2,
      v_piglet_item_id,
      v_buyer_partner_id,
      12,
      v_head_unit_id,
      6200,
      74400,
      'Partial batch sale'
    ),
    (
      v_farm_id,
      v_batch_id,
      current_date - 1,
      v_piglet_item_id,
      v_buyer_partner_id,
      10,
      v_head_unit_id,
      6400,
      64000,
      'Second batch sale'
    );

  delete from public.batch_metrics
  where batch_id = v_batch_id
    and metric_name in ('Average Weight', 'Mortality');

  insert into public.batch_metrics (
    batch_id,
    metric_date,
    metric_name,
    metric_value,
    unit_id,
    remarks
  )
  values
    (v_batch_id, current_date - 7, 'Average Weight', 54.5, v_kg_unit_id, 'Sample metric'),
    (v_batch_id, current_date - 7, 'Mortality', 1, v_head_unit_id, 'Sample metric');
end $$;
