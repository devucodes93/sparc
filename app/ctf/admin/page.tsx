"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { Orbitron } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  Users,
  Activity,
  Lock,
  Unlock,
  Trophy,
  Search,
  Clock,
} from "lucide-react";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"] });

const supabase = createClient(
  "https://wgtouvbajowqrdrmvcut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG91dmJham93cXJkcm12Y3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTg0MTUsImV4cCI6MjA4OTQ3NDQxNX0.lLPTRfi_sKe5uxPWBp_agIPCYroaAduV8LH67jPMrhY",
);

export default function AdminPanel() {
  const [clues, setClues] = useState({ q1: "", q2: "", q3: "" });
  const [isAuth, setIsAuth] = useState(false);
  const [creds, setCreds] = useState({ user: "", pass: "" });
  const [isClosed, setIsClosed] = useState(false);
  const [msg, setMsg] = useState("");
  const [participants, setParticipants] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const handleLogin = () => {
    if (creds.user === "sparc@admin" && creds.pass === "sparc2026") {
      setIsAuth(true);
    } else {
      alert("Wrong credentials! Don't try to hack the admin");
    }
  };

  const fetchData = async () => {
    const { data: sett } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (sett) {
      setIsClosed(sett.is_closed);
      setMsg(sett.message);
      // Loading existing clues from DB
      setClues({
        q1: sett.q1_clue || "",
        q2: sett.q2_clue || "",
        q3: sett.q3_clue || "",
      });
    }
    const { data: prog } = await supabase
      .from("progress")
      .select(`*, users(name)`);
    if (prog) setParticipants(prog);
  };
  const updateClue = async (qNumber: string, value: string) => {
    const column = `q${qNumber}_clue`;
    await supabase
      .from("settings")
      .update({ [column]: value })
      .eq("id", 1);
    setClues((prev) => ({ ...prev, [`q${qNumber}`]: value }));
  };
  useEffect(() => {
    if (!isAuth) return;
    fetchData();

    // Realtime subscription to keep monitoring "Live"
    const channel = supabase
      .channel("live-monitor")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "progress" },
        () => fetchData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuth]);

  // Ranking Logic: High Score first, then fastest total time
  const rankedData = useMemo(() => {
    return [...participants]
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (
          new Date(a.last_answered_at).getTime() -
          new Date(b.last_answered_at).getTime()
        );
      })
      .filter((p) =>
        (p.users?.name || "").toLowerCase().includes(search.toLowerCase()),
      );
  }, [participants, search]);

  const toggleEvent = async () => {
    const newStatus = !isClosed;
    await supabase
      .from("settings")
      .update({ is_closed: newStatus, message: msg })
      .eq("id", 1);
    setIsClosed(newStatus);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "--";

    // Convert the UTC string from Supabase to Indian Standard Time
    return new Date(timeStr).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  if (!isAuth)
    return (
      <div className="h-screen bg-[#05070b] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm space-y-6 border border-white/10 p-8 rounded-3xl bg-white/5 backdrop-blur-md">
          <ShieldAlert className="mx-auto text-sky-500 w-12 h-12" />
          <h1
            className={`text-center text-xl font-black ${orbitron.className}`}
          >
            ADMIN PANEL
          </h1>
          <Input
            placeholder="Username"
            className="bg-black/50 border-white/10"
            onChange={(e) => setCreds({ ...creds, user: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            className="bg-black/50 border-white/10"
            onChange={(e) => setCreds({ ...creds, pass: e.target.value })}
          />
          <Button
            onClick={handleLogin}
            className="w-full bg-sky-600 hover:bg-sky-500 text-black font-bold uppercase tracking-widest"
          >
            Access Terminal
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#05070b] text-white font-sans selection:bg-sky-500/30">
      <nav className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className={`text-xl font-black ${orbitron.className}`}>
          SPARC <span className="text-sky-500">MONITOR</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest">
              Live Feed Active
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAuth(false)}
            className="text-gray-500 hover:text-white"
          >
            LOGOUT
          </Button>
        </div>
      </nav>

      <main className="p-6 md:p-12 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Users size={20} />}
            label="Total Players"
            value={participants.length}
            color="text-sky-400"
          />
          <StatCard
            icon={<Trophy size={20} />}
            label="Top Score"
            value={Math.max(...participants.map((p) => p.score), 0)}
            color="text-yellow-500"
          />
          <StatCard
            icon={<Activity size={20} />}
            label="Status"
            value={isClosed ? "CLOSED" : "ACTIVE"}
            color={isClosed ? "text-red-500" : "text-green-500"}
          />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
            <div>
              <h3 className={`text-lg font-bold ${orbitron.className}`}>
                EVENT CONTROL
              </h3>
              <p className="text-xs text-gray-500">
                Toggle event accessibility and broadcast messages
              </p>
            </div>
            <Button
              onClick={toggleEvent}
              className={`px-10 py-6 rounded-2xl font-black transition-all shadow-lg ${isClosed ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500"}`}
            >
              {isClosed ? (
                <Unlock className="mr-2" size={18} />
              ) : (
                <Lock className="mr-2" size={18} />
              )}
              {isClosed ? "OPEN EVENT" : "KILL EVENT"}
            </Button>
          </div>
          <Input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Enter broadcast message..."
            className="bg-black/40 border-white/10 py-6"
          />
        </div>
<div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
          <h3 className={`text-lg font-bold ${orbitron.className}`}>LEVEL-SPECIFIC CLUES</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Question {num} Clue</label>
                <div className="flex gap-2">
                  <Input 
                    value={clues[`q${num}` as keyof typeof clues]} 
                    onChange={(e) => setClues({...clues, [`q${num}`]: e.target.value})}
                    placeholder={`Hint for Q${num}...`} 
                    className="bg-black/40 border-white/10"
                  />
                  <Button 
                    onClick={() => updateClue(num.toString(), clues[`q${num}` as keyof typeof clues])}
                    className="bg-sky-600 hover:bg-sky-500 text-black px-3"
                  >
                    SEND
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className={`text-lg font-bold ${orbitron.className}`}>
              LIVE LEADERBOARD
            </h3>
            <div className="relative w-full md:w-80">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by name..."
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-sky-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                  <th className="p-5">Rank</th>
                  <th className="p-5">Participant</th>
                  <th className="p-5">Current Score</th>
                  <th className="p-5">Last Answered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rankedData.map((p, idx) => (
                  <tr
                    key={p.user_id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="p-5 font-black text-sky-500">#{idx + 1}</td>
                    <td className="p-5 font-bold">
                      {p.users?.name || "Unknown User"}
                    </td>
                    <td className="p-5">
                      <span className="bg-sky-500/10 text-sky-400 px-4 py-1 rounded-full text-xs font-bold border border-sky-500/20">
                        {p.score} Points
                      </span>
                    </td>
                    <td className="p-5 font-mono text-xs text-gray-500 flex items-center gap-2">
                      <Clock size={12} /> {formatTime(p.last_answered_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
      <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">
        {icon} {label}
      </div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
    </div>
  );
}
