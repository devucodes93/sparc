import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  "https://wgtouvbajowqrdrmvcut.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndG91dmJham93cXJkcm12Y3V0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzg5ODQxNSwiZXhwIjoyMDg5NDc0NDE1fQ.Pi8KIKAIm1PEgQeqTejtkbIG5wdbNyNp3nOMApItsq0",
);

const workbook = XLSX.read(readFileSync("./filtered_team_leads.xlsx"));
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const users = rows
  .slice(1)
  .filter((row) => row[1])
  .map((row) => ({
    team_name: String(row[0]).trim(),
    email: String(row[1]).trim(),
    password: String(row[2]).trim(),
  }));

console.log(`Found ${users.length} users to seed`);

async function seed() {
  for (const u of users) {
    console.log(`Creating: ${u.team_name} (${u.email})`);

    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: {
        team_name: u.team_name,
      },
    });

    if (error) {
      console.error(`❌ Auth error for ${u.team_name}:`, error.message);
      continue;
    }

    console.log(`✅ Created: ${u.team_name}`);
  }

  console.log("✅ Seeding done");
}

seed();