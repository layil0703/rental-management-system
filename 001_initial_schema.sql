-- Initial PostgreSQL schema for rental management system
-- Supports master lease management, agency management, assets, floor plans, repairs, and ROI snapshots.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  phone text,
  role text not null check (role in ('admin', 'manager', 'accounting', 'staff', 'landlord', 'tenant')),
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  department text,
  title text,
  employee_code text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table landlords (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  id_number text,
  address text,
  bank_name text,
  bank_branch text,
  bank_account_name text,
  bank_account_number text,
  tax_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  id_number text,
  birthday date,
  emergency_contact_name text,
  emergency_contact_phone text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  city text,
  district text,
  property_type text,
  owner_landlord_id uuid references landlords(id) on delete set null,
  total_floor int,
  built_area_ping numeric(10,2),
  status text not null default 'active' check (status in ('active', 'inactive', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table units (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_name text not null,
  floor text,
  layout text,
  size_ping numeric(10,2),
  bedrooms int,
  bathrooms int,
  has_balcony boolean not null default false,
  current_status text not null default 'vacant' check (current_status in ('vacant', 'occupied', 'reserved', 'under_repair', 'unavailable')),
  market_rent_amount int not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table management_cases (
  id uuid primary key default gen_random_uuid(),
  case_no text unique,
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  landlord_id uuid not null references landlords(id) on delete restrict,
  management_type text not null check (management_type in ('master_lease', 'agency_management')),
  case_status text not null default 'draft' check (case_status in ('draft', 'active', 'paused', 'ended', 'cancelled')),
  start_date date,
  end_date date,
  responsible_staff_id uuid references users(id) on delete set null,
  source text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table master_lease_terms (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references management_cases(id) on delete cascade,
  rent_to_landlord int not null default 0 check (rent_to_landlord >= 0),
  expected_rent_from_tenant int not null default 0 check (expected_rent_from_tenant >= 0),
  guaranteed_rent_amount int check (guaranteed_rent_amount is null or guaranteed_rent_amount >= 0),
  vacancy_risk_owner text not null default 'company' check (vacancy_risk_owner in ('company', 'landlord', 'shared')),
  landlord_payment_day int check (landlord_payment_day between 1 and 31),
  company_profit_model text not null default 'rent_spread',
  deposit_to_landlord int not null default 0 check (deposit_to_landlord >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table agency_management_terms (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references management_cases(id) on delete cascade,
  management_fee_type text not null default 'fixed' check (management_fee_type in ('fixed', 'percentage', 'mixed')),
  management_fee_amount int not null default 0 check (management_fee_amount >= 0),
  management_fee_rate numeric(5,2) check (management_fee_rate is null or management_fee_rate >= 0),
  tenant_placement_fee int not null default 0 check (tenant_placement_fee >= 0),
  rent_collection_by text not null default 'company' check (rent_collection_by in ('company', 'landlord')),
  repair_approval_limit int not null default 0 check (repair_approval_limit >= 0),
  landlord_payout_cycle text not null default 'monthly' check (landlord_payout_cycle in ('monthly', 'biweekly', 'weekly', 'custom')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table leases (
  id uuid primary key default gen_random_uuid(),
  lease_no text unique,
  case_id uuid not null references management_cases(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  tenant_id uuid references tenants(id) on delete set null,
  lease_type text not null default 'tenant_lease' check (lease_type in ('tenant_lease', 'landlord_master_lease')),
  start_date date not null,
  end_date date not null,
  monthly_rent int not null default 0 check (monthly_rent >= 0),
  deposit_amount int not null default 0 check (deposit_amount >= 0),
  payment_day int not null default 1 check (payment_day between 1 and 31),
  status text not null default 'draft' check (status in ('draft', 'active', 'expiring', 'ended', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table rent_charges (
  id uuid primary key default gen_random_uuid(),
  lease_id uuid references leases(id) on delete set null,
  case_id uuid not null references management_cases(id) on delete cascade,
  charge_month date not null,
  charge_type text not null default 'rent' check (charge_type in ('rent', 'management_fee', 'placement_fee', 'service_fee', 'utility', 'other')),
  amount_due int not null default 0 check (amount_due >= 0),
  due_date date,
  status text not null default 'unpaid' check (status in ('unpaid', 'partial', 'paid', 'overdue', 'voided')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  rent_charge_id uuid references rent_charges(id) on delete set null,
  case_id uuid references management_cases(id) on delete set null,
  payer_type text not null check (payer_type in ('tenant', 'landlord', 'company', 'other')),
  payer_id uuid,
  amount int not null default 0 check (amount >= 0),
  payment_date date not null,
  payment_method text,
  status text not null default 'paid' check (status in ('pending', 'paid', 'failed', 'refunded', 'voided')),
  receipt_no text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table landlord_payouts (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references management_cases(id) on delete cascade,
  landlord_id uuid not null references landlords(id) on delete restrict,
  payout_month date not null,
  amount int not null default 0 check (amount >= 0),
  payout_date date,
  status text not null default 'unpaid' check (status in ('unpaid', 'scheduled', 'paid', 'held', 'voided')),
  payout_method text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table expenses (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references management_cases(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  unit_id uuid references units(id) on delete set null,
  expense_type text not null check (expense_type in ('landlord_rent', 'repair', 'cleaning', 'appliance', 'furniture', 'renovation', 'utility', 'management', 'agency_fee', 'admin', 'other')),
  amount int not null default 0 check (amount >= 0),
  paid_by text not null default 'company' check (paid_by in ('company', 'landlord', 'tenant', 'shared')),
  reimbursable boolean not null default false,
  reimbursement_status text not null default 'not_required' check (reimbursement_status in ('not_required', 'pending', 'requested', 'reimbursed', 'rejected')),
  occurred_date date not null,
  vendor_name text,
  invoice_no text,
  included_in_roi boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_floor_plans (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  case_id uuid references management_cases(id) on delete set null,
  title text not null,
  plan_type text not null check (plan_type in ('2d', 'pseudo_3d', 'pdf', 'furniture_layout', 'before_renovation', 'after_renovation', 'utility_layout', 'other')),
  file_url text not null,
  file_mime_type text,
  file_size int check (file_size is null or file_size >= 0),
  image_width int check (image_width is null or image_width > 0),
  image_height int check (image_height is null or image_height > 0),
  is_primary boolean not null default false,
  visibility text not null default 'internal' check (visibility in ('internal', 'landlord', 'tenant', 'public')),
  uploaded_by uuid references users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_assets (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  case_id uuid references management_cases(id) on delete set null,
  asset_name text not null,
  category text not null,
  brand text,
  model text,
  serial_no text,
  purchase_amount int not null default 0 check (purchase_amount >= 0),
  purchase_date date,
  paid_by text not null default 'company' check (paid_by in ('company', 'landlord', 'tenant', 'shared')),
  useful_life_months int not null default 36 check (useful_life_months > 0),
  monthly_depreciation int not null default 0 check (monthly_depreciation >= 0),
  current_status text not null default 'active' check (current_status in ('active', 'repairing', 'retired', 'lost', 'sold')),
  floor_plan_id uuid references property_floor_plans(id) on delete set null,
  included_in_roi boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_initial_costs (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  case_id uuid references management_cases(id) on delete set null,
  cost_type text not null,
  amount int not null default 0 check (amount >= 0),
  paid_by text not null default 'company' check (paid_by in ('company', 'landlord', 'tenant', 'shared')),
  occurred_date date not null,
  amortization_months int not null default 12 check (amortization_months > 0),
  monthly_amortization int not null default 0 check (monthly_amortization >= 0),
  included_in_roi boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table maintenance_requests (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references management_cases(id) on delete set null,
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  tenant_id uuid references tenants(id) on delete set null,
  title text not null,
  description text,
  status text not null default 'reported' check (status in ('reported', 'reviewing', 'approved', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  reported_at timestamptz not null default now(),
  completed_at timestamptz,
  vendor_name text,
  estimated_cost int not null default 0 check (estimated_cost >= 0),
  actual_cost int not null default 0 check (actual_cost >= 0),
  paid_by text check (paid_by is null or paid_by in ('company', 'landlord', 'tenant', 'shared')),
  reimbursable boolean not null default false,
  floor_plan_id uuid references property_floor_plans(id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table floor_plan_markers (
  id uuid primary key default gen_random_uuid(),
  floor_plan_id uuid not null references property_floor_plans(id) on delete cascade,
  marker_type text not null check (marker_type in ('asset', 'maintenance', 'room', 'utility', 'note', 'other')),
  related_asset_id uuid references property_assets(id) on delete set null,
  related_maintenance_request_id uuid references maintenance_requests(id) on delete set null,
  label text,
  x_position numeric(8,5) not null check (x_position >= 0 and x_position <= 1),
  y_position numeric(8,5) not null check (y_position >= 0 and y_position <= 1),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references management_cases(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  unit_id uuid references units(id) on delete set null,
  lease_id uuid references leases(id) on delete set null,
  document_type text not null,
  title text not null,
  file_url text not null,
  file_mime_type text,
  file_size int check (file_size is null or file_size >= 0),
  visibility text not null default 'internal' check (visibility in ('internal', 'landlord', 'tenant', 'public')),
  uploaded_by uuid references users(id) on delete set null,
  uploaded_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table property_roi_snapshots (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  unit_id uuid references units(id) on delete set null,
  case_id uuid not null references management_cases(id) on delete cascade,
  month date not null,
  management_type text not null check (management_type in ('master_lease', 'agency_management')),
  total_income int not null default 0,
  total_expense int not null default 0,
  asset_depreciation int not null default 0,
  initial_cost_allocated int not null default 0,
  net_profit int not null default 0,
  cumulative_profit int not null default 0,
  company_invested_amount int not null default 0 check (company_invested_amount >= 0),
  payback_month int,
  annualized_roi numeric(8,2),
  calculated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (case_id, month)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

create index idx_staff_profiles_user_id on staff_profiles(user_id);
create index idx_properties_owner_landlord_id on properties(owner_landlord_id);
create index idx_units_property_id on units(property_id);
create index idx_management_cases_property_id on management_cases(property_id);
create index idx_management_cases_unit_id on management_cases(unit_id);
create index idx_management_cases_landlord_id on management_cases(landlord_id);
create index idx_management_cases_management_type on management_cases(management_type);
create index idx_leases_case_id on leases(case_id);
create index idx_rent_charges_case_month on rent_charges(case_id, charge_month);
create index idx_payments_case_date on payments(case_id, payment_date);
create index idx_landlord_payouts_case_month on landlord_payouts(case_id, payout_month);
create index idx_expenses_case_date on expenses(case_id, occurred_date);
create index idx_property_assets_case_id on property_assets(case_id);
create index idx_property_initial_costs_case_id on property_initial_costs(case_id);
create index idx_property_floor_plans_property_unit on property_floor_plans(property_id, unit_id);
create index idx_floor_plan_markers_floor_plan_id on floor_plan_markers(floor_plan_id);
create index idx_documents_case_id on documents(case_id);
create index idx_maintenance_requests_case_status on maintenance_requests(case_id, status);
create index idx_property_roi_snapshots_case_month on property_roi_snapshots(case_id, month);

create trigger trg_users_updated_at before update on users for each row execute function set_updated_at();
create trigger trg_staff_profiles_updated_at before update on staff_profiles for each row execute function set_updated_at();
create trigger trg_landlords_updated_at before update on landlords for each row execute function set_updated_at();
create trigger trg_tenants_updated_at before update on tenants for each row execute function set_updated_at();
create trigger trg_properties_updated_at before update on properties for each row execute function set_updated_at();
create trigger trg_units_updated_at before update on units for each row execute function set_updated_at();
create trigger trg_management_cases_updated_at before update on management_cases for each row execute function set_updated_at();
create trigger trg_master_lease_terms_updated_at before update on master_lease_terms for each row execute function set_updated_at();
create trigger trg_agency_management_terms_updated_at before update on agency_management_terms for each row execute function set_updated_at();
create trigger trg_leases_updated_at before update on leases for each row execute function set_updated_at();
create trigger trg_rent_charges_updated_at before update on rent_charges for each row execute function set_updated_at();
create trigger trg_payments_updated_at before update on payments for each row execute function set_updated_at();
create trigger trg_landlord_payouts_updated_at before update on landlord_payouts for each row execute function set_updated_at();
create trigger trg_expenses_updated_at before update on expenses for each row execute function set_updated_at();
create trigger trg_property_floor_plans_updated_at before update on property_floor_plans for each row execute function set_updated_at();
create trigger trg_property_assets_updated_at before update on property_assets for each row execute function set_updated_at();
create trigger trg_property_initial_costs_updated_at before update on property_initial_costs for each row execute function set_updated_at();
create trigger trg_maintenance_requests_updated_at before update on maintenance_requests for each row execute function set_updated_at();
create trigger trg_floor_plan_markers_updated_at before update on floor_plan_markers for each row execute function set_updated_at();
create trigger trg_documents_updated_at before update on documents for each row execute function set_updated_at();
