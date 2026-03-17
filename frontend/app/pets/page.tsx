"use client";

import { useEffect, useState } from "react";
import { Dog, Cat } from "lucide-react";
import { useLanguage } from "../LanguageContext";

type Pet = {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birthday: string;
  qrCode: string;
  photoUrl: string;
};

export default function PetsPage() {
  const { t } = useLanguage();
  const [pets, setPets] = useState<Pet[]>([]);

  const allBreeds = [...t.catBreeds, ...t.dogBreeds];
  const translateBreed = (breed: string) =>
    allBreeds.find((b) => b.value === breed)?.label ?? breed;
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  function calcAge(birthday: string): string {
    if (!birthday) return "";
    const birth = new Date(birthday);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const totalMonths = years * 12 + months;
    if (totalMonths < 1) return t.underOneMonth;
    if (totalMonths < 12) return t.months(totalMonths);
    return t.years(Math.floor(totalMonths / 12));
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/owner/${userId}`)
      .then((res) => res.json())
      .then((data) => setPets(Array.isArray(data) ? data : []));
  }, []);

  const handleDelete = async (pet: Pet) => {
    if (!confirm(`確定要刪除「${pet.name}」嗎？此操作無法復原。`)) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${pet.id}`, { method: "DELETE" });
    setPets((prev) => prev.filter((p) => p.id !== pet.id));
  };

  return (
    <main className="resp-main" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #f0fdf4 100%)" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>

        {/* Header */}
        <div className="resp-header">
          <div>
            <h1 style={{ color: "#1e1b4b", fontWeight: 800, fontSize: "1.75rem", marginBottom: "0.25rem" }}>{t.myPets}</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>{t.petsSubtitle}</p>
          </div>
          <div className="resp-btn-group">
            <a
              href="/pets/new"
              style={{ backgroundColor: "#65a876", color: "#fff", padding: "0.6rem 1.25rem", borderRadius: "0.625rem", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", boxShadow: "0 4px 12px rgba(101,168,118,0.3)" }}
            >
              {t.addPet}
            </a>
            <a
              href="/profile"
              style={{ backgroundColor: "rgba(255,255,255,0.8)", color: "#64748b", padding: "0.6rem 1.25rem", borderRadius: "0.625rem", fontWeight: 500, fontSize: "0.875rem", border: "1.5px solid #e2e8f0", textDecoration: "none", display: "flex", alignItems: "center" }}
            >
              {t.profile}
            </a>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                window.location.href = "/login";
              }}
              style={{ backgroundColor: "rgba(255,255,255,0.8)", color: "#64748b", padding: "0.6rem 1.25rem", borderRadius: "0.625rem", fontWeight: 500, fontSize: "0.875rem", border: "1.5px solid #e2e8f0", cursor: "pointer" }}
            >
              {t.logout}
            </button>
          </div>
        </div>

        {/* Pet Cards */}
        <div style={{ display: "grid", gap: "1rem" }}>
          {pets.length === 0 ? (
            <div style={{ backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "1.25rem", padding: "3rem", textAlign: "center", border: "1.5px dashed #c7d2fe" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🐾</div>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>{t.noPets}</p>
            </div>
          ) : (
            pets.map((pet) => (
              <div
                key={pet.id}
                style={{ position: "relative" }}
                onMouseEnter={() => setHoveredId(pet.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* 刪除按鈕 */}
                {hoveredId === pet.id && (
                  <button
                    onClick={(e) => { e.preventDefault(); handleDelete(pet); }}
                    style={{ position: "absolute", top: "0.5rem", right: "0.5rem", zIndex: 10, width: "1.35rem", height: "1.35rem", borderRadius: "999px", backgroundColor: "#fee2e2", color: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700 }}
                  >
                    ✕
                  </button>
                )}

                <a
                  href={`/pets/${pet.id}`}
                  style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", borderRadius: "1.25rem", padding: "1.5rem", display: "block", textDecoration: "none", boxShadow: hoveredId === pet.id ? "0 8px 30px rgba(101,168,118,0.12)" : "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.6)", transform: hoveredId === pet.id ? "translateY(-2px)" : "translateY(0)", transition: "transform 0.15s, box-shadow 0.15s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "3rem", height: "3rem", backgroundColor: "#f0fdf4", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                      {pet.photoUrl ? (
                        <img src={pet.photoUrl} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : pet.species === "狗" ? (
                        <Dog size={24} color="#65a876" />
                      ) : pet.species === "貓" ? (
                        <Cat size={24} color="#65a876" />
                      ) : (
                        <span style={{ fontSize: "1.5rem" }}>🐾</span>
                      )}
                    </div>
                    <div>
                      <h2 style={{ color: "#1e1b4b", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.2rem" }}>{pet.name}</h2>
                      <p style={{ color: "#94a3b8", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        {pet.birthday && <span style={{ marginRight: "0.1rem" }}>{calcAge(pet.birthday)}</span>}
                        {pet.gender && (
                          <span style={{ fontSize: "1rem", fontWeight: 700, color: pet.gender === "公" ? "#3b82f6" : "#ec4899" }}>
                            {pet.gender === "公" ? "♂" : pet.gender === "母" ? "♀" : pet.gender}
                          </span>
                        )}
                        {translateBreed(pet.breed)}
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
