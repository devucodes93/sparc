"use client";

import { useEffect, useState } from "react";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://wgtouvbajowqrdrmvcut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG91dmJham93cXJkcm12Y3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTg0MTUsImV4cCI6MjA4OTQ3NDQxNX0.lLPTRfi_sKe5uxPWBp_agIPCYroaAduV8LH67jPMrhY",
);

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.push("/ctf/dashboard");
      }
    };

    checkSession();
  }, [router]);
  const handleLogin = async () => {
    if (!name.trim()) {
      setErrorMsg("Team name is required! ");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Invalid email or password ");
      setLoading(false);
      return;
    }

    if (data?.user) {
    
      const { error: nameError } = await supabase
        .from("users")
        .update({ name: name.trim() })
        .eq("id", data.user.id);

      if (nameError) console.error("Name update failed:", nameError.message);

    
      await supabase
        .from("progress")
        .upsert(
          { user_id: data.user.id, current_question: 1, score: 0 },
          { onConflict: "user_id", ignoreDuplicates: true },
        );

      setSuccessMsg("Login successful ✅ Redirecting...");
      router.push("/ctf/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex items-center justify-center px-6">
      {" "}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-xl px-6 py-2 border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-17">
        
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              router.push("/");
            }}
          >
            <div className="flex items-center">
              <img
                src="/spslogo.png"
                alt="SPS Logo"
                className="h-14 w-auto object-contain scale-110"
              />
            </div>
            <span
              className={`text-xl md:text-2xl font-black tracking-tighter ${orbitron.className}`}
            >
              SP<span className="text-sky-500">AR</span>C
            </span>
          </div>

        
          <span className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-[0.2em] ml-2">
            Virtual CTF
          </span>
        </div>
      </nav>
      {/* CARD */}
      <div className="w-full max-w-md bg-[#0a1018] border border-sky-900/40 rounded-2xl p-8 md:p-10 space-y-8 shadow-[0_0_60px_rgba(14,165,233,0.08)]">
   
        <div className="text-center space-y-3">
          <h1
            className={`text-2xl md:text-3xl font-black ${orbitron.className}`}
          >
            Virtual CTF Login
          </h1>

          <p className="text-gray-400 text-sm">
            Access your challenge dashboard
          </p>
        </div>

        {/* INPUTS */}
        <div className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#05070b] border border-sky-900/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">
             Name (For Leaderboard)
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#05070b] border border-sky-900/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
            />
          </div>

          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#05070b] border border-sky-900/40 rounded-lg px-4 py-3 text-sm outline-none focus:border-sky-500 transition"
            />
          </div>
        </div>
        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}

        {successMsg && (
          <p className="text-green-500 text-sm text-center">{successMsg}</p>
        )}
        {/* BUTTON */}
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-sky-500 hover:bg-sky-600 text-black font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* FOOT NOTE */}
        <p className="text-center text-xs text-gray-500">
          Credentials are provided after registration
        </p>
      </div>
    </div>
  );
}
