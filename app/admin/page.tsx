"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

export default function AdminPage() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);

  const [cred, setCred] = useState({
    username: "",
    password: "",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  /* ---------- LOGIN ---------- */

  const handleLogin = () => {
    if (cred.username === "devendra" && cred.password === "devendra123") {
      setLoggedIn(true);
      fetchUsers();
    } else {
      alert("Invalid credentials");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/register");
    const data = await res.json();

    if (data.success) setUsers(data.data);
    setLoading(false);
  };

  /* ---------- LOGIN UI ---------- */

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#05070b] flex items-center justify-center text-white">
        <div className="w-full max-w-md bg-[#0a1018] border border-sky-900/40 p-8 rounded-2xl space-y-6">
          <h1 className="text-2xl font-bold text-center text-sky-500">
            Admin Login
          </h1>

          <input
            placeholder="Username"
            className="w-full bg-[#060b12] border border-sky-900/40 px-4 py-3 rounded-lg"
            onChange={(e) =>
              setCred((p) => ({ ...p, username: e.target.value }))
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#060b12] border border-sky-900/40 px-4 py-3 rounded-lg"
            onChange={(e) =>
              setCred((p) => ({ ...p, password: e.target.value }))
            }
          />

          <Button
            onClick={handleLogin}
            className="w-full bg-sky-600 hover:bg-sky-700 py-5"
          >
            Login
          </Button>
        </div>
      </div>
    );
  }

  /* ---------- DASHBOARD PAGE ---------- */

  return (
    <div className="min-h-screen bg-[#05070b] text-white overflow-x-hidden">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-[#060b12]/80 backdrop-blur-xl border-b border-sky-900/40 py-4 px-6 md:px-10 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span
            className={`font-bold text-lg md:text-xl ${orbitron.className}`}
          >
            SP<span className="text-sky-500">AR</span>C Admin
          </span>

          <span className="text-xs md:text-sm text-gray-400 uppercase tracking-widest">
            Dashboard
          </span>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-28 md:pt-36 pb-20 px-6 md:px-10 max-w-6xl mx-auto space-y-10">
        <SectionTitle title="Applications" orbitron={orbitron.className} />

        {/* Analytics Card */}
        <div className="bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 w-fit">
          <p className="text-gray-400 text-sm">Total Applications</p>
          <p className="text-4xl font-bold text-white">{users.length}</p>
        </div>

        <Button onClick={fetchUsers} className="bg-sky-600 hover:bg-sky-700">
          {loading ? "Refreshing..." : "Refresh List"}
        </Button>

        {/* Application List */}
        <div className="space-y-6">
          {users.map((user, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-start md:items-center bg-[#0a1018] border border-sky-900/40 rounded-xl p-6 md:h-[200px] hover:border-sky-500 transition gap-6"
            >
              <div className="space-y-2 text-sm text-gray-300 flex-1">
                <p className="font-semibold text-white text-lg">{user.name}</p>

                <p>Contact : {user.contact}</p>
                <p>Email : {user.email}</p>
                <p>IEEE ID : {user.ieeeId}</p>
              </div>

              {user.screenshot && (
                <div
                  className="relative cursor-pointer group w-full md:w-[220px] h-[140px]"
                  onClick={() => setSelectedImage(user.screenshot)}
                >
                  <Image
                    src={user.screenshot}
                    alt="payment"
                    fill
                    className="rounded-lg object-cover"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded-lg flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-white text-xs">
                      Click to zoom
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* IMAGE ZOOM MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            <Image
              src={selectedImage}
              alt="zoom"
              width={900}
              height={700}
              className="rounded-xl w-full object-contain"
            />

            <button
              className="absolute top-3 right-3 bg-red-500 px-3 py-1 rounded-lg text-sm"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#040608] py-20 px-8 border-t border-sky-950 mt-20">
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
      <h2 className={`text-xl md:text-3xl font-bold ${orbitron}`}>{title}</h2>
      <div className="w-14 md:w-16 h-1 bg-sky-500" />
    </div>
  );
}
