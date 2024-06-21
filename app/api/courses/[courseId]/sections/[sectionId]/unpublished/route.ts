import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest, { params }: { params: { courseId: string; sectionId: string } }) => {
  try {
    const { userId } = auth();
    const { courseId, sectionId } = params;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
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

    const muxData = await db.muxData.findUnique({
      where: {
        sectionId,
      },
    });

    if (!section || !muxData || !section.title || !section.description || !section.videoUrl) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const unPublishedSection = await db.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });
    //tim kiem ra nhung section da duoc publish
    const publishedSectionsInCourse = await db.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });
    //neu nhu trong trong tat ca cac section khong co cai nao duoc publish thi se update course voi data => isPublished = false
    if (publishedSectionsInCourse.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
          instructorId: userId,
        },
        data: {
          isPublished: false,
        },
      });
    }
    return NextResponse.json(unPublishedSection, { status: 200 });
  } catch (error) {
    console.log(["section_publish_POST", error]);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
