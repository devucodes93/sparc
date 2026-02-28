import { NextResponse } from "next/server";
import { connectDb } from "@/app/lib/db";
import Register from "@/app/models/Register";
import cloudinary from "../../lib/cloudinary.js";
export async function POST(req: Request) {
  try {
    await connectDb();

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const contact = formData.get("contact") as string;
    const email = formData.get("email") as string;
    const ieeeId = formData.get("ieeeId") as string;
    const screenshotFile = formData.get("screenshot") as File | null;
    let uploadResponse;

    if (screenshotFile) {
      const buffer = Buffer.from(await screenshotFile.arrayBuffer());
      const base64 = buffer.toString("base64");

      const dataUrl = `data:${screenshotFile.type};base64,${base64}`;

      uploadResponse = await cloudinary.uploader.upload(dataUrl, {
        folder: "registrations",
      });
    }
    if (!uploadResponse) {
      return NextResponse.json(
        { success: false, message: "Screenshot upload failed" },
        { status: 400 },
      );
    }
    const user = await Register.create({
      name,
      contact,
      email,
      ieeeId,
      screenshot: uploadResponse?.secure_url,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDb();

    const users = await Register.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
