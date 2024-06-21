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
      include: {
        sections: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }
    const isPublishedSections = course.sections.some((section) => section.isPublished);
    if (!course.title || !course.description || !course.categoryId || !course.subCategoryId || !course.imageUrl || !course.levelId || !course.price || !isPublishedSections) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        instructorId: userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedCourse, { status: 200 });
  } catch (error) {
    console.log(["courseId_publish_POST", error]);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
