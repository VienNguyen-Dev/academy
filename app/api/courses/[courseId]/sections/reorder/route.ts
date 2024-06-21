import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (request: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { list } = await request.json();
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    for (let item of list) {
      await db.section.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }
    return new NextResponse("Reorder Sections successfully", { status: 200 });
  } catch (error) {
    console.log(["reorder_PUT", error]);
    return new NextResponse("Internal Sever Error", { status: 500 });
  }
};
