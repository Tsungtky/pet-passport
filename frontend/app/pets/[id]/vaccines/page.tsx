"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function NewVaccinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinatedDate, setVaccinatedDate] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vaccineName,
        vaccinatedDate,
        nextDueDate,
        clinicName,
        notes,
        pet: { id: Number(id) },
      }),
    });
    router.push(`/pets/${id}`);
  };

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)", padding: "2rem" }}>
      <div style={{ maxWidth: "520px", margin: "0 auto" }}>

        <a href={`/pets/${id}`} style={{ color: "#65a876", fontSize: "0.875rem", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
          ← 返回
        </a>

        <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1.75rem", marginBottom: "0.25rem" }}>新增疫苗紀錄</h1>
        <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "2rem" }}>記錄這次接種的疫苗資訊</p>

        <div style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: "1.5rem", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {[
            { label: "疫苗名稱", value: vaccineName, setValue: setVaccineName, placeholder: "例：狂犬病疫苗", type: "text" },
            { label: "接種日期", value: vaccinatedDate, setValue: setVaccinatedDate, placeholder: "", type: "date" },
            { label: "下次補打日期", value: nextDueDate, setValue: setNextDueDate, placeholder: "", type: "date" },
            { label: "診所名稱", value: clinicName, setValue: setClinicName, placeholder: "例：台北動物醫院", type: "text" },
            { label: "備註", value: notes, setValue: setNotes, placeholder: "選填", type: "text" },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                placeholder={field.placeholder}
                style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", padding: "0.75rem 1rem", outline: "none", color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box", backgroundColor: "#f8fafc" }}
              />
            </div>
          ))}

          <button
            onClick={handleSubmit}
            style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.875rem", borderRadius: "0.625rem", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", marginTop: "0.5rem", boxShadow: "0 4px 15px rgba(101,168,118,0.35)" }}
          >
            新增
          </button>
        </div>

      </div>
    </main>
  );
}
