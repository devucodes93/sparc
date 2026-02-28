"use client";

import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

export default function IeeeOpenDayPage() {
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
            IEEE Open Day
          </span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 md:pt-36 pb-20 px-6 md:px-10 max-w-6xl mx-auto space-y-20 md:space-y-28">
        {/* HERO */}
        <section className="text-center space-y-6 border-b border-sky-900/30 pb-10 md:pb-14">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-sky-500 font-semibold">
            SPARC 2026 Technical Showcase
          </p>

          <h1
            className={`text-3xl sm:text-4xl md:text-6xl font-black leading-tight ${orbitron.className}`}
          >
            IEEE Open Day
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
            An interactive showcase by the IEEE Signal Processing Society (SPS),
            introducing students to real-world signal processing applications
            through live demonstrations and open discussions.
          </p>

          <p className="text-sky-500 uppercase tracking-widest text-xs md:text-sm">
            March 13, 2026
          </p>
        </section>

        {/* ABOUT */}
        <SectionTitle title="About the Event" orbitron={orbitron.className} />

        <div className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:p-10 shadow-[0_0_40px_rgba(14,165,233,0.05)] space-y-6 text-gray-400 text-sm md:text-base leading-relaxed">
          <p>
            IEEE Open Day is an interactive showcase hosted by the IEEE Signal
            Processing Society (SPS), designed to introduce students to the
            world of signal processing through hands-on projects, live demos,
            and open discussions.
          </p>

          <p>
            This event brings together technology enthusiasts, curious
            beginners, and core engineering students to explore how signal
            processing powers real-world systems — from audio and images to
            communications, embedded systems, and AI.
          </p>
        </div>

        {/* WHAT TO EXPECT */}
        <SectionTitle title="What to Expect" orbitron={orbitron.className} />

        <div className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:p-10 space-y-6 shadow-[0_0_40px_rgba(14,165,233,0.05)]">
          {[
            [
              "Live Project Demonstrations",
              "Explore student-built projects across domains like audio processing, image analysis, embedded systems, ML-based signal applications, and real-time systems.",
            ],
            [
              "Interactive Signal Processing Sessions",
              "Understand signal processing concepts visually and intuitively through demos, simulations, and modular explanations — no heavy theory required.",
            ],
            [
              "Meet the SPS Team",
              "Interact with the IEEE SPS student team, learn how projects are built, and understand how SPS operates as a technical community.",
            ],
            [
              "Open Discussions & Q&A",
              "Ask questions about projects, research paths, competitions, hackathons, and how signal processing fits into industry and higher studies.",
            ],
          ].map(([title, desc], index) => (
            <div
              key={index}
              className="border-l-2 border-sky-500 pl-6 space-y-2"
            >
              <h3 className="text-sky-500 font-semibold text-base md:text-lg">
                {title}
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA SECTION */}
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
            March 13, 2026 • BMS Institute of Technology
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

/* ---------- SECTION TITLE COMPONENT ---------- */

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
