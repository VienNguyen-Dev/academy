import { db } from "@/lib/db";
import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Progress } from "../ui/progress";

interface CourseSidebarProps {
  course: Course & { sections: Section[] };
  studentId: string;
}

const CourseSideBar = async ({ course, studentId }: CourseSidebarProps) => {
  const publishedSections = await db.section.findMany({
    //tim ra cac section da duoc publish trong course
    where: {
      courseId: course.id,
      isPublished: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  const pusblishedSectionId = publishedSections.map((section) => section.id); //lay danh sach id cua cac section da duoc publish
  const purchase = await db.purchase.findUnique({
    where: {
      courseId_customerId: {
        courseId: course.id,
        customerId: studentId,
      },
    },
  });
  //dem cac section da hoan thanh
  const completedSections = await db.progress.count({
    where: {
      studentId,
      sectionId: {
        //loc ra cac sectionId da duoc publish
        in: pusblishedSectionId,
      },
      isCompleted: true,
    },
  });

  //tinh toan tien do hoan thanh khoa hoc
  const progressPecentage = (await (completedSections / pusblishedSectionId.length)) * 100;
  return (
    <div className=" hidden md:flex flex-col w-64 border-r shadow-md px-3 my-4 text-sm font-medium">
      <h1 className=" text-lg text-center font-bold mb-4 mt-2">{course.title}</h1>
      {purchase && (
        <div>
          <Progress value={progressPecentage} className="h-2" />
          <p className=" text-sm">{Math.round(progressPecentage)}% completed</p>
        </div>
      )}
      <Link key={course.id} href={`/courses/${course.id}/overview`} className=" rounded-lg p-3 hover:bg-[#FDAB04] mt-4">
        Overview
      </Link>
      {publishedSections.map((section) => (
        <Link href={`/courses/${course.id}/sections/${section.id}`} key={section.id} className=" rounded-lg mb-4 p-3 hover:bg-[#FDAB04]">
          {section.title}
        </Link>
      ))}
    </div>
  );
};

export default CourseSideBar;
