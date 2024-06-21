"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MuxData, Resource, Section } from "@prisma/client";
import RichEditor from "../custom/RichEditor";
import FileUpload from "../custom/FileUpload";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Trash } from "lucide-react";
import { Switch } from "../ui/switch";
import ResourceForm from "./ResourceForm";
import MuxPlayer from "@mux/mux-player-react";
import Delete from "../custom/Delete";
import PublishButton from "../custom/PublishButton";

const formSchema = z.object({
  title: z.string().min(2, "Title is required and must be at least  2 characters long"),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isFree: z.boolean().optional(),
});

interface EditSectionFormProps {
  section: Section & { resources: Resource[]; muxData?: MuxData | null };
  courseId: string;
  isCompleted: boolean;
}
const EditSectionForm = ({ section, courseId, isCompleted }: EditSectionFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: section.title,
      description: section.description || "",
      videoUrl: section.videoUrl || "",
      isFree: section.isFree,
    },
  });
  const { isValid, isSubmitting } = form.formState;
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/courses/${courseId}/sections/${section.id}`, values);
      toast.success("Section updated");
      router.refresh();
    } catch (error) {
      console.log("Fail to update the section", error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <>
      <div className=" flex flex-col sm:flex-row gap-2 sm:justify-between mb-7">
        <Link href={`/instructor/courses/${courseId}/sections`}>
          <Button variant={"outline"} className="text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to curriculum
          </Button>
        </Link>
        <div className="flex gap-4">
          <PublishButton isPublished={section.isPublished} disabled={!isCompleted} page="Section" courseId={courseId} sectionId={section.id} />
          <Delete item="section" courseId={courseId} sectionId={section.id} />
        </div>
      </div>
      <h1 className="text-2xl font-bold ">Section Details</h1>
      <p className="text-sm font-medium mt-2">Complete this section with detailed information, good video and resources to give your students the best learning experience</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Introduction to Web Development" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor placeholder="What is this section about?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {section.videoUrl && (
            <div className="my-5">
              <MuxPlayer playbackId={section.muxData?.playbackId || ""} className="max-w-[600px]" />
            </div>
          )}
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-2">
                  Video <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload value={field.value || ""} onChange={(url) => field.onChange(url)} endpoint="sectionVideo" page="Edit Section" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFree"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <FormLabel className="text-base">Accessibilty</FormLabel>
                <FormDescription>Everyone can access this section for FREE</FormDescription>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex gap-4 justify-end">
            <Link href={`/instructor/courses/${courseId}/sections`}>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </Link>
            <Button disabled={!isValid || isSubmitting} type="submit">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </Form>
      <ResourceForm section={section} courseId={courseId} />
    </>
  );
};

export default EditSectionForm;
