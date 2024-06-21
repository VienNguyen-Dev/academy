import AlertBanner from "@/components/custom/AlertBanner";
import EditSectionForm from "@/components/sections/EditSectionForm";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const SectionDetailsPage = async ({ params }: { params: { courseId: string; sectionId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      instructorId: userId,
    },
  });
  if (!course) {
    return redirect("/instructor/courses");
  }
  const section = await db.section.findUnique({
    where: {
      id: params.sectionId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
      resources: true,
    },
  });

  if (!section) {
    return redirect(`/instructor/courses/${params.courseId}/sections`);
  }
  const requiedFields = [section.title, section.description, section.videoUrl]; //tao mot mang gom ba doi tuong trong tao section

  const requiredFieldsCount = requiedFields.length; //so luong cac phan tu
  const missingCount = requiedFields.filter((field) => !Boolean(field)); //return falsy values: undefined, null, NaN,... tuc la se loc ra so luong cac field trong eidt section da dien du thong tin hay chua dien thong tin
  const missingFieldCount = missingCount.length; //dem cac truong chua dien thong tin

  const isCompleted = requiedFields.every(Boolean); //neu gia tri la truthly thi iscomPleted = true con nguoc lai se return iscompleted = false
  return (
    <div className="px-10">
      <AlertBanner isCompleted={isCompleted} missingFieldCount={missingFieldCount} requiredFieldsCount={requiredFieldsCount}/>
      <EditSectionForm section={section} courseId={params.courseId} isCompleted={isCompleted} />
    </div>
  );
};

export default SectionDetailsPage;
