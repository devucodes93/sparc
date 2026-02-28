"use client";

import { Orbitron } from "next/font/google";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700"] });

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [memberType, setMemberType] = useState<"" | "sps" | "non-sps">("");

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    ieeeId: "",
    utr: "",
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- VALIDATION ---------- */

  const emailValid =
    form.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const contactValid = form.contact.length === 0 || form.contact.length === 10;

  const step1Valid =
    form.name && form.contact && form.email && emailValid && contactValid;

  const step2Valid =
    memberType !== "" &&
    (memberType === "non-sps" || (memberType === "sps" && form.ieeeId));

  const step3Amount = memberType === "sps" ? 1000 : 2000;

  const step4Valid = screenshot && form.utr;

  const canNext =
    (step === 1 && step1Valid) || (step === 2 && step2Valid) || step === 3;

  const canSubmit = step === 4 && step4Valid;

  /* ---------- HANDLERS ---------- */

  const handleChange = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleContactChange = (v: string) => {
    if (/^\d*$/.test(v) && v.length <= 10) {
      handleChange("contact", v);
    }
  };

  const nextStep = () => {
    if (!canNext) return;
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  /* ---------- SUBMIT ---------- */

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (memberType === "non-sps") {
      form.ieeeId = "";
    }

    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    if (screenshot) formData.append("screenshot", screenshot);
    formData.append("memberType", memberType);

    fetch("/api/register", {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((data) => {
        setLoading(false);

        if (data.success) {
          localStorage.setItem("registered", "true");
          router.push("/payment-success");
        } else alert(data.message || "Registration failed");
      })
      .catch(() => {
        setLoading(false);

        alert("Registration failed");
        // setStep(1);
      });
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
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
        
        </div>
      </nav>

      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-50">
          Submitting...
        </div>
      )}

      <main className="flex-1 flex flex-col pt-32 pb-6 px-6 md:px-10">
        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 justify-between">
          <div className="space-y-10">
            <h1
              className={`text-3xl md:text-5xl font-black text-center ${orbitron.className}`}
            >
              Registration
            </h1>

            {/* Progress */}
            <div className="h-2 bg-[#060b12] rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <InputField
                  label="Full Name"
                  value={form.name}
                  onChange={(v) => handleChange("name", v)}
                />

                <InputField
                  label="Contact Number"
                  value={form.contact}
                  onChange={handleContactChange}
                />

                <InputField
                  label="Email ID"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                />

                {!emailValid && form.email && (
                  <p className="text-red-400 text-xs">Enter valid email</p>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6 text-center">
                <p className="text-sm text-gray-400">Are you an SPS member?</p>

                <div className="flex justify-center gap-6">
                  <Button
                    onClick={() => setMemberType("sps")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300    cursor-pointer
      ${
        memberType === "sps"
          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] scale-105"
          : "bg-[#0a1118] border border-sky-900/50 text-gray-300 hover:border-sky-500 hover:text-white hover:scale-105"
      }
    `}
                  >
                    SPS Member
                  </Button>

                  <Button
                    onClick={() => setMemberType("non-sps")}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300
                   
      ${
        memberType === "non-sps"
          ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] scale-105"
          : "bg-[#0a1118] border border-sky-900/50 text-gray-300 hover:border-sky-500 hover:text-white hover:scale-105 cursor-pointer"
      }
    `}
                  >
                    Non SPS Member
                  </Button>
                </div>

                {memberType === "sps" && (
                  <div className="space-y-4 pt-6">
                    <a
                      href="https://www.ieee.org/mv/"
                      target="_blank"
                      className="text-sky-400 text-sm underline block"
                    >
                      Check activity status of your membership here
                    </a>

                    <InputField
                      label="IEEE Membership ID"
                      value={form.ieeeId}
                      onChange={(v) => handleChange("ieeeId", v)}
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <p className="text-sky-500 text-xs uppercase tracking-widest">
                  Scan & Pay
                </p>

                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl">
                    <Image src="/qr.jpg" alt="QR" width={220} height={220} />
                  </div>
                </div>

                <p className="text-sm text-gray-400">
                  Amount :
                  <span className="text-sky-400 font-bold ml-2">
                    ₹{step3Amount}
                  </span>
                </p>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <label className="text-sm text-gray-300 block">
                  Upload Payment Screenshot
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-400 file:bg-sky-600 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-white file:cursor-pointer"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                />

                <InputField
                  label="UTR Number"
                  value={form.utr}
                  onChange={(v) => handleChange("utr", v)}
                />
              </div>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="sticky bottom-0 bg-[#05070b]/80 backdrop-blur-md border-t border-sky-900/30 py-4 flex justify-between ">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="cursor-pointer"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                className="bg-sky-600 hover:bg-sky-700 px-8 cursor-pointer"
                onClick={nextStep}
                disabled={!canNext}
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-sky-600 hover:bg-sky-700 px-8 font-bold"
                onClick={handleSubmit}
              >
                REGISTER NOW
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* INPUT COMPONENT */

function InputField({ label, value, onChange }: any) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-sm text-gray-300">{label}</label>

      <input
        className="w-full bg-[#060b12] border border-sky-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500 text-sm transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
