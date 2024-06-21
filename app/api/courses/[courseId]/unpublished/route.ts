import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    const unPublishedCourse = await db.course.update({
      where: {
        id: courseId,
        instructorId: userId,
      },
      data: {
        isPublished: false,
      },
    });
    return NextResponse.json(unPublishedCourse, { status: 200 });
  } catch (error) {
    console.log(["courseId_Unpublised_POST", error]);
    return new NextResponse("Interval server error", { status: 500 });
  }
};
