import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Undauthorixed", { status: 401 });
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

    const lastSection = await db.section.findFirst({
      where: {
        courseId: courseId,
      },
      orderBy: { position: "desc" },
    });

    const newPosition = lastSection ? lastSection.position + 1 : 0;
    const { title } = await request.json();

    const newSection = await db.section.create({
      data: {
        title,
        courseId,
        position: newPosition,
      },
    });
    return NextResponse.json(newSection, { status: 201 });
  } catch (error) {
    console.log(["Sections_POST", error]);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
