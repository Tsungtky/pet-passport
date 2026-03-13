"use client";                                                                                                                                            
                  
  import { useEffect, useState } from "react";
  import { use } from "react";
                                                                                                                                                           
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
   
    if (!pet) return <p className="p-8">載入中...</p>;                                                                                                     
                  
    return (                                                                                                                                               
      <main className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">{pet.name}</h1>                                                                              
        <p className="text-gray-500 mb-6">{pet.species} · {pet.breed} · {pet.gender}</p>                                                                   
                                                                                                                                                           
        <div className="bg-white rounded-lg shadow p-4 mb-6">                                                                                              
          <h2 className="font-semibold mb-2">基本資料</h2>                                                                                                 
          <p>生日：{pet.birthday ?? "未填"}</p>                                                                                                            
          <p>血型：{pet.bloodType ?? "未填"}</p>
          <p>晶片：{pet.chipNumber ?? "未填"}</p>                                                                                                          
        </div>                                                                                                                                             
                                                                                                                                                           
        <div className="bg-white rounded-lg shadow p-4">                                                                                                   
          <h2 className="font-semibold mb-2">疫苗紀錄</h2>
          {vaccines.length === 0 ? (                                                                                                                       
            <p className="text-gray-400">尚無紀錄</p>
          ) : (                                                                                                                                            
            vaccines.map((v) => (
              <div key={v.id} className="border-b py-2">
                <p className="font-medium">{v.vaccineName}</p>                                                                                             
                <p className="text-sm text-gray-500">{v.vaccinatedDate} · {v.clinicName}</p>
                <p className="text-sm text-gray-400">下次：{v.nextDueDate}</p>                                                                             
              </div>                                                                                                                                       
            ))                                                                                                                                             
          )}                                                                                                                                               
        </div>    
      </main>
    );
  }
