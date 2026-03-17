"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { Dog, Cat } from "lucide-react";
import { useLanguage, LangToggle } from "../../LanguageContext";

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthday: string;
  bloodType: string;
  chipNumber: string;
  photoUrl: string;
  owner?: { name: string };
};

type Vaccine = {
  id: number;
  vaccineName: string;
  vaccinatedDate: string;
  nextDueDate: string;
  clinicName: string;
  doseNumber: string;
};

type MedicalRecord = {
  id: number;
  recordType: string;
  title: string;
  description: string;
  recordDate: string;
  vetName: string;
  notes: string;
};

export default function PublicPetPage({ params }: { params: Promise<{ qrCode: string }> }) {
  const { qrCode } = use(params);
  const { t } = useLanguage();
  const [pet, setPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/qr/${qrCode}`)
      .then((res) => {
        if (!res.ok) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setPet(data);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccines/pet/${data.id}`).then((r) => r.json()).then(setVaccines);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medical-records/pet/${data.id}`).then((r) => r.json()).then(setRecords);
      });
  }, [qrCode]);

  if (notFound) return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "#94a3b8" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🐾</div>
        <p>{t.petNotFound}</p>
      </div>
    </main>
  );

  if (!pet) return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94a3b8" }}>{t.loading}</p>
    </main>
  );

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)",
    borderRadius: "1.25rem", padding: "1.5rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)",
    marginBottom: "1rem",
  };

  const allVaccineNames = [...t.catVaccineNames, ...t.dogVaccineNames];
  const translateVaccineName = (name: string) =>
    allVaccineNames.find((vn) => vn.value === name)?.label ?? name;

  const allBreeds = [...t.catBreeds, ...t.dogBreeds];
  const translateBreed = (breed: string) =>
    allBreeds.find((b) => b.value === breed)?.label ?? breed;

  const translateRecordType = (type: string) =>
    t.knownRecordTypes.find((rt) => rt.value === type)?.label ?? type;

  const translateBloodType = (bt: string) => {
    if (!bt) return bt;
    if (bt === "不清楚 / 未檢測") return t.unknownBloodType;
    return t.dogBloodTypes.find((b) => b.value === bt)?.label ?? bt;
  };

  const sortedVaccines = [...vaccines].sort((a, b) => {
    if (!a.vaccinatedDate) return 1;
    if (!b.vaccinatedDate) return -1;
    return new Date(b.vaccinatedDate).getTime() - new Date(a.vaccinatedDate).getTime();
  });

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)", padding: "2rem" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>🐾</div>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{t.petPassportTitle}</p>
          <div style={{ marginTop: "0.5rem" }}><LangToggle /></div>
        </div>

        {/* 寵物基本資料 */}
        <div style={sectionStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.25rem" }}>
            <div style={{ width: "5rem", height: "5rem", borderRadius: "1.25rem", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(101,168,118,0.15)" }}>
              {pet.photoUrl ? (
                <img src={pet.photoUrl} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : pet.species === "狗" ? (
                <Dog size={36} color="#65a876" />
              ) : pet.species === "貓" ? (
                <Cat size={36} color="#65a876" />
              ) : (
                <span style={{ fontSize: "2.5rem" }}>🐾</span>
              )}
            </div>
            <div>
              <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1.75rem", marginBottom: "0.25rem" }}>{pet.name}</h1>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                {pet.birthday && <span>{(() => {
                  const birth = new Date(pet.birthday);
                  const now = new Date();
                  const m = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
                  return m < 1 ? t.underOneMonth : m < 12 ? t.months(m) : t.years(Math.floor(m / 12));
                })()}</span>}
                {pet.gender && (
                  <span style={{ fontWeight: 700, color: pet.gender === "公" ? "#3b82f6" : "#ec4899" }}>
                    {pet.gender === "公" ? "♂" : pet.gender === "母" ? "♀" : pet.gender}
                  </span>
                )}
                {translateBreed(pet.breed)}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              { label: t.ownerLabel, value: pet.owner?.name },
              { label: t.species, value: pet.species === "狗" ? t.dogLabel : pet.species === "貓" ? t.catLabel : pet.species },
              { label: t.genderLabel, value: pet.gender === "公" ? t.maleLabel : pet.gender === "母" ? t.femaleLabel : pet.gender },
              { label: t.birthdayLabel, value: pet.birthday },
              { label: t.bloodTypeLabel, value: translateBloodType(pet.bloodType) },
              { label: t.chipNumber, value: pet.chipNumber },
            ].map((item) => item.value ? (
              <div key={item.label}>
                <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "0.2rem" }}>{item.label}</p>
                <p style={{ color: "#1e293b", fontSize: "0.9rem", fontWeight: 500 }}>{item.value}</p>
              </div>
            ) : null)}
          </div>
        </div>

        {/* 疫苗紀錄 */}
        <div style={sectionStyle}>
          <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>{t.vaccineRecords}</h2>
          {sortedVaccines.length === 0 ? (
            <p style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{t.noRecords}</p>
          ) : sortedVaccines.map((v) => (
            <div key={v.id} style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.875rem", marginTop: "0.875rem" }}>
              <p style={{ color: "#1e293b", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>
                {translateVaccineName(v.vaccineName)}
                {v.doseNumber && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#166534", backgroundColor: "#dcfce7", borderRadius: "0.375rem", padding: "0.1rem 0.4rem", fontWeight: 500 }}>{v.doseNumber === "第一劑" ? t.dose1 : v.doseNumber === "第二劑" ? t.dose2 : v.doseNumber === "第三劑" ? t.dose3 : v.doseNumber}</span>}
              </p>
              <p style={{ color: "#64748b", fontSize: "0.8rem" }}>{v.vaccinatedDate}{v.clinicName ? ` · ${v.clinicName}` : ""}</p>
              {v.nextDueDate && <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{t.nextDue}{v.nextDueDate}</p>}
            </div>
          ))}
        </div>

        {/* 病歷紀錄 */}
        <div style={sectionStyle}>
          <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>{t.medicalRecords}</h2>
          {records.length === 0 ? (
            <p style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{t.noRecords}</p>
          ) : [...records].sort((a, b) => {
            if (!a.recordDate) return 1;
            if (!b.recordDate) return -1;
            return new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime();
          }).map((r) => (
            <div key={r.id} style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.875rem", marginTop: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <p style={{ color: "#1e293b", fontWeight: 600, fontSize: "0.95rem" }}>{r.title}</p>
                {r.recordType && <span style={{ fontSize: "0.75rem", color: "#0ea5e9", backgroundColor: "#e0f2fe", borderRadius: "0.375rem", padding: "0.1rem 0.4rem", fontWeight: 500 }}>{translateRecordType(r.recordType)}</span>}
              </div>
              <p style={{ color: "#64748b", fontSize: "0.8rem" }}>{r.recordDate}{r.vetName ? ` · ${r.vetName}` : ""}</p>
              {r.description && <p style={{ color: "#94a3b8", fontSize: "0.8rem", marginTop: "0.25rem" }}>{r.description}</p>}
              {r.notes && <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>備註：{r.notes}</p>}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: "#cbd5e1", fontSize: "0.75rem", marginTop: "1rem" }}>{t.publicFooter}</p>
      </div>
    </main>
  );
}
