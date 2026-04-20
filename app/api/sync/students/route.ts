import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Student from "@/models/Student";

export async function POST(req: NextRequest) {
  try {
    console.log("[Sync API] Received student sync request");
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.SYNC_API_KEY) {
      console.error("[Sync API] Unauthorized: Invalid API Key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { students } = await req.json();
    console.log(`[Sync API] Received ${students?.length} students`);
    if (students && students.length > 0) {
      console.log(`[Sync API] Sample student:`, JSON.stringify(students[0], null, 2));
    }

    if (!Array.isArray(students)) {
      console.error("[Sync API] Invalid data format: students is not an array");
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await dbConnect();
    console.log("[Sync API] Connected to database");

    // Strategy: Upsert students based on studentId
    const validStudents = students.filter((s: any) => s.studentId);
    console.log(`[Sync API] Processing ${validStudents.length} valid students`);

    const operations = validStudents.map((student: any) => {
      return {
        updateOne: {
          filter: { studentId: student.studentId.toUpperCase() },
          update: { 
            $set: { 
              fullName: student.fullName,
              email: student.email,
              phone: student.phone,
              isActive: true 
            } 
          },
          upsert: true,
        },
      };
    });

    console.log(`[Sync API] Executing bulkWrite for ${operations.length} operations`);
    const result = await Student.bulkWrite(operations);
    console.log(`[Sync API] Sync result:`, result);

    return NextResponse.json({ 
      success: true, 
      message: `${result.upsertedCount} students added, ${result.modifiedCount} updated.` 
    });
  } catch (error: any) {
    console.error("[Sync API] Student sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
