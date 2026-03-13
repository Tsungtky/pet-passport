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
        .then((data) => setPets(data));                                                                                                                    
    }, []);                                                                                                                                                
   
    return (                                                                                                                                               
      <main style={{ backgroundColor: "#41313e" }} className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">                                                                                                                
          <div className="flex justify-between items-center mb-8">
            <h1 style={{ color: "#d8f2da" }} className="text-3xl font-bold">                                                                               
              🐾 我的寵物                                                                                                                                  
            </h1>                                                                                                                                          
            <button                                                                                                                                        
              onClick={() => {                                                                                                                             
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                window.location.href = "/login";
              }}                                                                                                                                           
              style={{ backgroundColor: "#5a5158", color: "#a5b1a6" }}
              className="rounded-lg px-4 py-2 text-sm hover:opacity-80 transition"                                                                         
            >                                                                                                                                              
              登出                                                                                                                                         
            </button>                                                                                                                                      
          </div>  

          <div className="grid gap-4">                                                                                                                     
            {pets.map((pet) => (
              <a                                                                                                                                           
                href={`/pets/${pet.id}`}
                key={pet.id}
                style={{ backgroundColor: "#5a5158" }}
                className="rounded-2xl p-5 block hover:opacity-90 transition"                                                                              
              >
                <h2 style={{ color: "#d8f2da" }} className="text-xl font-semibold mb-1">                                                                   
                  {pet.name}                                                                                                                               
                </h2>                                                                                                                                      
                <p style={{ color: "#a5b1a6" }} className="text-sm">                                                                                       
                  {pet.species} · {pet.breed} · {pet.gender}                                                                                               
                </p>                                                                                                                                       
              </a>                                                                                                                                         
            ))}                                                                                                                                            
          </div>  
        </div>
      </main>
    );
  }

