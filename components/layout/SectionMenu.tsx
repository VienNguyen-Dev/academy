import { Course, Section } from "@prisma/client";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";

const SectionMenu = ({ course }: { course: Course & { sections: Section[] } }) => {
  return (
    <div className="w-full max-w-[200px] z-20 md:hidden">
      <Sheet>
        <SheetTrigger>
          <Button> Sections</Button>
        </SheetTrigger>
        <SheetContent className=" flex flex-col gap-2">
          <Link key={course.id} href={`/courses/${course.id}/overview`} className=" rounded-lg p-3 hover:bg-[#FDAB04] mt-4">
            Overview
          </Link>
          {course.sections.map((section) => (
            <Link href={`/courses/${course.id}/sections/${section.id}`} key={section.id} className=" rounded-lg mb-4 p-3 hover:bg-[#FDAB04]">
              {section.title}
            </Link>
          ))}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SectionMenu;
