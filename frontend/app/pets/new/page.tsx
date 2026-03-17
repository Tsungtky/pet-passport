"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useLanguage } from "../../LanguageContext";

const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid #e2e8f0", borderRadius: "0.625rem",
  padding: "0.75rem 1rem", outline: "none", color: "#1e293b",
  fontSize: "0.95rem", boxSizing: "border-box", backgroundColor: "#f8fafc",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  padding: "0.75rem 2.5rem 0.75rem 1rem",
  appearance: "none", WebkitAppearance: "none", cursor: "pointer",
};

function SelectField({
  label, value, onChange, options, optionLabels, customValue, onCustomChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  optionLabels?: string[];
  customValue: string;
  onCustomChange: (v: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <div>
      <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>{label}</label>
      <div style={{ position: "relative" }}>
        <select value={value} onChange={(e) => { onChange(e.target.value); onCustomChange(""); }} style={selectStyle}>
          <option value="">{t.pleaseSelect}</option>
          {options.map((opt, i) => <option key={opt} value={opt}>{optionLabels?.[i] ?? opt}</option>)}
          <option value="__custom__">{t.otherCustom}</option>
        </select>
        <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
      </div>
      {value === "__custom__" && (
        <input
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder={t.enterManually}
          style={{ ...inputStyle, marginTop: "0.5rem" }}
        />
      )}
    </div>
  );
}

export default function NewPetPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [species, setSpecies] = useState("");
  const [speciesCustom, setSpeciesCustom] = useState("");
  const [breed, setBreed] = useState("");
  const [breedCustom, setBreedCustom] = useState("");
  const [gender, setGender] = useState("");
  const [genderCustom, setGenderCustom] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [bloodType, setBloodType] = useState("不清楚 / 未檢測");
  const [bloodTypeCustom, setBloodTypeCustom] = useState("");
  const [chipNumber, setChipNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [cropModal, setCropModal] = useState<{ src: string; file: File } | null>(null);
  const [crop, setCrop] = useState<Crop>({ unit: "%", width: 80, height: 80, x: 10, y: 10 });
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);

  const resolvedSpecies = species === "__custom__" ? speciesCustom : species;

  const handlePickPhoto = () => {
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

  const handleCropConfirm = async () => {
    if (!imgEl || !cropModal) return;
    const canvas = document.createElement("canvas");
    canvas.width = (crop.width / 100) * imgEl.naturalWidth;
    canvas.height = (crop.height / 100) * imgEl.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imgEl, (crop.x / 100) * imgEl.naturalWidth, (crop.y / 100) * imgEl.naturalHeight, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg"));
    const formData = new FormData();
    formData.append("file", blob, "pet.jpg");
    formData.append("upload_preset", "PP_image");
    const res = await fetch("https://api.cloudinary.com/v1_1/dqsvcfydo/image/upload", { method: "POST", body: formData });
    const data = await res.json();
    setPhotoUrl(data.secure_url);
    setCropModal(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    const userId = localStorage.getItem("userId");
    await fetch("http://localhost:8080/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        species: resolvedSpecies,
        breed: breed === "__custom__" ? breedCustom : breed,
        gender: gender === "__custom__" ? genderCustom : gender,
        birthday: birthYear && birthMonth && birthDay
          ? `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`
          : null,
        bloodType: bloodType === "__custom__" ? bloodTypeCustom : bloodType,
        chipNumber,
        photoUrl,
        owner: { id: Number(userId) },
      }),
    });
    router.push("/pets");
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem",
  };

  return (
    <>
      <main className="resp-main" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>

          <a href="/pets" style={{ color: "#65a876", fontSize: "0.875rem", textDecoration: "none", display: "inline-block", marginBottom: "1.5rem" }}>
            {t.backToList}
          </a>

          <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1.75rem", marginBottom: "0.25rem" }}>{t.newPetTitle}</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginBottom: "2rem" }}>{t.newPetSubtitle}</p>

          <div style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: "1.5rem", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* 照片上傳 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
              <div onClick={handlePickPhoto} style={{ width: "6rem", height: "6rem", borderRadius: "1rem", backgroundColor: "#f0fdf4", border: "2px dashed #a7d7b5", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {photoUrl ? <img src={photoUrl} alt="pet" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "2rem" }}>📷</span>}
              </div>
              <button onClick={handlePickPhoto} style={{ backgroundColor: "transparent", border: "1.5px solid #a7d7b5", color: "#4a7c59", borderRadius: "0.5rem", padding: "0.4rem 1rem", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                {photoUrl ? t.reuploadPhoto : t.uploadPhoto}
              </button>
            </div>

            {/* 名字 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500 }}>{t.petName}</label>
                {nameError && <span style={{ color: "#ef4444", fontSize: "0.8rem" }}>{t.petNameError}</span>}
              </div>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) setNameError(false); }}
                placeholder={t.petNamePlaceholder}
                style={{ ...inputStyle, border: nameError ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0" }}
              />
            </div>

            {/* 種類 */}
            <SelectField
              label={t.species}
              value={species}
              onChange={(v) => { setSpecies(v); setBreed(""); setBreedCustom(""); setBloodType("不清楚 / 未檢測"); }}
              options={["狗", "貓"]}
              optionLabels={[t.dogLabel, t.catLabel]}
              customValue={speciesCustom}
              onCustomChange={setSpeciesCustom}
            />

            {/* 品種 */}
            <SelectField
              label={t.breed}
              value={breed}
              onChange={setBreed}
              options={(resolvedSpecies === "貓" ? t.catBreeds : t.dogBreeds).map((b) => b.value)}
              optionLabels={(resolvedSpecies === "貓" ? t.catBreeds : t.dogBreeds).map((b) => b.label)}
              customValue={breedCustom}
              onCustomChange={setBreedCustom}
            />

            {/* 性別 */}
            <SelectField
              label={t.gender}
              value={gender}
              onChange={setGender}
              options={["公", "母"]}
              optionLabels={[t.maleLabel, t.femaleLabel]}
              customValue={genderCustom}
              onCustomChange={setGenderCustom}
            />

            {/* 生日 */}
            <div>
              <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>{t.birthday}</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {/* 年 */}
                <div style={{ position: "relative", flex: 2 }}>
                  <select value={birthYear} onChange={(e) => setBirthYear(e.target.value)} style={{ ...selectStyle }}>
                    <option value="">{t.year}</option>
                    {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                      <option key={y} value={String(y)}>{y}</option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
                {/* 月 */}
                <div style={{ position: "relative", flex: 1 }}>
                  <select value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} style={{ ...selectStyle }}>
                    <option value="">{t.month}</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <option key={m} value={String(m)}>{m}</option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
                {/* 日 */}
                <div style={{ position: "relative", flex: 1 }}>
                  <select value={birthDay} onChange={(e) => setBirthDay(e.target.value)} style={{ ...selectStyle }}>
                    <option value="">{t.day}</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={String(d)}>{d}</option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
                </div>
              </div>
            </div>

            {/* 血型 */}
            <div>
              <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>{t.bloodType}</label>
              <div style={{ position: "relative" }}>
                <select value={bloodType} onChange={(e) => { setBloodType(e.target.value); setBloodTypeCustom(""); }} style={selectStyle}>
                  <option value="不清楚 / 未檢測">{t.unknownBloodType}</option>
                  {resolvedSpecies === "貓" ? (
                    <>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                    </>
                  ) : (
                    <>
                      {t.dogBloodTypes.map((bt) => <option key={bt.value} value={bt.value}>{bt.label}</option>)}
                    </>
                  )}
                  <option value="__custom__">{t.otherCustom}</option>
                </select>
                <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8", fontSize: "0.75rem" }}>▼</span>
              </div>
              {bloodType === "__custom__" && (
                <input value={bloodTypeCustom} onChange={(e) => setBloodTypeCustom(e.target.value)} placeholder={t.enterManually} style={{ ...inputStyle, marginTop: "0.5rem" }} />
              )}
            </div>

            {/* 晶片號碼 */}
            <div>
              <label style={{ color: "#475569", fontSize: "0.875rem", fontWeight: 500, display: "block", marginBottom: "0.4rem" }}>{t.chipNumber}</label>
              <input value={chipNumber} onChange={(e) => setChipNumber(e.target.value)} placeholder={t.chipPlaceholder} style={inputStyle} />
            </div>

            <button onClick={handleSubmit} style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.875rem", borderRadius: "0.625rem", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", marginTop: "0.5rem", boxShadow: "0 4px 15px rgba(101,168,118,0.35)" }}>
              {t.addBtn}
            </button>
          </div>

        </div>
      </main>

      {/* Crop Modal */}
      {cropModal && (
        <div style={overlayStyle}>
          <div style={{ backgroundColor: "#fff", borderRadius: "1.25rem", padding: "1.5rem", maxWidth: "480px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ color: "#1e1b4b", fontWeight: 700, marginBottom: "1rem" }}>{t.cropPhoto}</h3>
            <ReactCrop crop={crop} onChange={(_, pct) => setCrop(pct)} aspect={1} circularCrop>
              <img src={cropModal.src} onLoad={(e) => setImgEl(e.currentTarget)} style={{ maxWidth: "100%" }} />
            </ReactCrop>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <button onClick={() => setCropModal(null)} style={{ flex: 1, padding: "0.75rem", borderRadius: "0.625rem", border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>{t.cancel}</button>
              <button onClick={handleCropConfirm} style={{ flex: 1, padding: "0.75rem", borderRadius: "0.625rem", border: "none", backgroundColor: "#65a876", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{t.confirmUpload}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
