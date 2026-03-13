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
      fetch("http://localhost:8080/api/pets/owner/1")
        .then((res) => res.json())                                                                                                                         
        .then((data) => setPets(data));                                                                                                                    
    }, []);
                                                                                                                                                           
    return (      
      <main className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">我的寵物</h1>                                                                                
        <div className="grid gap-4">                                                                                                                       
          {pets.map((pet) => (                                                                                                                             
            <a href={`/pets/${pet.id}`} key={pet.id} className="bg-white rounded-lg shadow p-4 block hover:shadow-md transition">                                                                                  
              <h2 className="text-xl font-semibold">{pet.name}</h2>                                                                                        
              <p className="text-gray-500">{pet.species} · {pet.breed}</p>
              <p className="text-sm text-gray-400 mt-2">QR: {pet.qrCode}</p>                                                                               
            </a>                                                                                                                                         
          ))}                                                                                                                                              
        </div>                                                                                                                                             
      </main>     
    );
  }
