import { supabaseAdmin } from "../../lib/supabaseAdmin";

function todayIstanbul() {
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" });
  return fmt.format(new Date());
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { qr_token, employee_id, note } = req.body;

    if (!qr_token && !employee_id) {
      return res.status(400).json({ error: "Personel belirtilmedi." });
    }
    if (!note?.trim()) {
      return res.status(400).json({ error: "Lütfen nerede olduğunuzu yazın." });
    }

    let empQuery = supabaseAdmin.from("employees").select("*").eq("is_active", true);
    empQuery = qr_token ? empQuery.eq("qr_token", qr_token) : empQuery.eq("id", employee_id);
    const { data: employee, error: empErr } = await empQuery.maybeSingle();

    if (empErr) throw empErr;
    if (!employee) {
      return res.status(404).json({ error: "Aktif personel bulunamadı." });
    }

    const work_date = todayIstanbul();

    const { data: inserted, error: insertErr } = await supabaseAdmin
      .from("field_notes")
      .insert({
        employee_id: employee.id,
        work_date,
        note: note.trim(),
      })
      .select()
      .single();

    if (insertErr) throw insertErr;

    return res.status(200).json({
      success: true,
      employee_name: employee.full_name,
      work_date: inserted.work_date,
      note: inserted.note,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
}
