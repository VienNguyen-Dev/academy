import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

interface ProgressButtonProps {
  courseId: string;
  sectionId: string;
  isCompleted: boolean;
}

const ProgressButton = ({ courseId, sectionId, isCompleted }: ProgressButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/sections/${sectionId}/progress`, {
        isCompleted: !isCompleted,
      });

      toast.success("Progress updated successfully!");
      router.refresh();
    } catch (error) {
      console.log("Fail to update progress", error);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button onClick={onClick} variant={isCompleted ? "complete" : "default"}>
      {isLoading ? (
        <Loader2 className=" w-4 h-4 animate-spin" />
      ) : isCompleted ? (
        <div className=" flex items-center">
          <CheckCircle className="mr-2" />
          <p>Completed</p>
        </div>
      ) : (
        "Mark as course"
      )}
    </Button>
  );
};

export default ProgressButton;
