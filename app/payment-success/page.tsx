"use client";

import { Orbitron } from "next/font/google";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

export default function SuccessPage() {
  const router = useRouter();
  useEffect(() => {
    const allowed = localStorage.getItem("registered");

    if (!allowed) {
      router.replace("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-[#060b12]/80 backdrop-blur-xl border-b border-sky-900/40 py-4 px-6 md:px-10 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span
            className={`font-bold text-lg md:text-xl cursor-pointer ${orbitron.className}`}
            onClick={() => router.push("/")}
          >
            SP<span className="text-sky-500">AR</span>C
          </span>

          <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">
            Registration Success
          </span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex items-center justify-center px-6 pt-32 pb-20">
        <div className="text-center space-y-8 bg-[#0a1018] border border-green-900/40 rounded-2xl p-10 max-w-lg shadow-[0_0_60px_rgba(34,197,94,0.1)]">
          <div className="text-green-500 text-6xl">✓</div>

          <h1
            className={`text-3xl md:text-4xl font-black ${orbitron.className}`}
          >
            Registration Successful
          </h1>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            Your registration has been successfully submitted. will review your
            details and get back to you soon. Thank you for registering for
            SPARC 2026!
          </p>

          <Button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 px-8 py-6 text-white font-bold"
          >
            Go Home
          </Button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#040608] py-20 px-8 border-t border-sky-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 text-gray-500 text-sm">
          <div className="space-y-6">
            <div
              className={`text-3xl font-black text-white ${orbitron.className}`}
            >
              SPARC 2026
            </div>

            <p className="max-w-sm">
              BMS Institute of Technology and Management
              <br />
              Bengaluru – 560064
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
