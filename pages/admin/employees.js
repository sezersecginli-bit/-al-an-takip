import { useEffect, useState } from "react";
import Head from "next/head";
import AdminLayout, { authedFetch } from "../../components/AdminLayout";
import EmployeeQRCard from "../../components/EmployeeQRCard";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [view, setView] = useState("list"); // list | qr
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await authedFetch("/api/employees");
    const data = await res.json();
    setEmployees(data.employees || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addEmployee = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    const res = await authedFetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name, department: dept }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setName("");
    setDept("");
    load();
  };

  const toggleActive = async (emp) => {
    await authedFetch("/api/employees", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: emp.id, is_active: !emp.is_active }),
    });
    load();
  };

  const removeEmployee = async (emp) => {
    if (!confirm(`${emp.full_name} silinsin mi? Bu işlem geri alınamaz.`)) return;
    await authedFetch("/api/employees", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: emp.id }),
    });
    load();
  };

  return (
    <AdminLayout>
      <Head><title>Personel - PDKS</title></Head>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Personel</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${view === "list" ? "bg-ink text-white" : "bg-panel border border-line text-ink/60"}`}
          >
            Liste
          </button>
          <button
            onClick={() => setView("qr")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${view === "qr" ? "bg-ink text-white" : "bg-panel border border-line text-ink/60"}`}
          >
            QR Kartları
          </button>
        </div>
      </div>

      <form onSubmit={addEmployee} className="bg-panel border border-line rounded-card p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-ink/60 mb-1">Ad Soyad</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm"
            placeholder="Ör. Ayşe Yılmaz"
            required
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="block text-xs font-medium text-ink/60 mb-1">Departman (opsiyonel)</label>
          <input
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2 text-sm"
            placeholder="Ör. Üretim"
          />
        </div>
        <button type="submit" className="rounded-full bg-brand text-white font-medium px-5 py-2 text-sm">
          Ekle
        </button>
      </form>
      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-ink/40 text-sm">Yükleniyor…</p>
      ) : view === "qr" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {employees.filter((e) => e.is_active).map((emp) => (
            <EmployeeQRCard key={emp.id} employee={emp} />
          ))}
        </div>
      ) : (
        <div className="bg-panel border border-line rounded-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-ink/50 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Ad Soyad</th>
                <th className="text-left px-4 py-3 font-medium">Departman</th>
                <th className="text-left px-4 py-3 font-medium">Durum</th>
                <th className="text-right px-4 py-3 font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-t border-line">
                  <td className="px-4 py-3 font-medium text-ink">{emp.full_name}</td>
                  <td className="px-4 py-3 text-ink/60">{emp.department || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.is_active ? "bg-brand-light text-brand-dark" : "bg-line text-ink/40"}`}>
                      {emp.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button onClick={() => toggleActive(emp)} className="text-brand text-xs font-medium underline">
                      {emp.is_active ? "Pasife al" : "Aktive et"}
                    </button>
                    <button onClick={() => removeEmployee(emp)} className="text-danger text-xs font-medium underline">
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
