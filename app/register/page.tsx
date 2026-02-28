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

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    ieeeId: "",
    utr: "",
  });
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  /* ---------- VALIDATION ---------- */

  const emailValid =
    form.email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const contactValid = form.contact === "" || form.contact.length === 10;

  const isStep1Valid =
    form.name &&
    form.contact &&
    form.email &&
    form.ieeeId &&
    emailValid &&
    contactValid;

  const isStep3Valid = form.utr && screenshot;
  const isSubmitEnabled = screenshot && isStep1Valid && isStep3Valid;

  /* ---------- HANDLERS ---------- */

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleContactChange = (value: string) => {
    if (/^\d*$/.test(value) && value.length <= 10) {
      handleChange("contact", value);
    }
  };

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) return;
    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  /* ---------- SUBMIT ---------- */

  const handleSubmit = () => {
    if (!isSubmitEnabled) {
      alert("Please complete all fields and upload screenshot");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("utr", form.utr);
    formData.append("contact", form.contact);
    formData.append("email", form.email);
    formData.append("ieeeId", form.ieeeId);

    if (screenshot) formData.append("screenshot", screenshot);

    fetch("/api/register", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("registered", "true");
          router.push("/payment-success");
          setLoading(false);
        } else {
          alert(data.message || "Registration failed");
          setLoading(false);
        }
      })
      .catch(() => alert("Registration failed"));
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-[#05070b] text-white flex flex-col">
      {/* NAVBAR */}

      <nav className="fixed top-0 w-full z-50 bg-[#060b12]/70 backdrop-blur-xl border-b border-sky-900/40 py-4 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span
            className={`font-black text-xl cursor-pointer ${orbitron.className}`}
            onClick={() => router.push("/")}
          >
            SP<span className="text-sky-500">AR</span>C
          </span>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 flex flex-col pt-32 pb-6 px-6 md:px-10">
        {/* loading UI */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-white text-lg">Submitting...</div>
          </div>
        )}

        <div className="w-full max-w-2xl mx-auto flex flex-col flex-1 justify-between">
          <div className="space-y-10">
            <h1
              className={`text-3xl md:text-5xl font-black text-center ${orbitron.className}`}
            >
              Registration
            </h1>

            {/* Progress */}
            <div className="w-full h-2 bg-[#060b12] rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
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

                {!contactValid && form.contact && (
                  <p className="text-red-400 text-xs">
                    Contact must be 10 digits
                  </p>
                )}

                <InputField
                  label="Email ID"
                  value={form.email}
                  onChange={(v) => handleChange("email", v)}
                />

                {!emailValid && form.email && (
                  <p className="text-red-400 text-xs">Enter valid email</p>
                )}

                <InputField
                  label="IEEE Membership ID"
                  value={form.ieeeId}
                  onChange={(v) => handleChange("ieeeId", v)}
                />
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5 text-center">
                <p className="text-sky-500 text-xs uppercase tracking-[0.35em]">
                  Scan & Pay
                </p>

                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <Image
                      src="/qr.jpg"
                      alt="QR"
                      width={220}
                      height={220}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Complete payment before uploading screenshot.
                </p>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <label className="text-sm text-gray-300 block">
                  Upload Payment Screenshot
                </label>

                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-400 file:bg-sky-600 file:border-0 file:px-4 file:py-2 file:rounded-lg file:text-white file:cursor-pointer hover:file:bg-sky-700 transition"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                />

                <InputField
                  label="UTR Number"
                  value={form.utr}
                  onChange={(v) => handleChange("utr", v)}
                />

                {screenshot && (
                  <p className="text-xs text-sky-500">✓ Screenshot selected</p>
                )}
              </div>
            )}
          </div>

          {/* FOOTER BUTTONS */}
          <div className="sticky bottom-0 bg-[#05070b]/80 backdrop-blur-md border-t border-sky-900/30 py-4 flex justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="border-sky-700 text-sky-400 hover:bg-sky-950"
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button
                className="bg-sky-600 hover:bg-sky-700 px-8"
                onClick={nextStep}
                disabled={step === 1 && !isStep1Valid}
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-sky-600 hover:bg-sky-700 px-8 font-bold"
                onClick={handleSubmit}
                disabled={!isSubmitEnabled}
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

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">{label}</label>

      <input
        className="w-full bg-[#060b12] border border-sky-900/40 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-sky-500 text-sm transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
