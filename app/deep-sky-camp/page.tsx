"use client";

import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

export default function DeepSkyCampPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#05070b] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-xl px-6 py-2 border-b border-white/5`}
      >
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-17">
          {/* LOGO SECTION */}
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

          {/* RIGHT SIDE TEXT */}
          <span className="text-xs md:text-sm text-gray-400 font-medium uppercase tracking-[0.2em]">
            Deep Sky Camp
          </span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 md:pt-36 pb-20 px-6 md:px-10 max-w-6xl mx-auto space-y-10 md:space-y-8">
        {/* HERO */}
        <section className="text-center space-y-6 border-b border-sky-900/30 pb-10 md:pb-14">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-sky-500 font-semibold">
            SPARC 2026 Astronomy Series
          </p>

          <h1
            className={`text-3xl sm:text-4xl md:text-6xl font-black leading-tight ${orbitron.className}`}
          >
            Deep Sky Observation Camp
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed">
            A two-day immersive astronomy experience featuring deep sky
            observations, radio astronomy exposure, constellation tracking, and
            astrophotography fundamentals.
          </p>

          <p className="text-sky-500 uppercase tracking-widest text-xs md:text-sm">
            March 14 – 15, 2026
          </p>
        </section>

        {/* DAY 1 */}
        <SectionTitle title="March 14th 2026" orbitron={orbitron.className} />

        <Timeline
          items={[
            [
              "2:00 PM",
              "Assembly at BMS Institute of Technology and Management, Yelahanka",
            ],
            ["3:00 PM", "Pickup at Gorguntepalya Metro Station"],
            ["5:00 PM", "Arrival at campsite and orientation"],
          ]}
        />

        {/* EVENING */}
        <SectionTitle title="Evening Schedule" orbitron={orbitron.className} />

        <Timeline
          items={[
            ["5:15 PM", "Solar observation session"],
            ["5:30 PM", "Refreshments"],
            ["5:45 PM", "Tent pitching and campsite briefing"],
            ["6:15 PM", "Lecture on Radio Astronomy and Signal Processing"],
            ["7:30 PM", "Lecture on Visual & Amateur Astronomy"],
            ["9:00 PM", "Dinner"],
            [
              "9:30 PM",
              "Star charts session, dark adaptation training & light discipline",
            ],
            ["10:00 PM", "Lights off"],
          ]}
        />

        {/* NIGHT OBSERVATION */}
        <SectionTitle
          title="Night Observation Session (10:00 PM – 2:00 AM)"
          orbitron={orbitron.className}
        />

        <div className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:p-10 space-y-4 shadow-[0_0_40px_rgba(14,165,233,0.05)]">
          {[
            "Planetary observation",
            "Naked eye observation",
            "Star hopping techniques",
            "Constellation identification",
            "Deep sky observations including nebulae, open clusters, globular clusters and binary stars",
          ].map((item, index) => (
            <p
              key={index}
              className="text-gray-400 border-l-2 border-sky-500 pl-4 text-sm md:text-base"
            >
              {item}
            </p>
          ))}
        </div>

        {/* DAY 2 */}
        <SectionTitle title="March 15th 2026" orbitron={orbitron.className} />

        <Timeline
          items={[
            ["7:00 AM", "Hike and birding at Hikkal Betta"],
            ["8:30 AM", "Breakfast"],
            ["9:00 AM", "Departure from campsite"],
            ["10:30 AM", "Visit to Jayamangali Blackbuck Reserve (optional)"],
            ["12:00 PM", "Lunch"],
            ["12:30 PM", "Visit to Gauribidanur Radio Observatory"],
            ["2:00 PM", "Departure to Bangalore"],
            ["3:30 PM", "Drop at BMSIT Yelahanka"],
            ["4:30 PM", "Drop at Gorguntepalya Metro Station"],
          ]}
        />

        {/* CTA SECTION */}
        <section className="text-center bg-gradient-to-br from-sky-900/10 to-transparent border border-sky-900/40 rounded-2xl px-6 py-10 md:px-14 md:py-16 space-y-6">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-black ${orbitron.className}`}
          >
            Secure Your Spot
          </h2>

          <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Limited seats available for this exclusive astronomy experience.
            Register now to be part of an unforgettable deep sky exploration.
          </p>

          <div className="pt-4 flex flex-col sm:flex-col items-center justify-center gap-4">
            <Button
              onClick={() => router.push("/register")}
              className="
        w-full sm:w-auto
        bg-sky-600 hover:bg-sky-700
        text-white
        px-6 sm:px-10
        py-4
        rounded-lg
        font-bold
        tracking-wide sm:tracking-widest
        text-sm sm:text-base
        transition-all duration-300
        hover:scale-[1.02]
        cursor-pointer
      "
            >
              REGISTER FOR DEEP SKY CAMP
            </Button>

            {/* link to download conscent form*/}
            <a
              href="/consent-form.pdf"
              target="_blank"
              className="ml-4 text-sm text-gray-400 underline"
            >
              Download Consent Form
            </a>
          </div>
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

function Timeline({ items }: { items: [string, string][] }) {
  return (
    <div className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:p-10 shadow-[0_0_40px_rgba(14,165,233,0.05)] space-y-6">
      {items.map(([time, text], index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:gap-6 items-start border-l-2 border-sky-900 pl-6 relative"
        >
          <div className="absolute -left-[7px] top-2 w-3 h-3 bg-sky-500 rounded-full" />

          <span className="text-sky-500 font-semibold text-sm min-w-[90px]">
            {time}
          </span>

          <span className="text-gray-400 text-sm md:text-base mt-1 sm:mt-0">
            {text}
          </span>
        </div>
      ))}
    </div>
  );
}
