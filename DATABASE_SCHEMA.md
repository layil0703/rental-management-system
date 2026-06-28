# 資料庫設計草案

版本：第一版資料庫欄位設計

用途：此文件用來規劃 PostgreSQL 資料庫。之後正式開發時，可依此轉成 migration 或 SQL schema。

## 1. 設計原則

- 每筆重要資料都要能追到案件 `management_cases`。
- 每個案件都要標記是包租代管或代租代管。
- 收入、支出、代墊、撥款都要可回溯。
- 家電、裝修、清潔等前置投入要能計入投報率。
- 平面圖、類 3D 格局圖、照片與文件要獨立管理。
- 投報率用每月快照保存，避免歷史報表被日後資料異動影響。
- 金額欄位建議使用整數儲存新台幣元，或使用 decimal(12,2)。第一版建議用整數元。

## 2. 共用狀態選項

```text
user_role:
- admin
- manager
- accounting
- staff
- landlord
- tenant

management_type:
- master_lease
- agency_management

case_status:
- draft
- active
- paused
- ended
- cancelled

unit_status:
- vacant
- occupied
- reserved
- under_repair
- unavailable

lease_status:
- draft
- active
- expiring
- ended
- cancelled

payment_status:
- unpaid
- partial
- paid
- overdue
- voided

expense_type:
- landlord_rent
- repair
- cleaning
- appliance
- furniture
- renovation
- utility
- management
- agency_fee
- admin
- other

paid_by:
- company
- landlord
- tenant
- shared

visibility:
- internal
- landlord
- tenant
- public
```

## 3. 使用者與人員

### users

系統登入與角色權限。

```text
id uuid primary key
name text not null
email text unique
phone text
role text not null
status text not null default 'active'
last_login_at timestamptz
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### staff_profiles

內部人員補充資料。

```text
id uuid primary key
user_id uuid references users(id)
department text
title text
employee_code text
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### landlords

房東資料。

```text
id uuid primary key
name text not null
phone text
email text
id_number text
address text
bank_name text
bank_branch text
bank_account_name text
bank_account_number text
tax_id text
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### tenants

房客資料。

```text
id uuid primary key
name text not null
phone text
email text
id_number text
birthday date
emergency_contact_name text
emergency_contact_phone text
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 4. 物件與房間

### properties

一個地址或一棟物件。

```text
id uuid primary key
name text not null
address text not null
city text
district text
property_type text
owner_landlord_id uuid references landlords(id)
total_floor int
built_area_ping decimal(10,2)
status text not null default 'active'
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### units

房間、套房、雅房、整層或戶別。

```text
id uuid primary key
property_id uuid not null references properties(id)
unit_name text not null
floor text
layout text
size_ping decimal(10,2)
bedrooms int
bathrooms int
has_balcony boolean default false
current_status text not null default 'vacant'
market_rent_amount int
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 5. 案件

### management_cases

所有包租代管與代租代管都從案件開始。

```text
id uuid primary key
case_no text unique
property_id uuid not null references properties(id)
unit_id uuid references units(id)
landlord_id uuid not null references landlords(id)
management_type text not null
case_status text not null default 'draft'
start_date date
end_date date
responsible_staff_id uuid references users(id)
source text
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### master_lease_terms

包租代管條件。

```text
id uuid primary key
case_id uuid not null unique references management_cases(id)
rent_to_landlord int not null default 0
expected_rent_from_tenant int not null default 0
guaranteed_rent_amount int
vacancy_risk_owner text not null default 'company'
landlord_payment_day int
company_profit_model text default 'rent_spread'
deposit_to_landlord int default 0
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### agency_management_terms

代租代管條件。

```text
id uuid primary key
case_id uuid not null unique references management_cases(id)
management_fee_type text not null default 'fixed'
management_fee_amount int not null default 0
management_fee_rate decimal(5,2)
tenant_placement_fee int default 0
rent_collection_by text not null default 'company'
repair_approval_limit int default 0
landlord_payout_cycle text default 'monthly'
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 6. 租約

### leases

房客租約。若包租代管需要記錄公司與房東的主租約，也可用 `lease_type` 區分。

```text
id uuid primary key
lease_no text unique
case_id uuid not null references management_cases(id)
unit_id uuid references units(id)
tenant_id uuid references tenants(id)
lease_type text not null default 'tenant_lease'
start_date date not null
end_date date not null
monthly_rent int not null default 0
deposit_amount int not null default 0
payment_day int not null default 1
status text not null default 'draft'
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 7. 收租與款項

### rent_charges

每月應收租金或服務費。

```text
id uuid primary key
lease_id uuid references leases(id)
case_id uuid not null references management_cases(id)
charge_month date not null
charge_type text not null default 'rent'
amount_due int not null default 0
due_date date
status text not null default 'unpaid'
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### payments

實際收到的款項。

```text
id uuid primary key
rent_charge_id uuid references rent_charges(id)
case_id uuid references management_cases(id)
payer_type text not null
payer_id uuid
amount int not null default 0
payment_date date not null
payment_method text
status text not null default 'paid'
receipt_no text
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### landlord_payouts

撥款給房東。

```text
id uuid primary key
case_id uuid not null references management_cases(id)
landlord_id uuid not null references landlords(id)
payout_month date not null
amount int not null default 0
payout_date date
status text not null default 'unpaid'
payout_method text
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### expenses

支出、代墊與成本。

```text
id uuid primary key
case_id uuid references management_cases(id)
property_id uuid references properties(id)
unit_id uuid references units(id)
expense_type text not null
amount int not null default 0
paid_by text not null default 'company'
reimbursable boolean not null default false
reimbursement_status text default 'not_required'
occurred_date date not null
vendor_name text
invoice_no text
included_in_roi boolean not null default true
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 8. 家電與前置投入

### property_assets

家電、家具、設備。

```text
id uuid primary key
property_id uuid not null references properties(id)
unit_id uuid references units(id)
case_id uuid references management_cases(id)
asset_name text not null
category text not null
brand text
model text
serial_no text
purchase_amount int not null default 0
purchase_date date
paid_by text not null default 'company'
useful_life_months int default 36
monthly_depreciation int default 0
current_status text not null default 'active'
floor_plan_id uuid
included_in_roi boolean not null default true
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### property_initial_costs

裝修、清潔、拍照、仲介等前置投入。

```text
id uuid primary key
property_id uuid not null references properties(id)
unit_id uuid references units(id)
case_id uuid references management_cases(id)
cost_type text not null
amount int not null default 0
paid_by text not null default 'company'
occurred_date date not null
amortization_months int default 12
monthly_amortization int default 0
included_in_roi boolean not null default true
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 9. 格局圖與附件

### property_floor_plans

平面圖、類 3D 圖、家具配置圖、裝修前後圖。

```text
id uuid primary key
property_id uuid not null references properties(id)
unit_id uuid references units(id)
case_id uuid references management_cases(id)
title text not null
plan_type text not null
file_url text not null
file_mime_type text
file_size int
image_width int
image_height int
is_primary boolean not null default false
visibility text not null default 'internal'
uploaded_by uuid references users(id)
uploaded_at timestamptz not null default now()
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### floor_plan_markers

格局圖上的設備位置、修繕位置、房間標記。

```text
id uuid primary key
floor_plan_id uuid not null references property_floor_plans(id)
marker_type text not null
related_asset_id uuid references property_assets(id)
related_maintenance_request_id uuid
label text
x_position decimal(8,5) not null
y_position decimal(8,5) not null
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

### documents

租約、身分文件、付款證明、照片與其他附件。

```text
id uuid primary key
case_id uuid references management_cases(id)
property_id uuid references properties(id)
unit_id uuid references units(id)
lease_id uuid references leases(id)
document_type text not null
title text not null
file_url text not null
file_mime_type text
file_size int
visibility text not null default 'internal'
uploaded_by uuid references users(id)
uploaded_at timestamptz not null default now()
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 10. 修繕

### maintenance_requests

修繕工單。

```text
id uuid primary key
case_id uuid references management_cases(id)
property_id uuid not null references properties(id)
unit_id uuid references units(id)
tenant_id uuid references tenants(id)
title text not null
description text
status text not null default 'reported'
priority text not null default 'normal'
reported_at timestamptz not null default now()
completed_at timestamptz
vendor_name text
estimated_cost int default 0
actual_cost int default 0
paid_by text
reimbursable boolean default false
floor_plan_id uuid references property_floor_plans(id)
notes text
created_at timestamptz not null default now()
updated_at timestamptz not null default now()
```

## 11. 投報率快照

### property_roi_snapshots

每月結算後保存的損益與投報率。

```text
id uuid primary key
property_id uuid not null references properties(id)
unit_id uuid references units(id)
case_id uuid not null references management_cases(id)
month date not null
management_type text not null
total_income int not null default 0
total_expense int not null default 0
asset_depreciation int not null default 0
initial_cost_allocated int not null default 0
net_profit int not null default 0
cumulative_profit int not null default 0
company_invested_amount int not null default 0
payback_month int
annualized_roi decimal(8,2)
calculated_at timestamptz not null default now()
created_at timestamptz not null default now()
```

## 12. 稽核紀錄

### audit_logs

記錄重要操作，方便追蹤誰改了資料。

```text
id uuid primary key
user_id uuid references users(id)
action text not null
table_name text not null
record_id uuid
before_data jsonb
after_data jsonb
created_at timestamptz not null default now()
```

## 13. 建議索引

```text
management_cases(property_id)
management_cases(unit_id)
management_cases(landlord_id)
management_cases(management_type)
leases(case_id)
rent_charges(case_id, charge_month)
payments(case_id, payment_date)
landlord_payouts(case_id, payout_month)
expenses(case_id, occurred_date)
property_assets(case_id)
property_initial_costs(case_id)
property_floor_plans(property_id, unit_id)
maintenance_requests(case_id, status)
property_roi_snapshots(case_id, month)
```

## 14. 下一步

下一步可以把這份設計轉成：

1. PostgreSQL SQL 建表檔。
2. Supabase migration。
3. Prisma schema。
4. Drizzle schema。

建議如果要快速開發 Next.js，第一版可選 Prisma 或 Drizzle；如果要先用 Supabase，則先產生 SQL migration。
