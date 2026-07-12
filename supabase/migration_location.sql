-- ============================================================
-- PDKS - Atölye / Şantiye Konum Etiketi Eklentisi
-- Bu dosyayı Supabase SQL Editor'de çalıştırın.
-- attendance_logs tablosuna konum bilgisi ekler; böylece şantiye
-- girişleri de normal giriş/çıkış gibi rapor ve bordroya dahil olur.
-- ============================================================

alter table attendance_logs
  add column if not exists location text not null default 'atolye',
  add column if not exists site_label text;

comment on column attendance_logs.location is 'atolye | saha - kaydın nerede yapıldığı';
comment on column attendance_logs.site_label is 'Şantiye ise konum açıklaması (örn. Gümüştepe)';
