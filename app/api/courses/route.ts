import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { title, categoryId, subCategoryId } = await request.json();

    const newCourse = await db.course.create({
      data: {
        title,
        categoryId,
        subCategoryId,
        instructorId: userId,
      },
    });
    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.log(["Course_CREATE", error]);
    return new NextResponse("Interval server error", { status: 500 });
  }
};
