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
      <main style={{ backgroundColor: "#41313e" }} className="min-h-screen flex items-center justify-center">
        <div style={{ backgroundColor: "#5a5158" }} className="rounded-2xl shadow-xl p-10 w-full max-w-md">                                                
          <h1 style={{ color: "#d8f2da" }} className="text-3xl font-bold text-center mb-2">                                                                
            🐾 寵物健康護照                                                                                                                                
          </h1>                                                                                                                                            
          <p style={{ color: "#a5b1a6" }} className="text-center mb-8 text-sm">                                                                            
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
            style={{ backgroundColor: "#41313e", color: "#d8f2da", borderColor: "#737172" }}                                                               
            className="w-full border rounded-lg p-3 mb-4 outline-none placeholder-gray-500"                                                                
          />                                                                                                                                               
          <input                                                                                                                                           
            type="password"                                                                                                                                
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ backgroundColor: "#41313e", color: "#d8f2da", borderColor: "#737172" }}
            className="w-full border rounded-lg p-3 mb-6 outline-none placeholder-gray-500"                                                                
          />                                                                                                                                               
          <button                                                                                                                                          
            onClick={handleLogin}                                                                                                                          
            style={{ backgroundColor: "#dad8f2", color: "#41313e" }}                                                                                       
            className="w-full rounded-lg p-3 font-semibold hover:opacity-90 transition"                                                                    
          >                                                                                                                                                
            登入                                                                                                                                           
          </button>                                                                                                                                        
        </div>    
      </main>
    );
  }