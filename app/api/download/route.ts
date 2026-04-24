import { NextRequest, NextResponse } from "next/server";
import { generateStudentCard } from "@/lib/card-generator";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const name = searchParams.get("name");

    if (!studentId || !name) {
      return NextResponse.json({ error: "Missing studentId or name" }, { status: 400 });
    }

    console.log(`Generating card for ${name} (${studentId}) on demand...`);
    const cardBuffer = await generateStudentCard(name, studentId);

    return new NextResponse(Buffer.from(cardBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Attendance_Card_${studentId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Card generation error:", error);
    return NextResponse.json({ error: "Failed to generate card" }, { status: 500 });
  }
}
