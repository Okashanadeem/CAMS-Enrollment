import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Registration from "@/models/Registration";
import Student from "@/models/Student";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const studentId = data.studentId?.toUpperCase();
    
    // Basic validation
    if (!studentId || !data.name || !data.email || !data.enrolledCourses || data.enrolledCourses.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // 1. Verify student exists in CAMS HQ (synced from local CAMS)
    const hqStudent = await Student.findOne({ studentId });
    if (!hqStudent) {
      return NextResponse.json({ 
        error: "Identity not found in CAMS Registry. Please ensure your ID is correct or contact admin." 
      }, { status: 404 });
    }

    // 2. Verify name matches registry (basic check)
    const registryName = (hqStudent.fullName || hqStudent.name || "").trim().toLowerCase();
    const providedName = data.name.trim().toLowerCase();
    
    if (providedName !== registryName) {
      return NextResponse.json({ 
        error: `Identity found, but name doesn't match our records. Did you mean: ${hqStudent.fullName || hqStudent.name}?` 
      }, { status: 400 });
    }

    // 3. Check for existing registration
    const existing = await Registration.findOne({ studentId });
    if (existing) {
      return NextResponse.json({ error: "This student ID has already completed the enrollment sync." }, { status: 409 });
    }

    const registration = await Registration.create({
      ...data,
      studentId,
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
