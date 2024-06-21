import SectionDetails from "@/components/sections/SectionDetails";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Resource } from "@prisma/client";
import { redirect } from "next/navigation";

const SectionDetailPage = async ({ params }: { params: { courseId: string; sectionId: string } }) => {
  const { userId } = auth();
  const { courseId, sectionId } = params;

  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: courseId,
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

  const section = await db.section.findUnique({
    where: {
      id: sectionId,
      isPublished: true,
      courseId,
    },
  });

  if (!section) {
    return redirect(`/courses/${courseId}/overview`);
  }

  const purchase = await db.purchase.findUnique({
    where: {
      courseId_customerId: {
        courseId,
        customerId: userId,
      },
    },
  });

  let muxData = null;
  let resources: Resource[] = [];

  //kiem tra neu no khoa ho mien phi hoa neu no la mot khoa hoc da duoc mua roi
  if (section.isFree || purchase) {
    muxData = await db.muxData.findUnique({
      //muxData se duoc gan gia tri
      where: {
        sectionId,
      },
    });
  }

  //kiem tra ring neu khoa hoc da duoc mua

  if (purchase) {
    resources = await db.resource.findMany({
      where: {
        sectionId,
      },
    });
  }

  const progress = await db.progress.findUnique({
    where: {
      studentId_sectionId: {
        studentId: userId,
        sectionId,
      },
    },
  });
  return <SectionDetails course={course} section={section} purchase={purchase} muxData={muxData} resources={resources} progress={progress} />;
};

export default SectionDetailPage;
