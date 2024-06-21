"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface PublishButtonProps {
  isPublished: boolean;
  disabled: boolean;
  sectionId?: string;
  courseId: string;
  page?: string;
}
const PublishButton = ({ isPublished, disabled, sectionId, courseId, page }: PublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    let url = `/api/courses/${courseId}`;

    if (page === "Section") {
      url += `/sections/${sectionId}`;
    }

    try {
      setIsLoading(true);
      isPublished ? await axios.post(`${url}/unpublished`) : await axios.post(`${url}/publish`);

      toast.success(`${page} ${isPublished ? "unpublished" : "publish"}`);
      router.refresh();
    } catch (error) {
      console.log(`Fail to ${isPublished ? "Unpublished" : "Publish"} ${page}`, error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button onClick={onClick} variant={"outline"} disabled={disabled || isLoading}>
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPublished ? "Unpublished" : "Publish"}
    </Button>
  );
};

export default PublishButton;
