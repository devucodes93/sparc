import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  "https://wgtouvbajowqrdrmvcut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG91dmJham93cXJkcm12Y3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzg5ODQxNSwiZXhwIjoyMDg5NDc0NDE1fQ.Pi8KIKAIm1PEgQeqTejtkbIG5wdbNyNp3nOMApItsq0",
);

const users = [
  {
    email: "24ug1byec017@bmsit.in",
    password: "9632030825",
    team_name: "Pranathi",
  },
  {
    email: "24ug1byec167@bmsit.in",
    password: "9606802529",
    team_name: "Mohit",
  },
  {
    email: "24ug1byec164@bmsit.in",
    password: "9741305109",
    team_name: "Abhay",
  },
  {
    email: "padfoot176@gmail.com",
    password: "6364744793",
    team_name: "Keerthana",
  },
  {
    email: "24ug1byec014@bmsit.in",
    password: "9535679319",
    team_name: "Abhita",
  },
  {
    email: "bsuraj.1006@gmail.com",
    password: "9606182802",
    team_name: "Team Sooooor",
  },
];

async function seed() {
  for (const u of users) {
    console.log(`Creating: ${u.team_name}`);

    // 1. Create Auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        team_name: u.team_name, // 🔥 goes to your trigger
      },
    });

    if (error) {
      console.error("Auth error:", error.message);
      continue;
    }

    const userId = data.user.id;

    // 2. Create progress row
    const { error: progressError } = await supabase.from("progress").insert({
      user_id: userId,
      current_question: 1,
      score: 0,
      is_active: false,
    });

    if (progressError) {
      console.error("Progress error:", progressError.message);
    }
  }

  console.log("✅ Seeding done");
}

seed();
