"use client";

import { useEffect, useState } from "react";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });
const supabase = createClient(
  "https://wgtouvbajowqrdrmvcut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG91dmJham93cXJkcm12Y3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTg0MTUsImV4cCI6MjA4OTQ3NDQxNX0.lLPTRfi_sKe5uxPWBp_agIPCYroaAduV8LH67jPMrhY",
);

const rules = [
  {
    section: "🕒 Event Duration",
    items: [
      "The competition will be accessible from 9:00 AM on 21st March to 11:59 PM on 22nd March.",
      "Participants may attempt challenges at any time within this window.",
    ],
  },
  {
    section: "👥 Team Access Rule",
    items: [
      "Only one member per team is allowed to log in to the platform at any given time.",
      "Teams are responsible for coordinating internally; multiple simultaneous logins may lead to disqualification.",
    ],
  },
  {
    section: "🧩 Challenge Completion & Early Termination",
    items: [
      "The CTF consists of 4 puzzles.",
      "If the top 3 teams successfully solve all 4 puzzles, the competition will officially conclude early.",
      "Even after early termination, other participants may continue solving challenges.",
    ],
  },
  {
    section: "🏆 Winner Determination",
    items: [
      "If no team solves all puzzles by 11:59 PM on 22nd March, the top 3 teams on the leaderboard will be declared winners.",
      "Rankings are determined based on number of puzzles solved and time taken to solve those puzzles.",
    ],
  },
  {
    section: "⚖️ Tie-Breaking Rule",
    items: [
      "If two or more teams solve the same number of challenges, the team that achieved it in the least amount of time will rank higher.",
    ],
  },
  {
    section: "📊 Leaderboard",
    items: [
      "Participants will have access to a live leaderboard displaying the top 10 teams.",
    ],
  },
  {
    section: "💡 Hints",
    items: [
      "Hints will be released at regular intervals.",
      "Participants can access them via the Hint Logs section.",
    ],
  },
];

// Dramatic final 10 second countdown component
function FinalCountdown({ seconds }: { seconds: number }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / 10) * circumference;
  const isUrgent = seconds <= 5;

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <p className="text-gray-400 uppercase tracking-widest text-xs animate-pulse">
        LAUNCHING IN
      </p>

      <div className="relative flex items-center justify-center">
        {/* Outer ring glow */}
        <div
          className={`absolute w-52 h-52 rounded-full ${isUrgent ? "bg-red-500/10" : "bg-sky-500/10"} animate-ping`}
          style={{ animationDuration: "1s" }}
        />

        {/* SVG ring */}
        <svg width="220" height="220" className="rotate-[-90deg]">
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={isUrgent ? "rgba(239,68,68,0.15)" : "rgba(14,165,233,0.15)"}
            strokeWidth="6"
          />
          {/* Progress */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke={isUrgent ? "#ef4444" : "#0ea5e9"}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
          />
        </svg>

        {/* Center number */}
        <div className="absolute flex flex-col items-center">
          <span
            className={`font-black tabular-nums ${isUrgent ? "text-red-400" : "text-sky-400"} ${orbitron.className}`}
            style={{
              fontSize: "72px",
              lineHeight: 1,
              transition: "color 0.3s",
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            {seconds}
          </span>
          <span className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            seconds
          </span>
        </div>
      </div>

      {/* Tick marks */}
      <div className="flex gap-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              i < seconds
                ? isUrgent
                  ? "bg-red-400"
                  : "bg-sky-400"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>

      <p
        className={`text-xs uppercase tracking-[0.4em] font-bold ${isUrgent ? "text-red-400" : "text-sky-500"} animate-pulse`}
      >
        {isUrgent ? "⚠ IMMINENT LAUNCH" : "SYSTEM INITIALIZING..."}
      </p>
    </div>
  );
}

export default function Page() {
  const targetDate = new Date("2026-03-20T23:20:00");
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [started, setStarted] = useState(false);
  const [totalSecondsLeft, setTotalSecondsLeft] = useState<number>(Infinity);
  const router = useRouter();
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotice(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    } else {
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
        router.push("/ctf/dashboard");
      } else {
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
        setTotalSecondsLeft(0);
        clearInterval(interval);
        return;
      }

      const totalSecs = Math.ceil(diff / 1000);
      setTotalSecondsLeft(totalSecs);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isFinalCountdown = totalSecondsLeft <= 10 && totalSecondsLeft > 0;

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Nav */}
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
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 text-xs px-4 h-8 rounded-lg transition-all cursor-pointer"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Rules Popup */}
      {showNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#0a1018] border border-sky-500/20 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-50" />
            <div className="px-8 pt-8 pb-4 shrink-0">
              <button
                onClick={() => setShowNotice(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
              <div className="text-center space-y-2">
                <h3
                  className={`text-3xl font-black tracking-tighter ${orbitron.className}`}
                >
                  VIRTUAL <span className="text-sky-500">CTF</span> TERMINAL
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-bold">
                  Secure Environment // Unauthorized Access Prohibited
                </p>
              </div>
              <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em] mt-6">
                📜 Rules & Guidelines
              </p>
            </div>
            <div className="overflow-y-auto px-8 pb-8 space-y-5 flex-1 custom-scrollbar">
              {rules.map((rule, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-xs font-black text-white tracking-wide">
                    {rule.section}
                  </p>
                  {rule.items.map((text, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:border-sky-500/30 transition-all"
                    >
                      <span className="text-sky-500 font-mono text-xs mt-0.5 shrink-0">
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <p className="text-[12px] text-gray-300 font-medium leading-relaxed tracking-wide">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
              <Button
                onClick={() => setShowNotice(false)}
                className="w-full bg-sky-600 hover:bg-sky-500 text-black font-black uppercase tracking-widest py-6 rounded-xl mt-2 cursor-pointer"
              >
                I Understand — Let's Go
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Background blobs */}
      <div className="absolute w-[500px] h-[500px] bg-sky-500/10 blur-[120px] rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full bottom-[-100px] right-[-100px]" />

      {/* Main content */}
      <div className="w-full max-w-2xl text-center space-y-10 z-10">
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

        {!started ? (
          isFinalCountdown ? (
            // DRAMATIC FINAL 10 SECOND COUNTDOWN
            <FinalCountdown seconds={totalSecondsLeft} />
          ) : (
            // NORMAL COUNTDOWN
            <>
              <p className="text-gray-400 uppercase tracking-widest text-xs">
                Challenge starts in
              </p>
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {["days", "hours", "minutes", "seconds"].map((unit, i) => (
                  <div key={unit} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-3xl sm:text-4xl md:text-5xl font-black text-sky-500 tabular-nums animate-pulse ${orbitron.className}`}
                      >
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
          )
        ) : (
          <>
            <div className="space-y-4">
              <p className="text-green-400 text-lg font-semibold animate-pulse">
                ● Challenge is Live
              </p>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                The CTF is now active. Start solving and climb the leaderboard.
              </p>
            </div>
            <Button
              className="bg-sky-500 hover:bg-sky-600 text-black font-bold px-10 py-5 rounded-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => router.push("/ctf/challenge")}
            >
              Enter Challenge
            </Button>
          </>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.4);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
