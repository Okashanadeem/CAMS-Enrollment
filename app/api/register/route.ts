import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import { generateStudentCard } from "@/lib/card-generator";
import { sendWelcomeEmail } from "@/lib/email-service";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const studentId = data.studentId?.toUpperCase();
    
    // Basic validation
    if (!studentId || !data.name || !data.email || !data.enrolledCourses || data.enrolledCourses.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // 1. Check for existing registration
    const existing = await Registration.findOne({ studentId });
    if (existing) {
      return NextResponse.json({ error: "This student ID is already registered in the CAMS system." }, { status: 409 });
    }

    // 2. Create the Registration record
    const registration = await Registration.create({
      ...data,
      studentId,
    });

    // Background process: Generate card and send email
    // We don't await this to avoid delaying the response to the user
    // However, for debugging purposes, you might want to await it or log errors
    (async () => {
      try {
        console.log(`Generating card for ${data.name} (${studentId})...`);
        const cardBuffer = await generateStudentCard(data.name, studentId);
        console.log(`Sending welcome email to ${data.email}...`);
        await sendWelcomeEmail(data.email, data.name, studentId, cardBuffer);
        console.log(`Welcome email sent successfully to ${data.email}`);
      } catch (err) {
        console.error("Error in background card/email process:", err);
      }
    })();

    return NextResponse.json({ success: true, registrationId: registration._id });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Student already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
