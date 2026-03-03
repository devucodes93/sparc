import { NextResponse } from "next/server";
import { connectDb } from "@/app/lib/db";
import Register from "@/app/models/Register";
export async function GET() {
  try {
    await connectDb();
    const totalCount = await Register.countDocuments();

    return NextResponse.json({
      success: true,
      data: 40,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
