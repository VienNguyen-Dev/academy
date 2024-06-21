import ReadText from "@/components/custom/ReadText";
import SectionMenu from "@/components/layout/SectionMenu";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const CourseOverview = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      sections: {
        where: {
          isPublished: true,
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

  const instructor = await clerkClient.users.getUser(course.instructorId); //luu id cua nguoi dung vao bien instructor

  let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }
  return (
    <div className=" px-4 py-6 flex flex-col gap-5 text-sm">
      <div className=" flex justify-between">
        <h1 className=" text-2xl font-bold ">{course.title}</h1>
        <SectionMenu course={course} />
      </div>
      <p className="font-medium">{course.subtitle}</p>
      <div className="flex gap-2 items-center">
        <Image
          src={instructor.imageUrl ? instructor.imageUrl : "/avatar_placeholder.jpg"}
          width={30}
          height={30}
          alt={instructor.fullName ? instructor.fullName : "Instructor photo"}
          className=" rounded-full"
        />
        <p className=" font-bold">Instructor:</p>
        <p>{instructor.fullName}</p>
      </div>
      <div className=" flex gap-2">
        <p className=" font-bold">Price:</p>
        <p>${course.price}</p>
      </div>
      <div className=" flex gap-2">
        <p className=" font-bold">Level:</p>
        <p>{level?.name}</p>
      </div>
      <div className=" flex flex-col gap-2">
        <p className=" font-bold">Description:</p>
        <p>
          <ReadText value={course.description!} />
        </p>
      </div>
    </div>
  );
};

export default CourseOverview;
