import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const student = await Student.findOne({ 
      studentId: id.toUpperCase(),
      isActive: true 
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Fetch student error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
