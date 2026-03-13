"use client";                                                                                                                                            
   
  import { useState } from "react";                                                                                                                        
  import { useRouter } from "next/navigation";                                                                                                           
                                                                                                                                                           
  export default function LoginPage() {
    const router = useRouter();                                                                                                                            
    const [email, setEmail] = useState("");                                                                                                              
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");                                                                                                                
  
    const handleLogin = async () => {                                                                                                                      
      const res = await fetch("http://localhost:8080/api/auth/login", {                                                                                  
        method: "POST",                                                                                                                                    
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),                                                                                                         
      });                                                                                                                                                

      if (!res.ok) {
        setError("帳號或密碼錯誤");
        return;                                                                                                                                            
      }
                                                                                                                                                           
      const data = await res.json();                                                                                                                     
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);                                                                                                         
      router.push("/pets");
    };                                                                                                                                                     
                                                                                                                                                         
    return (
      <main style={{ backgroundColor: "#e8f5e9" }} className="min-h-screen flex items-center justify-center">
        <div style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }} className="rounded-2xl p-10 w-full max-w-md">                
          <h1 style={{ color: "#1e3a2f" }} className="text-3xl font-bold text-center mb-2">                                                                
            🐾 寵物健康護照                                                                                                                                
          </h1>                                                                                                                                            
          <p style={{ color: "#6aab80" }} className="text-center mb-8 text-sm">                                                                          
            你的寵物醫療紀錄，一掃即知                                                                                                                     
          </p>                                                                                                                                             
                                                                                                                                                           
          {error && (                                                                                                                                      
            <p className="text-red-400 mb-4 text-sm text-center">{error}</p>                                                                             
          )}                                                                                                                                               
   
          <input                                                                                                                                           
            type="email"                                                                                                                                 
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ borderColor: "#a8d5b5", color: "#1e3a2f" }}                                                                                           
            className="w-full border rounded-lg p-3 mb-4 outline-none"                                                                                     
          />                                                                                                                                               
          <input                                                                                                                                           
            type="password"                                                                                                                                
            placeholder="密碼"                                                                                                                             
            value={password}                                                                                                                               
            onChange={(e) => setPassword(e.target.value)}                                                                                                  
            style={{ borderColor: "#a8d5b5", color: "#1e3a2f" }}                                                                                           
            className="w-full border rounded-lg p-3 mb-6 outline-none"                                                                                     
          />                                                                                                                                               
          <button                                                                                                                                          
            onClick={handleLogin}                                                                                                                          
            style={{ backgroundColor: "#2d5a3d", color: "#e8f5e9" }}                                                                                       
            className="w-full rounded-lg p-3 font-semibold hover:opacity-90 transition"                                                                    
          >                                                                                                                                                
            登入                                                                                                                                           
          </button>                                                                                                                                        
        </div>                                                                                                                                           
      </main>
    );                                                                                                                                                     
  }
