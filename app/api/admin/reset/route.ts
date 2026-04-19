import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import Registration from '@/models/Registration';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
    }

    await dbConnect();

    // Perform Hard Reset (Delete everything)
    const coursesResult = await Course.deleteMany({});
    const registrationsResult = await Registration.deleteMany({});

    return NextResponse.json({ 
      success: true, 
      message: "CAMS Form data reset successful.",
      details: {
        coursesDeleted: coursesResult.deletedCount,
        registrationsDeleted: registrationsResult.deletedCount
      }
    });

  } catch (error: any) {
    console.error("Reset Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
