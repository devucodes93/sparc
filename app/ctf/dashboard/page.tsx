"use client";

import { useEffect, useState } from "react";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });
const supabase = createClient(
  "https://wgtouvbajowqrdrmvcut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG91dmJham93cXJkcm12Y3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTg0MTUsImV4cCI6MjA4OTQ3NDQxNX0.lLPTRfi_sKe5uxPWBp_agIPCYroaAduV8LH67jPMrhY",
);
export default function Page() {
  const targetDate = new Date("2026-03-21T9:00:00");
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [started, setStarted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
      // Clear local storage and redirect
      localStorage.clear();
      router.push("/ctf/login");
    }
  };
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // If logged in, skip this and go to dashboard
        router.push("/ctf/dashboard");
      } else {
        // 🔥 If NO session, kick them back to login immediately
        router.push("/ctf/login");
      }
    };

    checkSession();
  }, [router]);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setStarted(true);
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl px-6 py-2 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="/spslogo.png"
              alt="SPS Logo"
              className="h-14 w-auto object-contain"
            />
            <span
              className={`text-xl md:text-2xl font-black tracking-tighter ${orbitron.className}`}
            >
              SP<span className="text-sky-500">AR</span>C
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:block text-xs text-gray-400 uppercase tracking-widest">
              Virtual CTF
            </span>
            <Button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-xs px-4 h-8 rounded-lg transition-all  cursor-pointer"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* BACKGROUND */}
      <div className="absolute w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* MAIN */}
      <div className="w-full max-w-2xl text-center space-y-10 z-10">
        {/* TITLE */}
        <div className="space-y-4">
          <h1
            className={`text-4xl md:text-6xl font-black ${orbitron.className}`}
          >
            Virtual CTF
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Decode signals, break patterns, and compete in a high-intensity
            signal processing challenge.
          </p>
        </div>

        {/* COUNTDOWN */}
        {!started ? (
          <>
            <p className="text-gray-400 uppercase tracking-widest text-xs">
              Challenge starts in
            </p>

            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {["days", "hours", "minutes", "seconds"].map((unit, i) => (
                <div key={unit} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-black text-sky-500 tabular-nums animate-pulse">
                      {timeLeft
                        ? String(timeLeft[unit]).padStart(2, "0")
                        : "--"}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 uppercase">
                      {unit}
                    </span>
                  </div>

                  {i !== 3 && (
                    <span className="text-sky-500 text-2xl font-bold">:</span>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* LIVE */}
            <div className="space-y-4">
              <p className="text-green-400 text-lg font-semibold animate-pulse">
                ● Challenge is Live
              </p>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                The CTF is now active. Start solving and climb the leaderboard.
              </p>
            </div>

            <Button
              className="bg-sky-500 hover:bg-sky-600 text-black font-bold px-10 py-5 rounded-xl transition-all hover:scale-105"
              onClick={() => router.push("/ctf/challenge")}
            >
              Enter Challenge
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
