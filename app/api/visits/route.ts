import { connectDb } from "@/app/lib/db";
import Visits from "@/app/models/visits";

export async function PUT(req: Request) {
  connectDb();
  try {
    await Visits.findOneAndUpdate(
      {}, // find any document
      { $inc: { count: 1 } },
      { upsert: true }, // create if not exists
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false });
  }
}
