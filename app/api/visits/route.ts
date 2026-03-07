import Visits from "@/app/models/visits";
export async function PUT(req: Request) {
  try {
    Visits.findOneAndUpdate({ id: 1 }, { $inc: { count: 1 } });
  } catch (error) {
    console.error(error);
  }
}
