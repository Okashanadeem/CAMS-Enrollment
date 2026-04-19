import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Basic validation
    if (!data.studentId || !data.name || !data.email || !data.enrolledCourses || data.enrolledCourses.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // Check for existing registration
    const existing = await Registration.findOne({ studentId: data.studentId.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Student already registered" }, { status: 409 });
    }

    const registration = await Registration.create({
      ...data,
      studentId: data.studentId.toUpperCase(),
    });

    return NextResponse.json({ success: true, registrationId: registration._id });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return NextResponse.json({ error: "Student already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
