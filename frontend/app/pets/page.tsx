  "use client";

  import { useEffect, useState } from "react";

  type Pet = {
    id: number;
    name: string;
    species: string;
    breed: string;
    gender: string;
    qrCode: string;
  };

  export default function PetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      fetch(`http://localhost:8080/api/pets/owner/${userId}`)
        .then((res) => res.json())
        .then((data) => setPets(Array.isArray(data) ? data : []));
    }, []);

    return (
      <main style={{ backgroundColor: "#e8f5e9" }} className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 style={{ color: "#1e3a2f" }} className="text-3xl font-bold">
              🐾 我的寵物
            </h1>
            <div className="flex gap-2">
              <a
                href="/pets/new"
                style={{ backgroundColor: "#2d5a3d", color: "#e8f5e9" }}
                className="rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                + 新增寵物
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  window.location.href = "/login";
                }}
                style={{ backgroundColor: "#ffffff", color: "#6aab80", border: "1px solid #a8d5b5" }}
                className="rounded-lg px-4 py-2 text-sm hover:opacity-80 transition"
              >
                登出
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            {pets.map((pet) => (
              <a
                href={`/pets/${pet.id}`}
                key={pet.id}
                style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                className="rounded-2xl p-5 block hover:opacity-90 transition"
              >
                <h2 style={{ color: "#1e3a2f" }} className="text-xl font-semibold mb-1">
                  {pet.name}
                </h2>
                <p style={{ color: "#6aab80" }} className="text-sm">
                  {pet.species} · {pet.breed} · {pet.gender}
                </p>
              </a>
            ))}
          </div>
        </div>
      </main>
    );
  }    