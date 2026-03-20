"use client";

import { useEffect, useState } from "react";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

export default function Page() {
  const targetDate = new Date("2026-03-21T09:00:00");
  const [timeLeft, setTimeLeft] = useState<any>(null);
  const [started, setStarted] = useState(false);
  const router = useRouter();

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
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <img
              src="/spslogo.png"
              alt="SPS Logo"
              className="h-14 w-auto object-contain scale-110"
            />
            <span
              className={`text-xl md:text-2xl font-black tracking-tighter ${orbitron.className}`}
            >
              SP<span className="text-sky-500">AR</span>C
            </span>
          </div>

          <span className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-[0.2em]">
            Virtual CTF
          </span>
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
