import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { Course } from "@prisma/client";
import { Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const CourseCard = async ({ course }: { course: Course }) => {
  const instructor = await clerkClient.users.getUser(course.instructorId); //tim userId
  //Sau khi tim duoc dung userId
  //=> tim level
  let level;

  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }
  return (
    <Link href={`/courses/${course.id}/overview`} className=" border rounded-lg">
      <Image src={course.imageUrl ? course.imageUrl : "/image/placeholder.webp"} className=" rounded-t-xl w-[320px] h-[180px] object-cover" width={500} height={300} alt={course.title} />
      <div className=" px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:text-[#FDAB04]">{course.title}</h2>
        <div className=" flex justify-between text-sm font-medium">
          {instructor && (
            <div className=" flex items-center gap-2">
              <Image
                src={instructor.imageUrl ? instructor.imageUrl : "/avatar_placeholder.jpg"}
                width={30}
                height={30}
                alt={instructor.fullName ? instructor.fullName : "Instructor photo"}
                className=" rounded-full"
              />
              <span>{instructor.fullName}</span>
            </div>
          )}
          {level && (
            <div className=" flex gap-2">
              <Gem size={20} />
              <p>{level.name}</p>
            </div>
          )}
        </div>
        <p className=" text-sm font-bold">${course.price}</p>
      </div>
    </Link>
  );
};

export default CourseCard;
