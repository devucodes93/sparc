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
    const utr = formData.get("utr") as string;
    const memberType = formData.get("memberType") as string;
    const consentFile = formData.get("consentFile") as File | null;

    if (!screenshotFile || !consentFile) {
      return NextResponse.json(
        { success: false, message: "Files are required" },
        { status: 400 },
      );
    }

    // ---------- Upload Screenshot (Image Only) ----------
    const screenshotBuffer = Buffer.from(await screenshotFile.arrayBuffer());
    const screenshotBase64 = screenshotBuffer.toString("base64");

    const screenshotUpload = await cloudinary.uploader.upload(
      `data:${screenshotFile.type};base64,${screenshotBase64}`,
      {
        folder: "registrations",
        resource_type: "image",
      },
    );

    // ---------- Upload Consent (Image OR PDF) ----------
    const consentBuffer = Buffer.from(await consentFile.arrayBuffer());
    const consentBase64 = consentBuffer.toString("base64");

    const consentUpload = await cloudinary.uploader.upload(
      `data:${consentFile.type};base64,${consentBase64}`,
      {
        folder: "consent-forms",
        resource_type: "raw",
        use_filename: true,
        unique_filename: true,
      },
    );

    // ---------- Save to DB ----------
    const user = await Register.create({
      name,
      contact,
      email,
      ieeeId,
      screenshot: screenshotUpload.secure_url,
      utr,
      memberType,
      consentForm: consentUpload.secure_url,
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("POST error:", error);

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
