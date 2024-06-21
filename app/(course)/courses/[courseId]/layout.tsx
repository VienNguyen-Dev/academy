import CourseSideBar from "@/components/layout/CourseSideBar";
import TopBar from "@/components/layout/TopBar";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const CourseDetailsLayout = async ({ children, params }: { children: React.ReactNode; params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const { courseId } = params;
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
  return (
    <div className=" flex h-full flex-col">
      <TopBar />
      <div className=" flex flex-1">
        <CourseSideBar course={course} studentId={userId} />
        <div className=" flex-1">{children}</div>
      </div>
    </div>
  );
};

export default CourseDetailsLayout;
