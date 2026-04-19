import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function POST(req: NextRequest) {
  try {
    const apiKey = req.headers.get("x-api-key");
    if (apiKey !== process.env.SYNC_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courses } = await req.json();

    if (!Array.isArray(courses)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await dbConnect();

    // Strategy: Upsert courses based on courseCode and courseType
    // This allows updating existing courses and adding new ones
    const operations = courses.map((course: any) => ({
      updateOne: {
        filter: { 
          courseCode: course.courseCode, 
          courseType: course.courseType || "Theory" 
        },
        update: { 
          $set: { 
            courseTitle: course.courseTitle,
            isActive: true 
          } 
        },
        upsert: true,
      },
    }));

    // Optionally: Mark all courses NOT in the incoming list as inactive?
    // For now, let's just update/insert what we received.

    const result = await Course.bulkWrite(operations);

    return NextResponse.json({ 
      success: true, 
      message: `${result.upsertedCount} courses added, ${result.modifiedCount} updated.` 
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
