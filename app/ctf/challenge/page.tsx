"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Orbitron } from "next/font/google";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Lock, Activity } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "800"] });

interface Question {
  id: number;
  question: string;
  title: string;
  answer: string;
  order_index: number;
}

interface Team {
  id: string;
  name: string;
  score: number;
  q1_time?: number;
  q2_time?: number;
  q3_time?: number;
  total_time?: number;
  last_answered_at?: string;
}
const supabase = createClient(
  "https://wgtouvbajowqrdrmvcut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG91dmJham93cXJkcm12Y3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTg0MTUsImV4cCI6MjA4OTQ3NDQxNX0.lLPTRfi_sKe5uxPWBp_agIPCYroaAduV8LH67jPMrhY",
);

export default function QuizPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [current, setCurrent] = useState<number>(1);
  const [question, setQuestion] = useState<Question | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [showClueToast, setShowClueToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finishedAfterClose, setFinishedAfterClose] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [eventClosed, setEventClosed] = useState(false);
  const [closeMsg, setCloseMsg] = useState("");
  const [showContinuePopup, setShowContinuePopup] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [finishedBefore, setFinishedBefore] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentClue, setCurrentClue] = useState("");
  const [isHintsOpen, setIsHintsOpen] = useState(false);
  const [settingsData, setSettingsData] = useState<any>(null);
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);
  // useEffect(() => {
  //   if (currentClue && currentClue !== allHints[0]) {
  //     setAllHints((prev) => [currentClue, ...prev]);
  //   }
  // }, [currentClue]);
  const allHints = useMemo(() => {
    if (!settingsData || !current) return [];
    const clues = settingsData[`q${current}_clue` as keyof typeof settingsData];
    return Array.isArray(clues) ? [...clues].reverse() : [];
  }, [settingsData, current]);
  useEffect(() => {
    const init = async () => {
      setIsInitialLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!data.user) return router.push("/");
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("qst_asesr4fgd54w53r2436543435433356");
        localStorage.removeItem("qstart_3374rgewhgfdhgf84tyruir");
        localStorage.removeItem("fb");
        localStorage.removeItem("fb_fool");
      });

      setUser(data.user);
      const { data: settings } = await supabase
        .from("settings")
        .select("q1_clue, q2_clue, q3_clue")
        .single();
      if (settings) {
        setSettingsData(settings);
      }
      const { count } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true });
      const total = count || 0;
      setTotalQuestions(total);

      const { data: progress } = await supabase
        .from("progress")
        .select("current_question")
        .eq("user_id", data.user.id)
        .maybeSingle();
      const userIdx = progress?.current_question || 1;

   
      if (userIdx === 1) {
        localStorage.setItem("qst_asesr4fgd54w53r2436543435433356", Date.now().toString());
        localStorage.setItem("qstart_3374rgewhgfdhgf84tyruir", Date.now().toString());
      }

      if (userIdx > total && total > 0 && !eventClosed) {
        localStorage.setItem("fb", "true");
        setFinishedBefore(true);
      } else {
        setFinishedBefore(localStorage.getItem("fb") === "true");
      }

      setFinishedAfterClose(localStorage.getItem("fb_fool") === "true");
      await loadQuestion(data.user.id);
      await fetchLeaderboard();
      setIsInitialLoading(false);
    };
    init();
  }, [router]);
  //again well check user session before loading each question, so if they got logged out in the middle for some reason, they won't be able to fetch new questions
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/ctf/login");
      }
    };
    checkSession();
  }, [router, current]);

  const loadQuestion = async (userId: string) => {
    const { data: progress } = await supabase
      .from("progress")
      .select("current_question")
      .eq("user_id", userId)
      .maybeSingle();

    const nextIndex = progress?.current_question || 1;

   
    if (totalQuestions > 0 && nextIndex > totalQuestions) {
      setQuestion(null);
      setFinishedBefore(true);
      return;
    }

    const { data: qData } = await supabase
      .from("questions")
      .select("*")
      .eq("order_index", nextIndex)
      .single();

    setCurrentClue("");
    if (qData) {
      setQuestion(qData);
      setCurrent(qData.order_index);
    } else {
      setQuestion(null);
   
      if (nextIndex > 1) setFinishedBefore(true);
    }
  };
  const formatDuration = (ms?: number) => {
    if (!ms) return "--";
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };
  const fetchLeaderboard = async () => {
    const { data, error } = await supabase.from("progress").select(`
      user_id,
      score,
      q1_time,
      q2_time,
      q3_time,
      total_time,
      last_answered_at,
      users ( name )
    `);

    if (data) {
      console.log(data, "it is coming here");
      const formattedTeams = data.map((d: any) => ({
        id: d.user_id,
        name:
          d.user_id === user?.id
            ? "You"
            : d.users?.name || `Team ${d.user_id.slice(0, 4)}`,
        score: d.score || 0,
        q1_time: d.q1_time,
        q2_time: d.q2_time,
        q3_time: d.q3_time,
        total_time: d.total_time,
        last_answered_at: d.last_answered_at,
      }));

      setTeams(formattedTeams);
    }
  };
  const getProgressLabel = (team: Team) => {
    if (team.total_time) {
      return `Finished • ${formatDuration(team.total_time)}`;
    }

    if (team.q3_time) {
      return `Q3 • ${formatDuration(team.q3_time + team.q1_time! + team.q2_time!)}`;
    }

    if (team.q2_time) {
      return `Q2 • ${formatDuration(team.q2_time + team.q1_time!)}`;
    }

    if (team.q1_time) {
      return `Q1 • ${formatDuration(team.q1_time)}`;
    }

    return "Not started";
  };

  useEffect(() => {
    if (!user || eventClosed) return;
    const time = localStorage.getItem("quiz_end_time");
    if (time) {
      setFinishedAfterClose(true);

      return;
    }
  
    const channel = supabase
      .channel("leaderboard-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "progress",
        },
        (payload) => {
          console.log("Change detected!", payload);
          fetchLeaderboard(); 
        },
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });
    // setIsInitialLoading(false);
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, eventClosed]); 
  const { top10, userRank, userTeam } = useMemo(() => {
    const sorted = [...teams].sort((a, b) => {
     
      if (b.score !== a.score) return b.score - a.score;

   
      const timeA = a.last_answered_at
        ? new Date(a.last_answered_at).getTime()
        : Infinity;
      const timeB = b.last_answered_at
        ? new Date(b.last_answered_at).getTime()
        : Infinity;

      return timeA - timeB; 
    });

    const rankIndex = sorted.findIndex((t) => t.id === user?.id);
    return {
      top10: sorted.slice(0, 10),
      userRank: rankIndex !== -1 ? rankIndex + 1 : null,
      userTeam: sorted[rankIndex],
    };
  }, [teams, user]);
 
  const sessionId = useMemo(() => Math.random().toString(36).substring(7), []);

  useEffect(() => {
    if (!user) return;

    const sessionChannel = supabase
      .channel(`user-session-${user.id}`)
      .on("broadcast", { event: "new-login" }, (payload) => {
        if (payload.payload.sessionId !== sessionId) {
       
          alert(
            "You have been logged out because someone else logged in with your credentials.",
          );
          supabase.auth.signOut();
          router.push("/");
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          
          sessionChannel.send({
            type: "broadcast",
            event: "new-login",
            payload: { sessionId },
          });
        }
      });

    return () => {
      supabase.removeChannel(sessionChannel);
    };
  }, [user, sessionId]);

  const handleSubmit = async () => {
    if (!input.trim() || !question || !user) return;
    setLoading(true);

    try {
      const { data: q } = await supabase
        .from("questions")
        .select("correct_answer, order_index")
        .eq("id", question.id)
        .single();

      if (!q) throw new Error("Check failed");

      if (
        input.toLowerCase().trim() === q.correct_answer.toLowerCase().trim()
      ) {
        setStatus("correct");

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        const now = Date.now();

       
        const qStart = parseInt(
          localStorage.getItem("qstart_3374rgewhgfdhgf84tyruir") || now.toString(),
        );

        const timeTaken = now - qStart;

      
        const { data: p } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .single();

        const nextIdx = q.order_index + 1;
        const nowISO = new Date().toISOString();
        let updateData: any = {
          user_id: user.id,
          current_question: nextIdx,
          score: (p?.score || 0) + 1,
          completed_at: new Date().toISOString(),
          last_answered_at: nowISO,
        };

      
        if (q.order_index === 1) {
          updateData.q1_time = timeTaken;
        } else if (q.order_index === 2) {
          updateData.q2_time = timeTaken;
        } else if (q.order_index === 3) {
          updateData.q3_time = timeTaken;
        }

    
        if (q.order_index === 3) {
          const quizStart = parseInt(
            localStorage.getItem("qst_asesr4fgd54w53r2436543435433356") || now.toString(),
          );
          updateData.total_time = now - quizStart;
        }

        await supabase.from("progress").upsert(updateData, {
          onConflict: "user_id",
        });

        // 🔁 reset timer for next question
        localStorage.setItem("qstart_3374rgewhgfdhgf84tyruir", Date.now().toString());

     
        const { data: nextQ } = await supabase
          .from("questions")
          .select("*")
          .eq("order_index", nextIdx)
          .single();

        if (!nextQ && !eventClosed) {
          console.log("came here closed !");
          localStorage.setItem("fb", "true");
        }

        setInput("");
        await Promise.all([loadQuestion(user.id), fetchLeaderboard()]);
      } else {
        setStatus("wrong");
        setCooldown(10);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus("idle"), 1500);
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (data?.is_closed) {
        setEventClosed(true);
        setCloseMsg(data.message);
      }
    };
    checkStatus();

    const channel = supabase
      .channel("settings_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings" },
        (payload) => {
          if (payload.new.is_closed) {
            setEventClosed(true);
            setCloseMsg(payload.new.message);
            setShowContinuePopup(true);
          } else {
            setEventClosed(false);
            setShowContinuePopup(false);
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  useEffect(() => {
    const handleCopyPaste = (e: Event) => {
      e.preventDefault();
      alert("Copy and paste are disabled during the event! 🚫");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Attach listeners to the document
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      // Clean up when component unmounts
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  const currentRef = useRef(current);
  useEffect(() => {
    currentRef.current = current;
  }, [current]);
  useEffect(() => {
    if (!user) return;

    // Pre-load the audio so it's ready to go
    const notificationAudio = new Audio("/notification.mp3");

    const channel = supabase
      .channel("clue-instant-broadcast")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "settings" },
        (payload) => {
          const activeQuestion = currentRef.current;
          const columnKey = `q${activeQuestion}_clue`;
          const newHints = payload.new[columnKey] || [];

          setSettingsData((prev: any) => {
            const existingHints = prev?.[columnKey] || [];

            if (newHints.length > existingHints.length) {
              const latestHint = newHints[newHints.length - 1];
              setCurrentClue(latestHint);
              setShowClueToast(true);

              // Play the pre-loaded audio
              notificationAudio.play().catch((err) => {
                console.log(
                  "Macha, browser blocked the sound! Need user interaction first.",
                  err,
                );
              });

              setTimeout(() => setShowClueToast(false), 30000);
            }
            return payload.new;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // Added user and current as deps
  if (isInitialLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#05070b] space-y-4">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p
          className={`text-sky-400 font-bold animate-pulse ${orbitron.className}`}
        >
          FETCHING QUESTS...
        </p>
      </div>
    );
  }
  if (
    (!question && finishedAfterClose && !finishedBefore) ||
    (userRank! > 3 && !question)
  ) {
    return (
      <div className="h-screen w-full bg-[#05070b] text-white flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-10">
          <h1
            className={`text-4xl md:text-6xl font-black ${orbitron.className}`}
          >
            Virtual CTF
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            The event has concluded. Thank you for your participation and
            enthusiasm!
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-sky-500 hover:bg-sky-600 text-black font-bold px-10 py-5 rounded-xl text-base transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(14,165,233,0.4)] cursor-pointer"
          >
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }

  if (!question && eventClosed && !finishedBefore) {
    return (
      <div className="h-screen w-full bg-[#05070b] text-white flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-10">
          <h1
            className={`text-4xl md:text-6xl font-black ${orbitron.className}`}
          >
            Virtual CTF
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            The event has concluded. Thank you for your participation and
            enthusiasm!
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-sky-500 hover:bg-sky-600 text-black font-bold px-10 py-5 rounded-xl text-base transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(14,165,233,0.4)] cursor-pointer"
          >
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }
  if (!question && finishedBefore && userRank! <= 3) {
    return (
      <div className="h-screen w-full bg-[#05070b] text-white flex flex-col font-sans">
      
        <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-[60] bg-[#05070b]/80 backdrop-blur-md">
          <div
            className={`text-xl font-black tracking-tighter ${orbitron.className}`}
          >
            SP<span className="text-sky-500">AR</span>C
          </div>
        </nav>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start justify-center"
          >
        
            <div className="w-full md:w-1/2 space-y-8 text-center md:text-left md:sticky md:top-10">
              <Trophy className="w-16 h-16 md:w-20 md:h-20 text-yellow-500 mx-auto md:mx-0 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-bounce" />
              <div className="space-y-2">
                <h1
                  className={`text-3xl md:text-5xl font-black tracking-tighter ${orbitron.className}`}
                >
                  CHALLENGE{" "}
                  <span className="text-sky-500 text-5xl md:text-6xl block">
                    CONQUERED!
                  </span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg italic">
                  "The flags have been captured, the system is yours."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    Final Rank
                  </p>
                  <p className="text-xl md:text-2xl font-black text-sky-400">
                    #{userRank || "--"}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                    Total Time
                  </p>{" "}
                  {formatDuration(userTeam?.total_time)}
                </div>
              </div>

              <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-md mx-auto md:mx-0">
                Our team at{" "}
                <span className="text-sky-500 font-bold">SPARC</span> will
                verify your responses and reach out via your registered email
                shortly.
              </p>

              <Button
                onClick={() => router.push("/")}
                className="w-full md:w-auto bg-sky-600 hover:bg-sky-400 text-black font-black px-10 py-6 rounded-xl transition-all cursor-pointer"
              >
                BACK TO HOME
              </Button>
            </div>

           
            <div className="w-full md:w-1/2 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl mb-10">
              <div className="p-6 border-b border-white/10 bg-white/5">
                <h2
                  className={`text-xl font-black text-sky-500 ${orbitron.className}`}
                >
                  LIVE STANDINGS
                </h2>
                <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase">
                  Watch the competition
                </p>
              </div>
              <div className="p-4 space-y-3 max-h-[400px] md:max-h-[500px] overflow-y-auto custom-scrollbar">
                {top10.map((team, idx) => (
                  <motion.div
                    layout
                    key={team.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      team.id === user?.id
                        ? "bg-sky-500/20 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                        : "bg-white/5 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-black ${idx < 3 ? "text-sky-400" : "text-gray-600"}`}
                      >
                        #{idx + 1}
                      </span>
                      <span
                        className={`font-bold truncate max-w-[120px] md:max-w-none ${team.id === user?.id ? "text-white" : "text-gray-400"}`}
                      >
                        {team.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sky-500 font-mono font-black">
                        {team.score}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {getProgressLabel(team)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  if (eventClosed && finishedAfterClose) {
    return (
      <div className="h-screen w-full bg-[#05070b] text-white flex items-center justify-center px-6">
        <div className="max-w-2xl text-center space-y-10">
          <h1
            className={`text-4xl md:text-6xl font-black ${orbitron.className}`}
          >
            Virtual CTF
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            The event has concluded. Thank you for your participation and
            enthusiasm!
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-sky-500 hover:bg-sky-600 text-black font-bold px-10 py-5 rounded-xl text-base transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(14,165,233,0.4)] cursor-pointer"
          >
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-[#05070b] text-white flex flex-col relative font-sans overflow-x-hidden">
      <AnimatePresence>
        {showClueToast && currentClue && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md"
          >
            <div className="bg-sky-500 border-2 border-white/20 p-4 rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.5)] flex items-center gap-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
              <div className="bg-black/20 p-2 rounded-lg relative z-10">
                <Activity className="text-white animate-spin-slow" size={24} />
              </div>
              <div className="relative z-10 flex-1">
                <p className="text-[10px] font-black text-black/60 uppercase tracking-tighter">
                  New Intelligence Received
                </p>
                <p className="text-black font-bold leading-tight">
                  {currentClue}
                </p>
              </div>
              <button
                onClick={() => setShowClueToast(false)}
                className="relative z-10 text-black/40 hover:text-black cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-[60] bg-[#05070b]/80 backdrop-blur-md sticky top-0">
        <div
          className={`text-xl font-black tracking-tighter ${orbitron.className}`}
        >
          SP<span className="text-sky-500">AR</span>C
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsHintsOpen(true)}
            className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-yellow-400 cursor-pointer"
          >
            💡
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20 text-sky-400 cursor-pointer"
          >
            <Trophy size={20} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isHintsOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed right-0 top-0 h-full w-[85%] md:w-[350px] bg-black/95 backdrop-blur-3xl z-[150] p-6 border-l border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2
                className={`text-lg font-black text-yellow-500 ${orbitron.className}`}
              >
                HINTS LOG
              </h2>
              <X
                onClick={() => setIsHintsOpen(false)}
                className="cursor-pointer text-gray-500"
              />
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
              {allHints.length > 0 ? (
                allHints.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white/5 border-l-4 border-yellow-500 rounded-r-xl"
                  >
                    
                    <p className="text-xs text-gray-500 mb-1">
                      Hint {allHints.length - i}
                    </p>
                    <p className="text-sm font-bold text-white">{h}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center italic">
                  No hints yet,
                </p>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex flex-1 relative overflow-hidden">
        <main className="flex-1 flex flex-col items-center overflow-y-auto p-6 relative">
          <div className="w-full max-w-lg space-y-8 my-auto py-8">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <h1 className="text-2xl font-black italic text-gray-400">
                  QUEST <span className="text-white text-4xl">{current}</span>
                </h1>
                <span className="text-sky-500 font-mono text-sm tracking-widest">
                  {eventClosed ? "EVENT ENDED" : `RANK #${userRank || "--"}`}
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${(current / 4) * 100}%` }}
                  className={`h-full shadow-[0_0_15px] ${eventClosed ? "bg-gray-500 shadow-gray-500/50" : "bg-sky-500 shadow-sky-500"}`}
                />
              </div>
            </div>

            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="flex flex-col items-center gap-6">
                <div className="text-center w-full">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-sky-500 uppercase mb-2">
                    Active Challenge
                  </p>
                  <h2
                    className={`text-xl md:text-2xl font-black text-white leading-tight break-words ${orbitron.className}`}
                  >
                    {question?.title || "Loading..."}
                  </h2>
                </div>
                <Button
                  onClick={() => window.open(question?.question, "_blank")}
                  className="w-full h-14 md:h-20 bg-sky-600 hover:bg-sky-500 text-black font-black rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 px-4"
                >
                  <Trophy size={18} className="shrink-0" />
                  <span className="text-sm md:text-lg tracking-tight uppercase cursor-pointer">
                    VIEW QUESTION FILE
                  </span>
                </Button>
                <div className="w-full flex justify-between items-center text-[9px] text-gray-500 font-mono mt-2">
                  <span>REF_ID: {question?.id}</span>
                  <span className="flex items-center gap-1 text-green-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />{" "}
                    SECURE LINK
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading && cooldown === 0) {
                    handleSubmit();
                  }
                }}
                placeholder="Answer..."
                className={`w-full bg-white/5 border-2 rounded-xl px-5 py-4 outline-none transition-all duration-300 text-lg font-bold tracking-widest text-center ${status === "wrong" ? "border-red-600 animate-shake" : "border-white/10 focus:border-sky-500 shadow-inner"}`}
              />
              {status === "wrong" && (
                <p className="text-red-400 text-center font-bold">
                  WRONG ANSWER
                </p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={loading || cooldown > 0}
                className="w-full bg-sky-600 hover:bg-sky-400 text-black font-black py-7 rounded-xl transition-transform active:scale-95 cursor-pointer disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading
                  ? "VALIDATING..."
                  : cooldown > 0
                    ? `RETRY IN ${cooldown}s`
                    : eventClosed
                      ? "SUBMIT (PRACTICE)"
                      : "SUBMIT RESPONSE"}
              </Button>
            </div>
          </div>
        </main>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed md:relative top-0 right-0 h-full w-[85%] md:w-[350px] bg-black/90 md:bg-black/20 backdrop-blur-3xl border-l border-white/10 z-[100] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                <div>
                  <h2
                    className={`text-lg font-black text-sky-500 ${orbitron.className}`}
                  >
                    LEADERBOARD
                  </h2>
                  <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                    {eventClosed ? "Frozen Results" : "Live Sync Active"}
                  </p>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="md:hidden p-2 text-gray-500 hover:text-white cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 select-none relative">
                {eventClosed && (
                  <div className="sticky top-0 z-10 bg-red-500/10 border border-red-500/20 py-2 px-4 rounded-lg mb-4 text-center">
                    <p className="text-[10px] font-black text-red-500 tracking-widest uppercase">
                      EVENT ENDED - FINAL STANDINGS
                    </p>
                  </div>
                )}
                {top10.map((team, idx) => (
                  <motion.div
                    layout
                    key={team.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${eventClosed ? "opacity-60" : ""} ${team.id === user?.id ? "bg-sky-500/20 border-sky-500" : "bg-white/5 border-transparent"}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-black ${idx < 3 ? "text-sky-400" : "text-gray-600"}`}
                      >
                        #{idx + 1}
                      </span>
                      <span
                        className={`text-sm font-bold truncate max-w-[140px] ${team.id === user?.id ? "text-sky-400" : "text-gray-300"}`}
                      >
                        {team.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sky-500 font-mono font-black">
                        {team.score}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {getProgressLabel(team)}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {!eventClosed && userRank > 10 && (
                  <div className="pt-4 border-t border-white/10 sticky bottom-0 bg-[#05070b]/90 backdrop-blur-md p-2">
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-sky-500 bg-sky-500/10">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-sky-500">
                          #{userRank}
                        </span>
                        <span className="text-sm font-black text-white uppercase">
                          You
                        </span>
                      </div>
                      <span className="text-xs font-mono font-black text-sky-500">
                        {userTeam?.score}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.4);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
