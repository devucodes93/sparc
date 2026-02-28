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
    let uploadResponse;
    let consentUploadResponse;
    if (screenshotFile) {
      const buffer = Buffer.from(await screenshotFile.arrayBuffer());
      const base64 = buffer.toString("base64");

      const dataUrl = `data:${screenshotFile.type};base64,${base64}`;

      uploadResponse = await cloudinary.uploader.upload(dataUrl, {
        folder: "registrations",
      });
    }
    if (consentFile) {
      const buffer = Buffer.from(await consentFile.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${consentFile.type};base64,${base64}`;
      consentUploadResponse = await cloudinary.uploader.upload(dataUrl, {
        folder: "consent-forms",
      });
    }

    if (!uploadResponse) {
      return NextResponse.json(
        { success: false, message: "Screenshot upload failed" },
        { status: 400 },
      );
    }

    if (!consentUploadResponse) {
      return NextResponse.json(
        { success: false, message: "Consent form upload failed" },
        { status: 400 },
      );
    }

    const user = await Register.create({
      name,
      contact,
      email,
      ieeeId,
      screenshot: uploadResponse?.secure_url,
      utr,
      memberType,
      consentForm: consentUploadResponse?.secure_url,
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
