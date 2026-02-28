"use client";

import { useState, useEffect } from "react";
import { Menu, X, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Orbitron } from "next/font/google";
import { useRouter } from "next/navigation";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

export default function ProfessionalEventPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };
  const onButtonClick = (id: number) => {
    if (id === 1) {
      router.push("/open-day");
    } else if (id === 2) {
      router.push("/deep-sky-camp");
    } else if (id === 3) {
      router.push("/virtual-ctf");
    } else {
      console.warn("Invalid id");
    }
  };
  const registrationDays = [
    {
      id: 1,
      title: "IEEE Open Day",
      subtitle: "",
      points: [
        "SPS Society Project Demo",
        "Venue: BMS Institute of Technology",
        "Date: 13th March",
      ],
    },
    {
      id: 2,
      title: "Deep Sky Observation Camp",
      subtitle: "",
      points: [
        "Date: 14th to 15th March",
        "Overnight camp stay at Sri Krishna Goshala, Sathaghatta",
      ],
    },
    {
      id: 3,
      title: "Virtual CTF Based Challenge",
      subtitle: "",
      points: ["Prize Pool: ₹20,000", "Date: 7th March"],
    },
  ];
  return (
    <div className="min-h-screen bg-[#05070b] text-white overflow-x-hidden selection:bg-sky-500/20">
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-xl ${
          scrolled
            ? "bg-[#060b12]/70 border-b border-sky-900/40 h-20 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            : "bg-[#05070b]/40 h-20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 h-full flex justify-between items-center">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer h-full"
            onClick={() => scrollToSection("home")}
          >
            <div className="flex items-center h-full">
              <img
                src="/spslogo.png"
                alt="SPS Logo"
                className="max-h-14 md:max-h-14 lg:max-h-14 w-auto object-contain scale-110"
              />
            </div>

            <span
              className={`text-2xl font-black tracking-tighter ${orbitron.className}`}
            >
              SP<span className="text-sky-500">AR</span>C
            </span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-10">
            {["home", "about", "register"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-[12px] font-bold uppercase tracking-[0.3em] hover:text-sky-400 transition-colors cursor-pointer"
              >
                {item}
              </button>
            ))}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#060b12]/90 backdrop-blur-xl border-l border-sky-900/30 transform transition-transform duration-500 z-40 md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col mt-24 space-y-8 px-8">
          {["home", "about", "register"].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="text-sm font-bold uppercase tracking-widest text-white hover:text-sky-400 transition-colors text-left"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden border-b border-sky-950 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/90 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-900/15 via-black/70 to-black z-0" />

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 border border-sky-900 bg-sky-900/10 mb-8">
            <Calendar className="w-3 h-3 text-sky-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">
              Engineering the Future of Intelligence
            </span>
          </div>

          <h1
            className={`text-7xl md:text-9xl font-black leading-none mb-6 ${orbitron.className} tracking-tighter`}
          >
            SP
            <span className="text-sky-500 drop-shadow-[0_0_30px_rgba(14,165,233,0.5)]">
              AR
            </span>
            C
          </h1>

          <p className="max-w-m mx-auto text-gray-400 text-lg md:text-xl font-light tracking-wide mb-12 uppercase italic">
            Signal Processing, AI & Real Time Computing Camp
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection("register")}
              className="bg-sky-600 hover:bg-sky-700 text-white rounded-none px-12 py-8 text-sm font-black tracking-widest transition-all cursor-pointer"
            >
              REGISTER NOW
            </Button>

            <Button
              onClick={() => scrollToSection("about")}
              variant="outline"
              className="border-white/10 hover:border-sky-500 rounded-none px-12 py-8 text-sm font-black tracking-widest transition-all cursor-pointer"
            >
              About
            </Button>
          </div>
        </div>
      </section>
      {/* ORGANISER SECTION */}
      <section className="py-10 px-8 bg-[#05070b] border-t border-sky-950">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-sky-500">
              Organised By
            </p>
            <div className="flex flex-row justify-center items-center gap-8 md:gap-12">
              <img
                src="/SPS Bangalore Chapter.png"
                alt=""
                className="w-36 md:w-44 object-contain"
              />
              <img
                src="/Bangalore-Section-Logo.png"
                alt=""
                className="w-36 md:w-44 object-contain"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              In association with
            </p>
            <div className="flex justify-center">
              <img
                src="/sps-bmsit.png"
                alt=""
                className="w-36 md:w-44 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-8 ">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className={`text-4xl font-bold ${orbitron.className}`}>
              About <span className="text-sky-500">SPARC</span>
            </h2>

            <div className="w-20 h-1 bg-sky-500" />

            <p className="text-gray-400 leading-relaxed text-lg italic font-serif">
              “S.P.A.R.C. – Signal Processing, AI & Real-time Computing Camp”
            </p>
          </div>

          <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
            <p>
              is a structured 3-Day Immersive Bootcamp on Signal Processing.
              This is a blend of foundation Signal Processing, Machine Learning,
              Project Based Learning and Technical Competitions.
            </p>

            <p>
              This Bootcamp, is designed for Engineering Students, to move from
              the tradition core theory to practical innovation.
            </p>
          </div>
        </div>
      </section>

      {/* REGISTRATION SECTION */}
      <section id="register" className="py-32 px-8 border-t border-sky-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className={`text-5xl font-black ${orbitron.className}`}>
              Register <span className="text-sky-500">Now</span>
            </h2>

            <p className="text-gray-500 uppercase tracking-widest text-xs">
              Select your session for registration
            </p>
          </div>

          {/* Event Data */}
          {/*
      This makes the cards dynamic & clean
    */}
          {(() => {
            const events = [
              {
                id: 1,
                title: "IEEE Open Day",
                points: [
                  "SPS Society Project Demo",
                  "Venue: BMS Institute of Technology",
                  "Date: 13th March",
                ],
              },
              {
                id: 2,
                title: "Deep Sky Observation Camp",
                points: [
                  "Date: 14th to 15th March",
                  "Overnight camp stay at Sri Krishna Goshala, Sathaghatta",
                ],
              },
              {
                id: 3,
                title: "Virtual CTF Based Challenge",
                points: ["Prize Pool: ₹20,000", "Date: 7th March"],
              },
            ];

            return (
              <div className="grid md:grid-cols-3 gap-8">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onButtonClick(event.id)}
                    className="group relative bg-[#0a1018] border border-sky-950 p-10 hover:border-sky-500/50 transition-all duration-500 overflow-hidden cursor-pointer"
                  >
                    <p
                      className={`text-3xl font-bold mb-8 ${orbitron.className} group-hover:text-sky-400 transition-colors`}
                    >
                      {event.title}
                    </p>

                    <ul className="space-y-4 mb-12 text-gray-400 text-sm font-medium">
                      {event.points.map((point, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ChevronRight size={14} className="text-sky-500" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <Button className="w-full bg-transparent border border-white/10 group-hover:bg-sky-600 group-hover:border-sky-600 text-white rounded-none py-6 transition-all font-black text-[12px] tracking-widest cursor-pointer">
                      Click for more details
                    </Button>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

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
            <p className="text-white font-bold">Contact</p>
            <p>sparc@bmsit.in</p>
            <p>bangalore-sps@ieee.org</p>
            <p>Suraj: +91 96061 82802</p>

            <p className="mt-6 text-sky-500 font-black tracking-tighter">
              EXCELLENCE THROUGH INNOVATION
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
