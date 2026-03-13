"use client";                                                                                                                                            
                                                                                                                                                           
  import { useState } from "react";                                                                                                                        
  import { useRouter } from "next/navigation";                                                                                                           
  import { use } from "react";                                                                                                                             
                                                                                                                                                         
  export default function NewVaccinePage({ params }: { params: Promise<{ id: string }> }) {                                                                
    const { id } = use(params);
    const router = useRouter();                                                                                                                            
    const [vaccineName, setVaccineName] = useState("");                                                                                                  
    const [vaccinatedDate, setVaccinatedDate] = useState("");                                                                                              
    const [nextDueDate, setNextDueDate] = useState("");
    const [clinicName, setClinicName] = useState("");                                                                                                      
    const [notes, setNotes] = useState("");                                                                                                                
   
    const handleSubmit = async () => {                                                                                                                     
      await fetch("http://localhost:8080/api/vaccines", {                                                                                                
        method: "POST",                                                                                                                                    
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({                                                                                                                             
          vaccineName,                                                                                                                                   
          vaccinatedDate,
          nextDueDate,
          clinicName,
          notes,
          pet: { id: Number(id) },                                                                                                                         
        }),                                                                                                                                                
      });                                                                                                                                                  
      router.push(`/pets/${id}`);                                                                                                                          
    };                                                                                                                                                     
   
    return (                                                                                                                                               
      <main style={{ backgroundColor: "#e8f5e9" }} className="min-h-screen p-8">                                                                         
        <div className="max-w-2xl mx-auto">
          <a href={`/pets/${id}`} style={{ color: "#6aab80" }} className="text-sm mb-6 block hover:opacity-80">                                            
            ← 返回
          </a>                                                                                                                                             
                                                                                                                                                         
          <h1 style={{ color: "#1e3a2f" }} className="text-3xl font-bold mb-8">                                                                            
            新增疫苗紀錄                                                                                                                                 
          </h1>                                                                                                                                            
   
          <div style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }} className="rounded-2xl p-6 flex flex-col gap-4">            
            {[                                                                                                                                           
              { label: "疫苗名稱", value: vaccineName, setValue: setVaccineName, placeholder: "例：狂犬病疫苗", type: "text" },                            
              { label: "接種日期", value: vaccinatedDate, setValue: setVaccinatedDate, placeholder: "", type: "date" },                                    
              { label: "下次補打日期", value: nextDueDate, setValue: setNextDueDate, placeholder: "", type: "date" },                                      
              { label: "診所名稱", value: clinicName, setValue: setClinicName, placeholder: "例：台北動物醫院", type: "text" },                            
              { label: "備註", value: notes, setValue: setNotes, placeholder: "選填", type: "text" },                                                      
            ].map((field) => (                                                                                                                             
              <div key={field.label}>                                                                                                                      
                <label style={{ color: "#2d5a3d" }} className="text-sm mb-1 block">{field.label}</label>                                                   
                <input                                                                                                                                     
                  type={field.type}
                  value={field.value}                                                                                                                      
                  onChange={(e) => field.setValue(e.target.value)}                                                                                       
                  placeholder={field.placeholder}                                                                                                          
                  style={{ borderColor: "#a8d5b5", color: "#1e3a2f" }}                                                                                     
                  className="w-full border rounded-lg p-3 outline-none"                                                                                    
                />                                                                                                                                         
              </div>                                                                                                                                       
            ))}                                                                                                                                          
                                                                                                                                                           
            <button
              onClick={handleSubmit}                                                                                                                       
              style={{ backgroundColor: "#2d5a3d", color: "#e8f5e9" }}                                                                                   
              className="w-full rounded-lg p-3 font-semibold hover:opacity-90 transition mt-2"
            >                                                                                                                                              
              新增
            </button>                                                                                                                                      
          </div>                                                                                                                                         
        </div>                                                                                                                                             
      </main>
    );                                                                                                                                                     
  }                                                                                      