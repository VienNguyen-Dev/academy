import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface DeleteProps {
  item: string;
  courseId: string;
  sectionId?: string;
}
const Delete = ({ item, courseId, sectionId }: DeleteProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const onDelete = async () => {
    setIsDeleting(true);
    try {
      const url = item === "course" ? `/api/courses/${courseId}` : `/api/courses/${courseId}/sections/${sectionId}`;
      await axios.delete(url);
      setIsDeleting(false);
      const pushedUrl = item === "course" ? `/instructor/courses` : `/instructor/courses/${courseId}/sections`;
      router.push(pushedUrl);
      router.refresh();
      toast.success(`${item} deleted successfully!`);
    } catch (error) {
      setIsDeleting(false);
      console.log(`Fail to delete ${item}`, error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>{isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash className="w-4 h-4" />}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className=" text-red-500">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete your {item}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isDeleting} onClick={onDelete} className=" bg-[#FDAB04] hover:bg-[#FDAB04]/80">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
