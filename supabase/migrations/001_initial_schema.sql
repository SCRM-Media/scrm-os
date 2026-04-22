-- ============================================================
-- SCRM OS — Initial Schema Migration
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum (
  'admin', 'manager', 'content_creator', 'editor', 'viewer'
);

create type employee_role as enum (
  'Social Media Manager', 'Editor', 'Content Creator',
  'Marketing Manager', 'Operations Manager', 'Founder'
);

create type employee_region as enum (
  'Melbourne', 'Sydney', 'Brisbane', 'Perth', 'Newcastle'
);

create type client_status as enum (
  'Active', 'Onboarding', 'Paused', 'Churned'
);

create type account_health as enum (
  'Green', 'Amber', 'Red'
);

create type filming_cadence as enum (
  'Weekly', 'Fortnightly'
);

create type carbee_model as enum (
  'Recurring Sessions', 'Stock Target'
);

create type inventory_video_style as enum (
  'Style 1 Phone Edited On Spot', 'Style 2 Camera Edited Next Day'
);

create type repeat_frequency as enum (
  'Weekly', 'Fortnightly', 'Monthly Week 0', 'Monthly Week 1', 'Monthly', 'None'
);

create type day_of_week as enum (
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
);

create type content_status as enum (
  'Planned', 'Shoot Booked', 'Filmed', 'Editing', 'QC', 'Ready for Scheduling', 'Published'
);

create type content_type as enum (
  'Car of the Week', 'Car Highlight', 'Culture Reel', 'Trendy TikTok Reel',
  'Informative Reel', 'Reel Support Post', 'Delivery Post', 'Reel Support Story',
  'Testimonial Story', 'Ad'
);

create type content_format as enum (
  'Reel', 'Post', 'Story', 'Ad'
);

create type content_repeat_frequency as enum (
  '1w', '2w', '3w', '4w'
);

create type lead_type as enum (
  'Lead Form', 'Landing Page'
);

create type planning_meeting_status as enum (
  'Scheduled', 'Completed', 'Cancelled'
);

create type audit_action as enum (
  'create', 'update', 'delete'
);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- TABLE: user_profiles
-- ============================================================

create table user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role user_role not null default 'viewer',
  employee_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_user_profiles_updated_at
  before update on user_profiles
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: employees
-- ============================================================

create table employees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role employee_role not null,
  region employee_region not null,
  phone text,
  email text,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_employees_updated_at
  before update on employees
  for each row execute function set_updated_at();

-- Add FK from user_profiles to employees after both tables exist
alter table user_profiles
  add constraint user_profiles_employee_id_fkey
  foreign key (employee_id) references employees(id) on delete set null;

-- ============================================================
-- TABLE: packages
-- ============================================================

create table packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  base_price numeric,
  is_system boolean not null default false,
  monthly_video_count integer,
  posts_per_week integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_packages_updated_at
  before update on packages
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: package_blocks
-- ============================================================

create table package_blocks (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references packages(id) on delete cascade,
  block_type text not null,
  duration_minutes integer not null,
  repeat_frequency repeat_frequency not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_package_blocks_updated_at
  before update on package_blocks
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: inventory_packages
-- ============================================================

create table inventory_packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  cars_per_hour numeric,
  cars_per_hour_video numeric,
  photos_per_car integer,
  includes_video_default boolean not null default false,
  video_style_default inventory_video_style,
  price_per_car numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_inventory_packages_updated_at
  before update on inventory_packages
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: clients
-- ============================================================

create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  package_id uuid references packages(id) on delete set null,
  status client_status not null default 'Onboarding',
  monthly_value numeric,
  filming_cadence filming_cadence,
  location text,
  state text,
  address text,
  dealer_group text,
  account_health account_health not null default 'Green',
  content_notes text,
  add_ons text[] default '{}',
  monthly_google_reviews integer,
  brand_pack text,
  cycle_start_date date,
  service_agreement_date date,
  onboarding_progress jsonb default '{}',
  filming_guide text,
  editing_guide text,
  -- CarBee fields
  carbee_enabled boolean not null default false,
  carbee_model carbee_model,
  carbee_cars_per_session integer,
  carbee_session_duration_minutes integer,
  carbee_target_cars integer,
  carbee_stock_percentage numeric,
  carbee_total_stock integer,
  carbee_monthly_turnover integer,
  carbee_google_sheet_link text,
  carbee_notes text,
  carbee_sessions_per_week integer default 1,
  carbee_session_schedule jsonb default '[]',
  -- Inventory Photography fields
  inventory_enabled boolean not null default false,
  inventory_includes_video boolean not null default false,
  inventory_video_style inventory_video_style,
  inventory_cars_per_hour_photos numeric,
  inventory_cars_per_hour_video numeric,
  inventory_cars_per_session integer,
  inventory_session_duration_minutes integer,
  inventory_upload_destination text,
  inventory_google_sheet_link text,
  inventory_notes text,
  inventory_shot_list text,
  inventory_positioning_instructions text,
  inventory_photos_per_car integer,
  inventory_specific_angles text,
  inventory_example_photos text[] default '{}',
  inventory_extra_notes text,
  inventory_sessions_per_week integer default 1,
  inventory_session_schedule jsonb default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_clients_updated_at
  before update on clients
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: contacts
-- ============================================================

create table contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  full_name text not null,
  position text,
  phone text,
  email text,
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_contacts_updated_at
  before update on contacts
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: block_rules
-- ============================================================

create table block_rules (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  block_type text not null,
  role text,
  employee_id uuid references employees(id) on delete set null,
  duration_minutes integer not null,
  day_of_week day_of_week not null,
  start_time text not null,
  repeat_frequency repeat_frequency not null,
  rule_start_date date not null,
  rule_end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_block_rules_updated_at
  before update on block_rules
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: block_exceptions
-- ============================================================

create table block_exceptions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  block_rule_id uuid not null references block_rules(id) on delete cascade,
  block_type text,
  original_date date not null,
  new_date date,
  new_start_time text,
  new_employee_id uuid references employees(id) on delete set null,
  is_cancelled boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (block_rule_id, original_date)
);

create trigger set_block_exceptions_updated_at
  before update on block_exceptions
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: client_block_assignments
-- ============================================================

create table client_block_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  block_type text not null,
  employee_id uuid not null references employees(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, block_type)
);

create trigger set_client_block_assignments_updated_at
  before update on client_block_assignments
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: planning_meetings
-- ============================================================

create table planning_meetings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  month text not null,
  meeting_date date,
  status planning_meeting_status not null default 'Scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, month)
);

create trigger set_planning_meetings_updated_at
  before update on planning_meetings
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: content_items
-- ============================================================

create table content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_id uuid not null references clients(id) on delete cascade,
  planning_meeting_id uuid references planning_meetings(id) on delete set null,
  content_type content_type not null,
  format content_format,
  template_tag text,
  status content_status not null default 'Planned',
  scheduled_date date,
  drive_folder_link text,
  caption text,
  brief text,
  editing_notes text,
  platform_override text,
  video_example_url text,
  video_example_title text,
  video_example_notes text,
  repeat_enabled boolean not null default false,
  repeat_frequency content_repeat_frequency,
  is_recurring_instance boolean not null default false,
  hook_1 text,
  hook_2 text,
  hook_3 text,
  ad_script text,
  ad_audience text,
  ad_budget numeric,
  ad_start_date date,
  ad_end_date date,
  lead_type lead_type,
  form_questions text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_content_items_updated_at
  before update on content_items
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: content_item_comments
-- ============================================================

create table content_item_comments (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references content_items(id) on delete cascade,
  author_id uuid references user_profiles(id) on delete set null,
  text text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: content_type_examples
-- ============================================================

create table content_type_examples (
  id uuid primary key default gen_random_uuid(),
  content_type content_type not null,
  title text not null,
  video_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_content_type_examples_updated_at
  before update on content_type_examples
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: inventory_sessions
-- ============================================================

create table inventory_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  session_date date not null,
  cars_photographed integer,
  duration_minutes integer,
  photographer_id uuid references employees(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_inventory_sessions_updated_at
  before update on inventory_sessions
  for each row execute function set_updated_at();

-- ============================================================
-- TABLE: audit_log
-- ============================================================

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references user_profiles(id) on delete set null,
  action audit_action not null,
  entity_type text not null,
  entity_id uuid not null,
  diff jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- AUDIT LOG TRIGGER FUNCTION
-- ============================================================

create or replace function log_audit() returns trigger as $$
begin
  insert into audit_log (actor_id, action, entity_type, entity_id, diff)
  values (
    auth.uid(),
    lower(TG_OP)::audit_action,
    TG_TABLE_NAME,
    coalesce(NEW.id, OLD.id),
    jsonb_build_object(
      'before', case when TG_OP = 'INSERT' then null else to_jsonb(OLD) end,
      'after',  case when TG_OP = 'DELETE' then null else to_jsonb(NEW) end
    )
  );
  return coalesce(NEW, OLD);
end;
$$ language plpgsql security definer;

-- Attach audit triggers to all business-critical tables
create trigger audit_clients
  after insert or update or delete on clients
  for each row execute function log_audit();

create trigger audit_employees
  after insert or update or delete on employees
  for each row execute function log_audit();

create trigger audit_packages
  after insert or update or delete on packages
  for each row execute function log_audit();

create trigger audit_package_blocks
  after insert or update or delete on package_blocks
  for each row execute function log_audit();

create trigger audit_contacts
  after insert or update or delete on contacts
  for each row execute function log_audit();

create trigger audit_block_rules
  after insert or update or delete on block_rules
  for each row execute function log_audit();

create trigger audit_block_exceptions
  after insert or update or delete on block_exceptions
  for each row execute function log_audit();

create trigger audit_client_block_assignments
  after insert or update or delete on client_block_assignments
  for each row execute function log_audit();

create trigger audit_content_items
  after insert or update or delete on content_items
  for each row execute function log_audit();

create trigger audit_planning_meetings
  after insert or update or delete on planning_meetings
  for each row execute function log_audit();

create trigger audit_inventory_packages
  after insert or update or delete on inventory_packages
  for each row execute function log_audit();

create trigger audit_user_profiles
  after insert or update or delete on user_profiles
  for each row execute function log_audit();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table user_profiles enable row level security;
alter table employees enable row level security;
alter table packages enable row level security;
alter table package_blocks enable row level security;
alter table inventory_packages enable row level security;
alter table clients enable row level security;
alter table contacts enable row level security;
alter table block_rules enable row level security;
alter table block_exceptions enable row level security;
alter table client_block_assignments enable row level security;
alter table planning_meetings enable row level security;
alter table content_items enable row level security;
alter table content_item_comments enable row level security;
alter table content_type_examples enable row level security;
alter table inventory_sessions enable row level security;
alter table audit_log enable row level security;

-- Helper function: get current user's role
create or replace function current_user_role()
returns user_role as $$
  select role from user_profiles where id = auth.uid()
$$ language sql security definer stable;

-- Helper function: is admin or manager
create or replace function is_admin_or_manager()
returns boolean as $$
  select exists (
    select 1 from user_profiles
    where id = auth.uid()
    and role in ('admin', 'manager')
  )
$$ language sql security definer stable;

-- Helper function: is admin
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from user_profiles
    where id = auth.uid()
    and role = 'admin'
  )
$$ language sql security definer stable;

-- -------
-- user_profiles policies
-- -------
create policy "Users can read own profile"
  on user_profiles for select
  using (id = auth.uid() or is_admin_or_manager());

create policy "Users can update own profile"
  on user_profiles for update
  using (id = auth.uid());

create policy "Admins can manage all profiles"
  on user_profiles for all
  using (is_admin());

-- Auto-create user_profile on signup
-- security definer set search_path = public is required because
-- the trigger fires in the auth schema context
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    'viewer'
  );
  return new;
end;
$$;

grant execute on function public.handle_new_user() to supabase_auth_admin;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------
-- employees policies
-- -------
create policy "Authenticated users can read employees"
  on employees for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage employees"
  on employees for all
  using (is_admin_or_manager());

-- -------
-- packages policies
-- -------
create policy "Authenticated users can read packages"
  on packages for select
  using (auth.uid() is not null);

create policy "Admins can manage packages"
  on packages for all
  using (is_admin());

-- -------
-- package_blocks policies
-- -------
create policy "Authenticated users can read package_blocks"
  on package_blocks for select
  using (auth.uid() is not null);

create policy "Admins can manage package_blocks"
  on package_blocks for all
  using (is_admin());

-- -------
-- inventory_packages policies
-- -------
create policy "Authenticated users can read inventory_packages"
  on inventory_packages for select
  using (auth.uid() is not null);

create policy "Admins can manage inventory_packages"
  on inventory_packages for all
  using (is_admin());

-- -------
-- clients policies
-- -------
create policy "Authenticated users can read clients"
  on clients for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage clients"
  on clients for all
  using (is_admin_or_manager());

-- -------
-- contacts policies
-- -------
create policy "Authenticated users can read contacts"
  on contacts for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage contacts"
  on contacts for all
  using (is_admin_or_manager());

-- -------
-- block_rules policies
-- -------
create policy "Authenticated users can read block_rules"
  on block_rules for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage block_rules"
  on block_rules for all
  using (is_admin_or_manager());

-- -------
-- block_exceptions policies
-- -------
create policy "Authenticated users can read block_exceptions"
  on block_exceptions for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage block_exceptions"
  on block_exceptions for all
  using (is_admin_or_manager());

-- -------
-- client_block_assignments policies
-- -------
create policy "Authenticated users can read client_block_assignments"
  on client_block_assignments for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage client_block_assignments"
  on client_block_assignments for all
  using (is_admin_or_manager());

-- -------
-- planning_meetings policies
-- -------
create policy "Authenticated users can read planning_meetings"
  on planning_meetings for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage planning_meetings"
  on planning_meetings for all
  using (is_admin_or_manager());

-- -------
-- content_items policies
-- -------
create policy "Authenticated users can read content_items"
  on content_items for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage content_items"
  on content_items for all
  using (is_admin_or_manager());

create policy "Content creators and editors can update content_items"
  on content_items for update
  using (
    auth.uid() is not null and
    current_user_role() in ('content_creator', 'editor')
  );

-- -------
-- content_item_comments policies
-- -------
create policy "Authenticated users can read comments"
  on content_item_comments for select
  using (auth.uid() is not null);

create policy "Authenticated users can create comments"
  on content_item_comments for insert
  with check (auth.uid() is not null);

create policy "Authors can delete own comments"
  on content_item_comments for delete
  using (author_id = auth.uid());

-- -------
-- content_type_examples policies
-- -------
create policy "Authenticated users can read content_type_examples"
  on content_type_examples for select
  using (auth.uid() is not null);

create policy "Admins can manage content_type_examples"
  on content_type_examples for all
  using (is_admin());

-- -------
-- inventory_sessions policies
-- -------
create policy "Authenticated users can read inventory_sessions"
  on inventory_sessions for select
  using (auth.uid() is not null);

create policy "Admins and managers can manage inventory_sessions"
  on inventory_sessions for all
  using (is_admin_or_manager());

-- -------
-- audit_log policies
-- -------
create policy "Admins can read audit_log"
  on audit_log for select
  using (is_admin());

-- ============================================================
-- INDEXES for performance
-- ============================================================

create index idx_block_rules_client_id on block_rules(client_id);
create index idx_block_rules_employee_id on block_rules(employee_id);
create index idx_block_rules_rule_end_date on block_rules(rule_end_date) where rule_end_date is null;
create index idx_block_exceptions_rule_date on block_exceptions(block_rule_id, original_date);
create index idx_content_items_client_id on content_items(client_id);
create index idx_content_items_status on content_items(status);
create index idx_content_items_scheduled_date on content_items(scheduled_date);
create index idx_contacts_client_id on contacts(client_id);
create index idx_audit_log_entity on audit_log(entity_type, entity_id);
create index idx_audit_log_created_at on audit_log(created_at desc);
