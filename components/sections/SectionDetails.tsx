"use client";

import { Course, MuxData, Progress, Purchase, Resource, Section } from "@prisma/client";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { File, Loader2, Lock } from "lucide-react";
import ReadText from "../custom/ReadText";
import MuxPlayer from "@mux/mux-player-react";
import Link from "next/link";
import ProgressButton from "./ProgressButton";
import SectionMenu from "../layout/SectionMenu";

interface SectionDetails {
  course: Course & { sections: Section[] };
  section: Section;
  purchase: Purchase | null;
  muxData: MuxData | null;
  resources: Resource[] | [];
  progress: Progress | null;
}
const SectionDetails = ({ course, section, purchase, muxData, progress, resources }: SectionDetails) => {
  const [isLoading, setIsLoading] = useState(false);
  //Tao mot bien de khao cac noi dung khong can hien thi
  const isLock = !purchase && !section.isFree;
  const buyCourse = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${course.id}/checkout`);
      window.location.assign(response.data.url);
      toast.success("Buy course successfully!");
    } catch (error) {
      console.log("Fail to checkout course", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex flex-col px-4 py-6 gap-5">
      <div className=" flex flex-col md:flex-row md:justify-between md:items-center">
        <h1 className=" text-2xl font-bold max-md:mb-4">{section.title}</h1>
        <div className=" flex">
          <SectionMenu course={course} />

          {!purchase ? (
            <Button onClick={buyCourse}>{isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <p>Buy this course</p>}</Button>
          ) : (
            <ProgressButton courseId={course.id} sectionId={section.id} isCompleted={!!progress?.isCompleted} />
          )}
        </div>
      </div>
      <ReadText value={section.description!} />
      {isLock ? (
        <div className=" px-10 flex flex-col gap-5 items-center bg-[#FFF8EB]">
          <Lock className="w-4 h-4" />
          <p className=" text-sm font-bold">Video for this section is locked. Plase buy the course to access.</p>
        </div>
      ) : (
        <MuxPlayer playbackId={muxData?.playbackId || ""} className="md:max-w-[600px]" />
      )}

      <div>
        <h2 className=" text-xl font-bold mb-5">Recourses</h2>
        {resources.map((resource) => (
          <Link href={resource.fileUrl} target="blank" className="flex items-center bg-[#FFF8EB] rounded-lg p-3 text-sm font-medium" key={resource.id}>
            <File className="w-4 h-4 mr-4" />
            {resource.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SectionDetails;
