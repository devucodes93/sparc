"use client";

import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

export default function VirtualCTFPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#05070b] text-white overflow-x-hidden">
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
            Virtual CTF
          </span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 md:pt-36 pb-20 px-6 md:px-10 max-w-6xl mx-auto space-y-20 md:space-y-28">
        {/* HERO */}
        <section className="text-center space-y-6 border-b border-sky-900/30 pb-10 md:pb-14">
          <h1
            className={`text-3xl sm:text-4xl md:text-6xl font-black leading-tight ${orbitron.className}`}
          >
            Virtual CTF – Signal Processing Edition
          </h1>
        </section>
        {/* DESCRIPTION */}
        <section className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:p-10 space-y-6 shadow-[0_0_40px_rgba(14,165,233,0.05)]">
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
            The Virtual Capture-The-Flag (CTF) challenge is an online,
            puzzle-based competition focused on signal processing concepts
            hidden inside real-world signals. Participants solve a series of
            progressively challenging problems by analyzing, decoding, and
            transforming signals to uncover hidden flags.
          </p>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
            This CTF blends engineering intuition, math, and creative
            problem-solving, making signal processing fun, interactive, and
            hands-on.
          </p>

          <p className="text-sky-500 font-semibold text-sm sm:text-base">
            Prize Pool: 20k
          </p>
        </section>
        {/* CHALLENGE FORMAT */}
        <SectionTitle title="Challenge Format" orbitron={orbitron.className} />
        <div className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:p-10 shadow-[0_0_40px_rgba(14,165,233,0.05)] space-y-6">
          <InfoItem label="Mode" value="Fully virtual" />
          <InfoItem label="Team" value="3 to 4 members" />
          <InfoItem
            label="Difficulty"
            value="Beginner → Intermediate → Advanced"
          />
          <InfoItem
            label="Platform"
            value="Web-based (no installations required)"
          />
        </div>
        {/* FINAL DESCRIPTION */}
        <section className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:p-10 shadow-[0_0_40px_rgba(14,165,233,0.05)]">
          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
            Each challenge presents a signal (audio, image, time-series, or
            RF-like data) that contains a hidden flag. Participants must apply
            signal processing techniques to extract it.
          </p>
        </section>{" "}
        <section className="text-center bg-gradient-to-br from-sky-900/10 to-transparent border border-sky-900/40 rounded-2xl px-6 py-10 md:px-14 md:py-16 space-y-6">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-black ${orbitron.className}`}
          >
            Registration Opening Soon
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Stay tuned for registration updates. We look forward to welcoming
            you to an engaging and insightful IEEE SPS experience.
          </p>

          <p className="text-sky-500 uppercase tracking-widest text-xs md:text-sm">
            March 7, 2026 • BMS Institute of Technology
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#040608] py-20 px-8 border-t border-sky-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 text-gray-500">
          <div className="space-y-6">
            <div
              className={`text-3xl font-black text-white ${orbitron.className}`}
            >
              SPARC 2026
            </div>

            <p className="text-sm max-w-sm">
              BMS Institute of Technology and Management
              <br />
              Doddaballapur Main Road, Yelahanka, Bengaluru – 560064
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-2 text-sm">
            <p className="text-white font-bold">Contact Administration</p>
            <p>sparc@bmsit.in</p>
            <p>+91 96061 82802</p>

            <p className="mt-6 text-sky-500 font-black tracking-tighter">
              EXCELLENCE THROUGH INNOVATION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function SectionTitle({
  title,
  orbitron,
}: {
  title: string;
  orbitron: string;
}) {
  return (
    <div className="space-y-3">
      <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold ${orbitron}`}>
        {title}
      </h2>
      <div className="w-14 md:w-16 h-1 bg-sky-500" />
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-6 items-start border-l-2 border-sky-900 pl-6 relative">
      <div className="absolute -left-[7px] top-2 w-3 h-3 bg-sky-500 rounded-full" />
      <span className="text-sky-500 font-semibold text-sm min-w-[110px]">
        {label}
      </span>
      <span className="text-gray-400 text-sm md:text-base mt-1 sm:mt-0">
        {value}
      </span>
    </div>
  );
}
