import CourseCard from "@/components/courses/CourseCard";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const LearningPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const purchasedCourse = await db.purchase.findMany({
    where: {
      customerId: userId,
    },
    select: {
      course: {
        include: {
          category: true,
          subCategory: true,
          sections: {
            where: {
              isPublished: true,
            },
          },
        },
      },
    },
  });
  return (
    <div className=" px-4 py-6 md:mt-5 md:px-10 lg:px-16">
      <h1 className=" text-xl font-bold">Your Courses</h1>
      <div className=" flex flex-wrap gap-7">
        {purchasedCourse.map((purcharse) => (
          <CourseCard key={purcharse.course.id} course={purcharse.course} />
        ))}
      </div>
    </div>
  );
};

export default LearningPage;
