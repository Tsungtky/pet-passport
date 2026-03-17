"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Camera, Dog, Cat } from "lucide-react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useLanguage } from "../../LanguageContext";

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthday: string;
  bloodType: string;
  chipNumber: string;
  qrCode: string;
  photoUrl?: string;
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
  clinicName: string;
  vetName: string;
  notes: string;
};

const vaccineFields = [
  { key: "vaccineName", label: "疫苗名稱", type: "text", placeholder: "例：狂犬病疫苗" },
  { key: "vaccinatedDate", label: "接種日期", type: "date", placeholder: "" },
  { key: "nextDueDate", label: "下次補打日期", type: "date", placeholder: "" },
  { key: "clinicName", label: "診所名稱", type: "text", placeholder: "例：台北動物醫院" },
];

const medicalRecordFields = [
  { key: "title", label: "標題", type: "text", placeholder: "例：年度健康檢查" },
  { key: "recordType", label: "類型", type: "text", placeholder: "例：看診、手術、檢查" },
  { key: "recordDate", label: "日期", type: "date", placeholder: "" },
  { key: "clinicName", label: "診所名稱", type: "text", placeholder: "例：台北動物醫院" },
  { key: "vetName", label: "獸醫名稱", type: "text", placeholder: "例：王醫師" },
  { key: "description", label: "描述", type: "text", placeholder: "簡單描述" },
  { key: "notes", label: "備註", type: "text", placeholder: "選填" },
];

const petFields = [
  { key: "name", label: "名字", type: "text", placeholder: "" },
  { key: "species", label: "種類", type: "text", placeholder: "例：狗、貓" },
  { key: "breed", label: "品種", type: "text", placeholder: "" },
  { key: "gender", label: "性別", type: "text", placeholder: "例：男、女" },
  { key: "birthday", label: "生日", type: "date", placeholder: "" },
  { key: "bloodType", label: "血型", type: "text", placeholder: "" },
  { key: "chipNumber", label: "晶片號碼", type: "text", placeholder: "" },
];

const emptyVaccine = { id: 0, vaccineName: "", vaccinatedDate: "", nextDueDate: "", clinicName: "", doseNumber: "" };
const emptyRecord = { id: 0, title: "", recordType: "", description: "", recordDate: "", clinicName: "", vetName: "", notes: "" };

const selectStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", padding: "0.75rem 2.5rem 0.75rem 1rem", outline: "none", color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box", backgroundColor: "#f8fafc", appearance: "none", WebkitAppearance: "none", cursor: "pointer" };
const overlayStyle: React.CSSProperties = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,23,42,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" };
const modalStyle: React.CSSProperties = { backgroundColor: "#fff", width: "100%", maxWidth: "480px", borderRadius: "1.5rem", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" };
const inputStyle: React.CSSProperties = { width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem", padding: "0.75rem 1rem", outline: "none", color: "#1e293b", fontSize: "0.95rem", boxSizing: "border-box", backgroundColor: "#f8fafc" };
const labelStyle: React.CSSProperties = { color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" };
const sectionStyle: React.CSSProperties = { backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", borderRadius: "1.25rem", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)", marginBottom: "1rem" };

export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLanguage();
  const [pet, setPet] = useState<Pet | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<number | null>(null);
  const [vaccineModal, setVaccineModal] = useState<{ mode: "add" | "edit"; data: Vaccine } | null>(null);
  const [vmVaccineNameCustom, setVmVaccineNameCustom] = useState("");
  const [vmVaccinatedYear, setVmVaccinatedYear] = useState("");
  const [vmVaccinatedMonth, setVmVaccinatedMonth] = useState("");
  const [vmVaccinatedDay, setVmVaccinatedDay] = useState("");
  const [vmNextDueYear, setVmNextDueYear] = useState("");
  const [vmNextDueMonth, setVmNextDueMonth] = useState("");
  const [vmNextDueDay, setVmNextDueDay] = useState("");
  const [recordModal, setRecordModal] = useState<{ mode: "add" | "edit"; data: MedicalRecord } | null>(null);
  const [rmRecordTypeCustom, setRmRecordTypeCustom] = useState("");
  const [rmRecordYear, setRmRecordYear] = useState("");
  const [rmRecordMonth, setRmRecordMonth] = useState("");
  const [rmRecordDay, setRmRecordDay] = useState("");
  const [petModal, setPetModal] = useState<Pet | null>(null);
  const [pmSpeciesCustom, setPmSpeciesCustom] = useState("");
  const [pmBreedCustom, setPmBreedCustom] = useState("");
  const [pmGenderCustom, setPmGenderCustom] = useState("");
  const [pmBloodTypeCustom, setPmBloodTypeCustom] = useState("");
  const [pmBirthYear, setPmBirthYear] = useState("");
  const [pmBirthMonth, setPmBirthMonth] = useState("");
  const [pmBirthDay, setPmBirthDay] = useState("");
  const [cropModal, setCropModal] = useState<{ src: string; file: File } | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 80, height: 80, x: 10, y: 10 });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${id}`).then((res) => res.json()).then((data) => setPet(data));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccines/pet/${id}`).then((res) => res.json()).then((data) => setVaccines(data));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medical-records/pet/${id}`).then((res) => res.json()).then((data) => setMedicalRecords(data));
  }, [id]);

  const knownVaccineNames = pet?.species === "貓" ? t.catVaccineNames : t.dogVaccineNames;

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

  const openVaccineModal = (mode: "add" | "edit", data: Vaccine) => {
    setVaccineModal({ mode, data });
    const vParts = data.vaccinatedDate?.split("-") ?? [];
    setVmVaccinatedYear(vParts[0] ?? "");
    setVmVaccinatedMonth(vParts[1] ? String(parseInt(vParts[1])) : "");
    setVmVaccinatedDay(vParts[2] ? String(parseInt(vParts[2])) : "");
    const nParts = data.nextDueDate?.split("-") ?? [];
    setVmNextDueYear(nParts[0] ?? "");
    setVmNextDueMonth(nParts[1] ? String(parseInt(nParts[1])) : "");
    setVmNextDueDay(nParts[2] ? String(parseInt(nParts[2])) : "");
    setVmVaccineNameCustom(!knownVaccineNames.some((vn) => vn.value === (data.vaccineName ?? "")) && data.vaccineName ? data.vaccineName : "");
  };

  const handleVaccineSubmit = async () => {
    if (!vaccineModal) return;
    const { mode, data } = vaccineModal;
    const resolvedName = data.vaccineName === "__custom__" ? vmVaccineNameCustom : data.vaccineName;
    if (!resolvedName) { alert("請選擇或輸入疫苗名稱"); return; }
    const payload = {
      ...data,
      vaccineName: resolvedName,
      vaccinatedDate: vmVaccinatedYear && vmVaccinatedMonth && vmVaccinatedDay
        ? `${vmVaccinatedYear}-${vmVaccinatedMonth.padStart(2, "0")}-${vmVaccinatedDay.padStart(2, "0")}`
        : data.vaccinatedDate || null,
      nextDueDate: vmNextDueYear && vmNextDueMonth && vmNextDueDay
        ? `${vmNextDueYear}-${vmNextDueMonth.padStart(2, "0")}-${vmNextDueDay.padStart(2, "0")}`
        : data.nextDueDate || null,
      pet: { id: Number(id) },
    };
    if (mode === "add") {
      const { id: _id, ...payloadWithoutId } = payload;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccines`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadWithoutId) });
      if (!res.ok) { const err = await res.text(); alert("新增失敗：" + err); return; }
      const created = await res.json();
      setVaccines((prev) => [...prev, created]);
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccines/${data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const err = await res.text(); alert("修改失敗：" + err); return; }
      setVaccines((prev) => prev.map((x) => x.id === data.id ? { ...payload, id: data.id } as Vaccine : x));
    }
    setVaccineModal(null);
  };

  const knownRecordTypes = t.knownRecordTypes;

  const openRecordModal = (mode: "add" | "edit", data: MedicalRecord) => {
    setRecordModal({ mode, data });
    const parts = data.recordDate?.split("-") ?? [];
    setRmRecordYear(parts[0] ?? "");
    setRmRecordMonth(parts[1] ? String(parseInt(parts[1])) : "");
    setRmRecordDay(parts[2] ? String(parseInt(parts[2])) : "");
    setRmRecordTypeCustom(!knownRecordTypes.some((rt) => rt.value === (data.recordType ?? "")) && data.recordType ? data.recordType : "");
  };

  const handleRecordSubmit = async () => {
    if (!recordModal) return;
    const { mode, data } = recordModal;
    const payload = {
      ...data,
      recordType: data.recordType === "__custom__" ? rmRecordTypeCustom : data.recordType,
      recordDate: rmRecordYear && rmRecordMonth && rmRecordDay
        ? `${rmRecordYear}-${rmRecordMonth.padStart(2, "0")}-${rmRecordDay.padStart(2, "0")}`
        : data.recordDate || null,
      pet: { id: Number(id) },
    };
    if (mode === "add") {
      const { id: _id, ...payloadWithoutId } = payload;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medical-records`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadWithoutId) });
      const created = await res.json();
      setMedicalRecords((prev) => [...prev, created]);
    } else {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medical-records/${data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setMedicalRecords((prev) => prev.map((x) => x.id === data.id ? { ...payload, id: data.id } as MedicalRecord : x));
    }
    setRecordModal(null);
  };

  const handlePetSubmit = async () => {
    if (!petModal) return;
    const payload = {
      ...petModal,
      species: petModal.species === "__custom__" ? pmSpeciesCustom : petModal.species,
      breed: petModal.breed === "__custom__" ? pmBreedCustom : petModal.breed,
      gender: petModal.gender === "__custom__" ? pmGenderCustom : petModal.gender,
      bloodType: petModal.bloodType === "__custom__" ? pmBloodTypeCustom : petModal.bloodType,
      birthday: pmBirthYear && pmBirthMonth && pmBirthDay
        ? `${pmBirthYear}-${pmBirthMonth.padStart(2, "0")}-${pmBirthDay.padStart(2, "0")}`
        : petModal.birthday ?? null,
    };
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setPet(payload as Pet);
    setPetModal(null);
  };

  const handleUploadPhoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const src = URL.createObjectURL(file);
      setCropModal({ src, file });
      setCrop({ unit: "%", width: 80, height: 80, x: 10, y: 10 });
    };
    input.click();
  };

  const handleCropAndUpload = async () => {
    if (!cropModal || !completedCrop || !imgRef[0]) return;
    const canvas = document.createElement("canvas");
    const scaleX = imgRef[0].naturalWidth / imgRef[0].width;
    const scaleY = imgRef[0].naturalHeight / imgRef[0].height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(imgRef[0], completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, completedCrop.width, completedCrop.height);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("file", blob, "photo.jpg");
      formData.append("upload_preset", "PP_image");
      const res = await fetch(`https://api.cloudinary.com/v1_1/dqsvcfydo/image/upload`, { method: "POST", body: formData });
      const data = await res.json();
      const photoUrl = data.secure_url;
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...pet, photoUrl }) });
      setPet((prev) => prev ? { ...prev, photoUrl } : prev);
      setCropModal(null);
    }, "image/jpeg");
  };

  if (!pet) return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#94a3b8" }}>{t.loading}</p>
    </main>
  );

  return (
    <>
      <main className="resp-main" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          <a href="/pets" style={{ color: "#65a876", fontSize: "0.875rem", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem", marginTop: "0.5rem" }}>
            {t.backToList}
          </a>
          <div style={{ marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                onClick={handleUploadPhoto}
                style={{ width: "5rem", height: "5rem", borderRadius: "1.25rem", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", cursor: "pointer", overflow: "hidden", border: "2px solid rgba(101,168,118,0.15)" }}
              >
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
              <div style={{ position: "absolute", bottom: "-0.25rem", right: "-0.25rem", backgroundColor: "#65a876", color: "#fff", width: "1.4rem", height: "1.4rem", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", cursor: "pointer" }} onClick={handleUploadPhoto}>
                <Camera size={12} />
              </div>
            </div>
            <div>
              <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "2rem", marginBottom: "0.25rem" }}>{pet.name}</h1>
              <p className="resp-subtitle" style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
                {pet.birthday && <span>{(() => {
                  const birth = new Date(pet.birthday);
                  const now = new Date();
                  const totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
                  if (totalMonths < 1) return t.underOneMonth;
                  if (totalMonths < 12) return t.months(totalMonths);
                  return t.years(Math.floor(totalMonths / 12));
                })()}</span>}
                {pet.gender && (
                  <span style={{ fontSize: "1.1rem", fontWeight: 700, color: pet.gender === "公" ? "#3b82f6" : "#ec4899" }}>
                    {pet.gender === "公" ? "♂" : pet.gender === "母" ? "♀" : pet.gender}
                  </span>
                )}
                {translateBreed(pet.breed)}
              </p>
            </div>
          </div>

          {/* 基本資料 */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1rem" }}>{t.basicInfo}</h2>
              <button onClick={() => {
                setPetModal({ ...pet });
                const parts = pet.birthday?.split("-") ?? [];
                setPmBirthYear(parts[0] ?? "");
                setPmBirthMonth(parts[1] ? String(parseInt(parts[1])) : "");
                setPmBirthDay(parts[2] ? String(parseInt(parts[2])) : "");
                const knownSpecies = ["狗", "貓"];
                setPmSpeciesCustom(!knownSpecies.includes(pet.species ?? "") && pet.species ? pet.species : "");
                const knownGenders = ["公", "母"];
                setPmGenderCustom(!knownGenders.includes(pet.gender ?? "") && pet.gender ? pet.gender : "");
                setPmBreedCustom("");
                setPmBloodTypeCustom("");
              }} style={{ color: "#65a876", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>{t.edit}</button>
            </div>
            <div className="resp-grid-2">
              {[
                { label: t.genderLabel, value: pet.gender === "公" ? t.maleLabel : pet.gender === "母" ? t.femaleLabel : pet.gender },
                { label: t.birthdayLabel, value: pet.birthday },
                { label: t.bloodTypeLabel, value: translateBloodType(pet.bloodType) },
                { label: t.chipLabel, value: pet.chipNumber },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "0.2rem" }}>{item.label}</p>
                  <p style={{ color: "#1e293b", fontSize: "0.9rem", fontWeight: 500 }}>{item.value ?? t.notFilled}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 疫苗紀錄 */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1rem" }}>{t.vaccineRecords}</h2>
              <button onClick={() => openVaccineModal("add", { ...emptyVaccine })} style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.35rem 0.875rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 600, border: "none", cursor: "pointer" }}>{t.add}</button>
            </div>
            {vaccines.length === 0 ? (
              <p style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{t.noRecords}</p>
            ) : (
              [...vaccines].sort((a, b) => {
                if (!a.vaccinatedDate) return 1;
                if (!b.vaccinatedDate) return -1;
                return new Date(b.vaccinatedDate).getTime() - new Date(a.vaccinatedDate).getTime();
              }).map((v) => (
                <div key={v.id} style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.875rem", marginTop: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ color: "#1e293b", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>
                      {translateVaccineName(v.vaccineName)}
                      {v.doseNumber && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "#166534", backgroundColor: "#dcfce7", borderRadius: "0.375rem", padding: "0.1rem 0.4rem", fontWeight: 500 }}>{v.doseNumber === "第一劑" ? t.dose1 : v.doseNumber === "第二劑" ? t.dose2 : v.doseNumber === "第三劑" ? t.dose3 : v.doseNumber}</span>}
                    </p>
                    <p style={{ color: "#64748b", fontSize: "0.8rem" }}>{v.vaccinatedDate} · {v.clinicName}</p>
                    <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>{t.nextDue}{v.nextDueDate}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button onClick={() => openVaccineModal("edit", { ...v })} style={{ color: "#65a876", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}>{t.edit}</button>
                    <button onClick={async () => { if (!confirm(t.confirmDelete)) return; await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vaccines/${v.id}`, { method: "DELETE" }); setVaccines((prev) => prev.filter((x) => x.id !== v.id)); }} style={{ color: "#f87171", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}>{t.delete}</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 病歷紀錄 */}
          <div style={sectionStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1rem" }}>{t.medicalRecords}</h2>
              <button onClick={() => openRecordModal("add", { ...emptyRecord })} style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.35rem 0.875rem", borderRadius: "0.5rem", fontSize: "0.8rem", fontWeight: 600, border: "none", cursor: "pointer" }}>{t.add}</button>
            </div>
            {medicalRecords.length === 0 ? (
              <p style={{ color: "#cbd5e1", fontSize: "0.875rem" }}>{t.noRecords}</p>
            ) : (
              medicalRecords.map((r) => (
                <div key={r.id} style={{ borderTop: "1px solid #f1f5f9", paddingTop: "0.875rem", marginTop: "0.875rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ cursor: "pointer", flex: 1 }} onClick={() => setExpandedRecord(expandedRecord === r.id ? null : r.id)}>
                      <p style={{ color: "#1e293b", fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{r.title}</p>
                      <p style={{ color: "#64748b", fontSize: "0.8rem" }}>{r.recordDate} · {r.clinicName}</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button onClick={() => openRecordModal("edit", { ...r })} style={{ color: "#65a876", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}>{t.edit}</button>
                      <button onClick={async () => { if (!confirm(t.confirmDelete)) return; await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medical-records/${r.id}`, { method: "DELETE" }); setMedicalRecords((prev) => prev.filter((x) => x.id !== r.id)); }} style={{ color: "#f87171", fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}>{t.delete}</button>
                    </div>
                  </div>
                  {expandedRecord === r.id && (
                    <div style={{ marginTop: "0.75rem", backgroundColor: "#f8fafc", borderRadius: "0.75rem", padding: "1rem", display: "grid", gap: "0.5rem" }}>
                      {[{ label: t.recordType, value: translateRecordType(r.recordType) }, { label: t.description, value: r.description }, { label: t.vetName, value: r.vetName }, { label: t.notes, value: r.notes }].map((item) => (
                        <div key={item.label}>
                          <p style={{ color: "#94a3b8", fontSize: "0.75rem" }}>{item.label}</p>
                          <p style={{ color: "#1e293b", fontSize: "0.875rem" }}>{item.value ?? t.notFilled}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* QR Code */}
          <div style={sectionStyle}>
            <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>QR Code</h2>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ display: "inline-block", backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "1rem", border: "1px solid #e2e8f0" }}>
                <QRCodeSVG value={`${typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"}/public/${pet.qrCode}`} size={160} />
              </div>
              <p style={{ color: "#cbd5e1", fontSize: "0.75rem", marginTop: "0.75rem" }}>{pet.qrCode}</p>
            </div>
          </div>

        </div>
      </main>

      {/* 疫苗 Modal */}
      {vaccineModal && (() => {
        const vm = vaccineModal;
        const clinicOptions = [...new Set([
          ...vaccines.map((v) => v.clinicName),
          ...medicalRecords.map((r) => r.clinicName),
        ].filter(Boolean))];
        const defaultClinic = clinicOptions[0] ?? "";
        const clinicValue = vm.data.clinicName !== undefined ? vm.data.clinicName : defaultClinic;

        const DateSelect = ({ year, month, day, onYear, onMonth, onDay }: { year: string; month: string; day: string; onYear: (v: string) => void; onMonth: (v: string) => void; onDay: (v: string) => void }) => (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[
              { value: year, onChange: onYear, placeholder: t.year, options: Array.from({ length: new Date().getFullYear() - 1999 + 5 }, (_, i) => new Date().getFullYear() + 5 - i), flex: 2 },
              { value: month, onChange: onMonth, placeholder: t.month, options: Array.from({ length: 12 }, (_, i) => i + 1), flex: 1 },
              { value: day, onChange: onDay, placeholder: t.day, options: Array.from({ length: 31 }, (_, i) => i + 1), flex: 1 },
            ].map((s) => (
              <div key={s.placeholder} style={{ position: "relative", flex: s.flex }}>
                <select value={s.value} onChange={(e) => s.onChange(e.target.value)} style={selectStyle}>
                  <option value="">{s.placeholder}</option>
                  {s.options.map((o) => <option key={o} value={String(o)}>{o}</option>)}
                </select>
                <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
              </div>
            ))}
          </div>
        );

        return (
          <div style={overlayStyle} onClick={() => setVaccineModal(null)}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem" }}>{vm.mode === "add" ? t.addVaccineRecord : t.editVaccineRecord}</h2>

              {/* 疫苗名稱 */}
              <div>
                <label style={labelStyle}>{t.vaccineName}</label>
                <div style={{ position: "relative" }}>
                  <select value={vm.data.vaccineName ?? ""} onChange={(e) => { setVaccineModal({ ...vm, data: { ...vm.data, vaccineName: e.target.value } }); setVmVaccineNameCustom(""); }} style={selectStyle}>
                    <option value="">{t.pleaseSelect}</option>
                    {knownVaccineNames.map((vn) => <option key={vn.value} value={vn.value}>{vn.label}</option>)}
                    <option value="__custom__">{t.otherCustom}</option>
                  </select>
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
                {vm.data.vaccineName === "__custom__" && <input value={vmVaccineNameCustom} onChange={(e) => setVmVaccineNameCustom(e.target.value)} placeholder={t.vaccinePlaceholder} style={{ ...inputStyle, marginTop: "0.5rem" }} />}
              </div>

              {/* 劑次 */}
              <div>
                <label style={labelStyle}>{t.doseNumber}{t.doseOptional}</label>
                <div style={{ position: "relative" }}>
                  <select value={vm.data.doseNumber ?? ""} onChange={(e) => setVaccineModal({ ...vm, data: { ...vm.data, doseNumber: e.target.value } })} style={selectStyle}>
                    <option value="">{t.noDose}</option>
                    <option value="第一劑">{t.dose1}</option>
                    <option value="第二劑">{t.dose2}</option>
                    <option value="第三劑">{t.dose3}</option>
                  </select>
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
              </div>

              {/* 接種日期 */}
              <div>
                <label style={labelStyle}>{t.vaccinatedDate}</label>
                <DateSelect year={vmVaccinatedYear} month={vmVaccinatedMonth} day={vmVaccinatedDay} onYear={setVmVaccinatedYear} onMonth={setVmVaccinatedMonth} onDay={setVmVaccinatedDay} />
              </div>

              {/* 下次補打日期 */}
              <div>
                <label style={labelStyle}>{t.nextDueDate}</label>
                <DateSelect year={vmNextDueYear} month={vmNextDueMonth} day={vmNextDueDay} onYear={setVmNextDueYear} onMonth={setVmNextDueMonth} onDay={setVmNextDueDay} />
              </div>

              {/* 診所名稱 */}
              <div>
                <label style={labelStyle}>{t.clinicName}</label>
                <input
                  value={clinicValue}
                  onChange={(e) => setVaccineModal({ ...vm, data: { ...vm.data, clinicName: e.target.value } })}
                  placeholder={t.clinicPlaceholder}
                  list="vm-clinic-list"
                  style={inputStyle}
                />
                <datalist id="vm-clinic-list">
                  {clinicOptions.map((c) => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={handleVaccineSubmit} style={{ backgroundColor: "#65a876", color: "#fff", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(101,168,118,0.3)" }}>{vm.mode === "add" ? t.addMode : t.editMode}</button>
                <button onClick={() => setVaccineModal(null)} style={{ backgroundColor: "#f1f5f9", color: "#64748b", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer" }}>{t.cancel}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 病歷 Modal */}
      {recordModal && (() => {
        const rm = recordModal;
        const update = (key: keyof MedicalRecord, val: string) => setRecordModal({ ...rm, data: { ...rm.data, [key]: val } });
        const clinicOptions = [...new Set([...vaccines.map((v) => v.clinicName), ...medicalRecords.map((r) => r.clinicName)].filter(Boolean))];
        return (
          <div style={overlayStyle} onClick={() => setRecordModal(null)}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem" }}>{rm.mode === "add" ? t.addMedicalRecord : t.editMedicalRecord}</h2>

              {/* 類型 */}
              <div>
                <label style={labelStyle}>{t.recordType}</label>
                <div style={{ position: "relative" }}>
                  <select value={rm.data.recordType ?? ""} onChange={(e) => { update("recordType", e.target.value); setRmRecordTypeCustom(""); }} style={selectStyle}>
                    <option value="">{t.pleaseSelect}</option>
                    {knownRecordTypes.map((rt) => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
                    <option value="__custom__">{t.otherCustom}</option>
                  </select>
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
                {rm.data.recordType === "__custom__" && <input value={rmRecordTypeCustom} onChange={(e) => setRmRecordTypeCustom(e.target.value)} placeholder={t.enterManually} style={{ ...inputStyle, marginTop: "0.5rem" }} />}
              </div>

              {/* 標題 */}
              <div>
                <label style={labelStyle}>{t.recordTitle}</label>
                <input value={rm.data.title ?? ""} onChange={(e) => update("title", e.target.value)} placeholder={t.recordTitlePlaceholder} style={inputStyle} />
              </div>

              {/* 日期 */}
              <div>
                <label style={labelStyle}>{t.recordDate}</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[
                    { value: rmRecordYear, onChange: setRmRecordYear, placeholder: t.year, options: Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => new Date().getFullYear() - i), flex: 2 },
                    { value: rmRecordMonth, onChange: setRmRecordMonth, placeholder: t.month, options: Array.from({ length: 12 }, (_, i) => i + 1), flex: 1 },
                    { value: rmRecordDay, onChange: setRmRecordDay, placeholder: t.day, options: Array.from({ length: 31 }, (_, i) => i + 1), flex: 1 },
                  ].map((s) => (
                    <div key={s.placeholder} style={{ position: "relative", flex: s.flex }}>
                      <select value={s.value} onChange={(e) => s.onChange(e.target.value)} style={selectStyle}>
                        <option value="">{s.placeholder}</option>
                        {s.options.map((o) => <option key={o} value={String(o)}>{o}</option>)}
                      </select>
                      <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 診所名稱 */}
              <div>
                <label style={labelStyle}>{t.clinicName}</label>
                <input value={rm.data.clinicName ?? ""} onChange={(e) => update("clinicName", e.target.value)} placeholder={t.clinicPlaceholder} list="rm-clinic-list" style={inputStyle} />
                <datalist id="rm-clinic-list">{clinicOptions.map((c) => <option key={c} value={c} />)}</datalist>
              </div>

              {/* 獸醫名稱 */}
              <div>
                <label style={labelStyle}>{t.vetName}</label>
                <input value={rm.data.vetName ?? ""} onChange={(e) => update("vetName", e.target.value)} placeholder={t.vetPlaceholder} style={inputStyle} />
              </div>

              {/* 描述 */}
              <div>
                <label style={labelStyle}>{t.description}</label>
                <input value={rm.data.description ?? ""} onChange={(e) => update("description", e.target.value)} placeholder={t.descriptionPlaceholder} style={inputStyle} />
              </div>

              {/* 備註 */}
              <div>
                <label style={labelStyle}>{t.notes}</label>
                <input value={rm.data.notes ?? ""} onChange={(e) => update("notes", e.target.value)} placeholder={t.notesPlaceholder} style={inputStyle} />
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={handleRecordSubmit} style={{ backgroundColor: "#65a876", color: "#fff", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(101,168,118,0.3)" }}>{rm.mode === "add" ? t.addMode : t.editMode}</button>
                <button onClick={() => setRecordModal(null)} style={{ backgroundColor: "#f1f5f9", color: "#64748b", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer" }}>{t.cancel}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 寵物基本資料 Modal */}
      {petModal && (
        <div style={overlayStyle} onClick={() => setPetModal(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem" }}>{t.editBasicInfo}</h2>

            {/* 名字 */}
            <div>
              <label style={labelStyle}>{t.nameLabel}</label>
              <input value={petModal.name} onChange={(e) => setPetModal({ ...petModal, name: e.target.value })} style={inputStyle} />
            </div>

            {/* 種類 */}
            <div>
              <label style={labelStyle}>{t.species}</label>
              <div style={{ position: "relative" }}>
                <select value={petModal.species ?? ""} onChange={(e) => { setPetModal({ ...petModal, species: e.target.value, breed: "", bloodType: "不清楚 / 未檢測" }); setPmSpeciesCustom(""); }} style={selectStyle}>
                  <option value="">{t.pleaseSelect}</option>
                  <option value="狗">{t.dogLabel}</option>
                  <option value="貓">{t.catLabel}</option>
                  <option value="__custom__">{t.otherCustom}</option>
                </select>
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
              </div>
              {petModal.species === "__custom__" && <input value={pmSpeciesCustom} onChange={(e) => setPmSpeciesCustom(e.target.value)} placeholder={t.enterManually} style={{ ...inputStyle, marginTop: "0.5rem" }} />}
            </div>

            {/* 品種 */}
            <div>
              <label style={labelStyle}>{t.breed}</label>
              <div style={{ position: "relative" }}>
                <select value={petModal.breed ?? ""} onChange={(e) => { setPetModal({ ...petModal, breed: e.target.value }); setPmBreedCustom(""); }} style={selectStyle}>
                  <option value="">{t.pleaseSelect}</option>
                  {(petModal.species === "貓" ? t.catBreeds : t.dogBreeds).map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  <option value="__custom__">{t.otherCustom}</option>
                </select>
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
              </div>
              {petModal.breed === "__custom__" && <input value={pmBreedCustom} onChange={(e) => setPmBreedCustom(e.target.value)} placeholder={t.enterManually} style={{ ...inputStyle, marginTop: "0.5rem" }} />}
            </div>

            {/* 性別 */}
            <div>
              <label style={labelStyle}>{t.genderLabel}</label>
              <div style={{ position: "relative" }}>
                <select value={petModal.gender ?? ""} onChange={(e) => { setPetModal({ ...petModal, gender: e.target.value }); setPmGenderCustom(""); }} style={selectStyle}>
                  <option value="">{t.pleaseSelect}</option>
                  <option value="公">{t.maleLabel}</option>
                  <option value="母">{t.femaleLabel}</option>
                  <option value="__custom__">{t.otherCustom}</option>
                </select>
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
              </div>
              {petModal.gender === "__custom__" && <input value={pmGenderCustom} onChange={(e) => setPmGenderCustom(e.target.value)} placeholder={t.enterManually} style={{ ...inputStyle, marginTop: "0.5rem" }} />}
            </div>

            {/* 生日 */}
            <div>
              <label style={labelStyle}>{t.birthdayLabel}</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 2 }}>
                  <select value={pmBirthYear} onChange={(e) => setPmBirthYear(e.target.value)} style={selectStyle}>
                    <option value="">{t.year}</option>
                    {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => new Date().getFullYear() - i).map((y) => <option key={y} value={String(y)}>{y}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
                <div style={{ position: "relative", flex: 1 }}>
                  <select value={pmBirthMonth} onChange={(e) => setPmBirthMonth(e.target.value)} style={selectStyle}>
                    <option value="">{t.month}</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={String(m)}>{m}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
                <div style={{ position: "relative", flex: 1 }}>
                  <select value={pmBirthDay} onChange={(e) => setPmBirthDay(e.target.value)} style={selectStyle}>
                    <option value="">{t.day}</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={String(d)}>{d}</option>)}
                  </select>
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
              </div>
            </div>

            {/* 血型 */}
            <div>
              <label style={labelStyle}>{t.bloodTypeLabel}</label>
              <div style={{ position: "relative" }}>
                <select value={petModal.bloodType ?? "不清楚 / 未檢測"} onChange={(e) => { setPetModal({ ...petModal, bloodType: e.target.value }); setPmBloodTypeCustom(""); }} style={selectStyle}>
                  <option value="不清楚 / 未檢測">{t.unknownBloodType}</option>
                  {petModal.species === "貓" ? (<><option value="A">A</option><option value="B">B</option><option value="AB">AB</option></>) : (t.dogBloodTypes.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>))}
                  <option value="__custom__">{t.otherCustom}</option>
                </select>
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
              </div>
              {petModal.bloodType === "__custom__" && <input value={pmBloodTypeCustom} onChange={(e) => setPmBloodTypeCustom(e.target.value)} placeholder={t.enterManually} style={{ ...inputStyle, marginTop: "0.5rem" }} />}
            </div>

            {/* 晶片號碼 */}
            <div>
              <label style={labelStyle}>{t.chipLabel}</label>
              <input value={petModal.chipNumber ?? ""} onChange={(e) => setPetModal({ ...petModal, chipNumber: e.target.value })} placeholder="15碼晶片號碼（選填）" style={inputStyle} />
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={handlePetSubmit} style={{ backgroundColor: "#65a876", color: "#fff", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(101,168,118,0.3)" }}>{t.editMode}</button>
              <button onClick={() => setPetModal(null)} style={{ backgroundColor: "#f1f5f9", color: "#64748b", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer" }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      {/* 裁切照片 Modal */}
      {cropModal && (
        <div style={overlayStyle} onClick={() => setCropModal(null)}>
          <div style={{ ...modalStyle, maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem" }}>{t.cropPhoto}</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  src={cropModal.src}
                  ref={(el) => { (imgRef as any)[0] = el; }}
                  style={{ maxHeight: "400px", maxWidth: "100%" }}
                  alt="crop"
                />
              </ReactCrop>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={handleCropAndUpload} style={{ backgroundColor: "#65a876", color: "#fff", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(101,168,118,0.3)" }}>{t.confirmUpload}</button>
              <button onClick={() => setCropModal(null)} style={{ backgroundColor: "#f1f5f9", color: "#64748b", flex: 1, borderRadius: "0.625rem", padding: "0.75rem", fontWeight: 600, border: "none", cursor: "pointer" }}>{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
