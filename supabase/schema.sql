-- ============================================================
-- PDKS (Personel Devam Kontrol Sistemi) - Supabase Şeması
-- Bu dosyanın tamamını Supabase Dashboard > SQL Editor içine
-- yapıştırıp "Run" butonuna basarak çalıştırın.
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- 1) ÇALIŞANLAR
-- ------------------------------------------------------------
create table if not exists employees (
  id           uuid primary key default gen_random_uuid(),
  full_name    text not null,
  qr_token     text not null unique default encode(gen_random_bytes(16), 'hex'),
  department   text,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2) GENEL AYARLAR (mesai saatleri, tolerans, konum)
-- Tek satırlık ayar tablosu (id = 1)
-- ------------------------------------------------------------
create table if not exists work_settings (
  id                          int primary key default 1,
  work_start                  time not null default '09:00',
  work_end                    time not null default '18:00',
  late_tolerance_minutes      int  not null default 10,
  early_leave_tolerance_min   int  not null default 10,
  geo_required                boolean not null default false,
  workplace_lat               double precision,
  workplace_lng                double precision,
  geo_radius_meters           int  not null default 150,
  constraint single_row check (id = 1)
);

insert into work_settings (id) values (1)
  on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 3) GİRİŞ / ÇIKIŞ KAYITLARI
-- ------------------------------------------------------------
create table if not exists attendance_logs (
  id                  uuid primary key default gen_random_uuid(),
  employee_id         uuid not null references employees(id) on delete cascade,
  log_type            text not null check (log_type in ('in', 'out')),
  logged_at           timestamptz not null default now(),
  work_date           date not null default (now() at time zone 'Europe/Istanbul')::date,
  is_late             boolean not null default false,
  is_early_leave      boolean not null default false,
  lat                 double precision,
  lng                 double precision,
  distance_ok         boolean,
  work_duration_min   int,          -- yalnızca 'out' kayıtlarında, ilgili 'in' ile arasındaki süre
  created_at          timestamptz not null default now()
);

create index if not exists idx_attendance_employee_date
  on attendance_logs (employee_id, work_date);

create index if not exists idx_attendance_work_date
  on attendance_logs (work_date);

-- ------------------------------------------------------------
-- RLS: Tüm tablolara sadece sunucu tarafı (service role) yazar/okur.
-- Next.js API route'ları service role key kullandığı için RLS'i
-- bypass eder. Anon key ile doğrudan erişim tamamen kapalıdır,
-- bu da güvenliği basitleştirir.
-- ------------------------------------------------------------
alter table employees enable row level security;
alter table work_settings enable row level security;
alter table attendance_logs enable row level security;

-- Varsayılan olarak hiçbir policy yok = anon key ile hiçbir şey
-- okunamaz/yazılamaz. Sadece service role (server) erişebilir.
