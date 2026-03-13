"use client";                                                                                                                                            
                                                                                                                                                           
  import { useState } from "react";                                                                                                                        
  import { useRouter } from "next/navigation";                                                                                                             
                                                                                                                                                           
  export default function NewPetPage() {
    const router = useRouter();                                                                                                                            
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");                                                                                                                
    const [gender, setGender] = useState("");
                                                                                                                                                           
    const handleSubmit = async () => {
      const userId = localStorage.getItem("userId");
      await fetch("http://localhost:8080/api/pets", {                                                                                                      
        method: "POST",                                                                                                                                    
        headers: { "Content-Type": "application/json" },                                                                                                   
        body: JSON.stringify({                                                                                                                             
          name,   
          species,                                                                                                                                         
          breed,  
          gender,
          owner: { id: Number(userId) },
        }),                                                                                                                                                
      });
      router.push("/pets");                                                                                                                                
    };            

    return (
      <main style={{ backgroundColor: "#41313e" }} className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">                                                                                                                
          <a href="/pets" style={{ color: "#a5b1a6" }} className="text-sm mb-6 block hover:opacity-80">                                                    
            ← 返回列表                                                                                                                                     
          </a>                                                                                                                                             
                                                                                                                                                           
          <h1 style={{ color: "#d8f2da" }} className="text-3xl font-bold mb-8">                                                                            
            新增寵物
          </h1>                                                                                                                                            
                  
          <div style={{ backgroundColor: "#5a5158" }} className="rounded-2xl p-6 flex flex-col gap-4">                                                     
            {[
              { label: "名字", value: name, setValue: setName, placeholder: "例：Hana" },                                                                  
              { label: "種類", value: species, setValue: setSpecies, placeholder: "例：狗、貓" },                                                          
              { label: "品種", value: breed, setValue: setBreed, placeholder: "例：柴犬" },                                                                
              { label: "性別", value: gender, setValue: setGender, placeholder: "例：男、女" },                                                            
            ].map((field) => (                                                                                                                             
              <div key={field.label}>
                <label style={{ color: "#bed1c0" }} className="text-sm mb-1 block">{field.label}</label>                                                   
                <input                                                                                                                                     
                  value={field.value}
                  onChange={(e) => field.setValue(e.target.value)}                                                                                         
                  placeholder={field.placeholder}
                  style={{ backgroundColor: "#41313e", color: "#d8f2da", borderColor: "#737172" }}
                  className="w-full border rounded-lg p-3 outline-none"                                                                                    
                />                                                                                                                                         
              </div>                                                                                                                                       
            ))}                                                                                                                                            
                  
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: "#dad8f2", color: "#41313e" }}
              className="w-full rounded-lg p-3 font-semibold hover:opacity-90 transition mt-2"                                                             
            >                                                                                                                                              
              新增                                                                                                                                         
            </button>                                                                                                                                      
          </div>  
        </div>                                                                                                                                             
      </main>                                                                                                                                              
    );                                                                                                                                                     
  }                                               