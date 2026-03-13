"use client";                                                                                                                                            
   
  import { useEffect, useState } from "react";                                                                                                             
  import { use } from "react";                                                                                                                           
  import { QRCodeSVG } from "qrcode.react";                                                                                                                
  
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
  };

  type Vaccine = {                                                                                                                                         
    id: number;
    vaccineName: string;                                                                                                                                   
    vaccinatedDate: string;                                                                                                                              
    nextDueDate: string;                                                                                                                                   
    clinicName: string;                                                                                                                                    
  };                                                                                                                                                       
                                                                                                                                                           
  export default function PetDetailPage({ params }: { params: Promise<{ id: string }> }) {                                                                 
    const { id } = use(params);                                                                                                                          
    const [pet, setPet] = useState<Pet | null>(null);                                                                                                      
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);                                                                                             
                                                                                                                                                           
    useEffect(() => {
      fetch(`http://localhost:8080/api/pets/${id}`)                                                                                                        
        .then((res) => res.json())                                                                                                                         
        .then((data) => setPet(data));
                                                                                                                                                           
      fetch(`http://localhost:8080/api/vaccines/pet/${id}`)                                                                                              
        .then((res) => res.json())                                                                                                                         
        .then((data) => setVaccines(data));                                                                                                              
    }, [id]);

    if (!pet) return (                                                                                                                                     
      <main style={{ backgroundColor: "#e8f5e9" }} className="min-h-screen flex items-center justify-center">
        <p style={{ color: "#6aab80" }}>載入中...</p>                                                                                                      
      </main>                                                                                                                                              
    );                                                                                                                                                     
                                                                                                                                                           
    return (                                                                                                                                             
      <main style={{ backgroundColor: "#e8f5e9" }} className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
                                                                                                                                                           
          <a href="/pets" style={{ color: "#6aab80" }} className="text-sm mb-6 block hover:opacity-80">                                                    
            ← 返回列表                                                                                                                                     
          </a>                                                                                                                                             
                                                                                                                                                         
          <h1 style={{ color: "#1e3a2f" }} className="text-3xl font-bold mb-1">{pet.name}</h1>                                                             
          <p style={{ color: "#6aab80" }} className="mb-8">{pet.species} · {pet.breed} · {pet.gender}</p>                                                
                                                                                                                                                           
          <div style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} className="rounded-2xl p-6 mb-4">                           
            <h2 style={{ color: "#1e3a2f" }} className="font-semibold mb-3">基本資料</h2>                                                                  
            <p style={{ color: "#2d5a3d" }}>生日：{pet.birthday ?? "未填"}</p>                                                                             
            <p style={{ color: "#2d5a3d" }}>血型：{pet.bloodType ?? "未填"}</p>                                                                            
            <p style={{ color: "#2d5a3d" }}>晶片：{pet.chipNumber ?? "未填"}</p>                                                                           
          </div>                                                                                                                                           
                                                                                                                                                           
          <div style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} className="rounded-2xl p-6 mb-4">                           
            <div className="flex justify-between items-center mb-3">                                                                                                 
                <h2 style={{ color: "#1e3a2f" }} className="font-semibold">疫苗紀錄</h2>                                                                               
                <a                                                                                                                                                     
                href={`/pets/${id}/vaccines`}                                                                                                                        
                style={{ backgroundColor: "#2d5a3d", color: "#e8f5e9" }}                                                                                             
                className="rounded-lg px-3 py-1 text-sm hover:opacity-90 transition"                                                                                 
                >
                + 新增                                                                                                                                               
                </a>                                                                                                                                                 
            </div>                                                                              
            {vaccines.length === 0 ? (                                                                                                                     
              <p style={{ color: "#a8d5b5" }}>尚無紀錄</p>                                                                                               
            ) : (                                                                                                                                          
              vaccines.map((v) => (                                                                                                                        
                <div key={v.id} style={{ borderColor: "#e8f5e9" }} className="border-b py-3">                                                              
                  <p style={{ color: "#1e3a2f" }} className="font-medium">{v.vaccineName}</p>                                                              
                  <p style={{ color: "#6aab80" }} className="text-sm">{v.vaccinatedDate} · {v.clinicName}</p>                                              
                  <p style={{ color: "#a8d5b5" }} className="text-sm">下次：{v.nextDueDate}</p>                                                            
                </div>                                                                                                                                     
              ))                                                                                                                                           
            )}                                                                                                                                             
          </div>                                                                                                                                         

          <div style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} className="rounded-2xl p-6">                                
            <h2 style={{ color: "#1e3a2f" }} className="font-semibold mb-4">QR Code</h2>
            <div style={{ backgroundColor: "#e8f5e9" }} className="inline-block p-4 rounded-xl">                                                           
              <QRCodeSVG value={pet.qrCode} size={180} />                                                                                                  
            </div>                                                                                                                                         
            <p style={{ color: "#a8d5b5" }} className="text-xs mt-3">{pet.qrCode}</p>                                                                      
          </div>                                                                                                                                           
                                                                                                                                                           
        </div>                                                                                                                                             
      </main>                                                                                                                                            
    );                                                                                                                                                     
  }                                 