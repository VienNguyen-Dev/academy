import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, { params }: { params: { courseId: string; sectionId: string } }) => {
  try {
    const { isCompleted } = await request.json();
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId, sectionId } = params;
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    const progress = await db.progress.upsert({
      where: {
        studentId_sectionId: {
          studentId: userId,
          sectionId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        studentId: userId,
        sectionId,
        isCompleted,
      },
    });

    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    console.log("SectionId_Progress_POST", error);
    return new NextResponse("Interval Server Error", { status: 500 });
  }
};
