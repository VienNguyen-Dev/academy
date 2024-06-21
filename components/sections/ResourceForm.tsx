"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Resource, Section } from "@prisma/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";

import { File, Loader2, PlusCircle, X } from "lucide-react";
import FileUpload from "../custom/FileUpload";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Title is requied and must be at least 2 characters long.",
  }),
  fileUrl: z.string().min(1, {
    message: "File Url is required",
  }),
});

interface ResourceFormProps {
  section: Section & { resources: Resource[] };
  courseId: string;
}
const ResourceForm = ({ section, courseId }: ResourceFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      fileUrl: "",
    },
  });

  const router = useRouter();
  const { isValid, isSubmitting } = form.formState;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.post(`/api/courses/${courseId}/sections/${section.id}/resources`, values);
      toast.success("New Resource Uploaded");

      form.reset();
      router.refresh();
    } catch (error) {
      console.log("Fail to upload resource", error);
      toast.error("Something went wrong");
    }
  }

  const handleDelete = async (resourceId: string) => {
    try {
      await axios.post(`/api/courses/${courseId}/sections/${section.id}/resources/${resourceId}`);
      toast.success("Resource deleted successfully!");
    } catch (error) {
      console.log("Fail to delete resource", error);
      toast.error("Something wen wrong!");
    }
  };
  return (
    <>
      <div className=" flex gap-2 items-center mt-12 text-xl font-bold">
        <PlusCircle />
        Add Resources (optional)
      </div>
      <p className=" text-sm font-medium mt-2">Add resources to this section to help section learn better.</p>
      <div className=" flex flex-col mt-5">
        {section.resources.map((resource) => (
          <div key={resource.id} className=" flex justify-between bg-[#FFF8EB] rounded-lg text-sm font-medium p-3 mt-3">
            <div className="flex items-center">
              <File className="w-4 h-4 mr-4" />
              {resource.name}
            </div>
            <button disabled={isSubmitting} className=" text-[#FDAB04] hover:text-[#FDAB04]/80" onClick={() => handleDelete(resource.id)}>
              {isSubmitting ? <Loader2 className="w-4 h-4 anima" /> : <X className="w-4 h-4" />}
            </button>
          </div>
        ))}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Textbox" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mr-2">Upload File</FormLabel>
                  <FormControl>
                    <FileUpload value={field.value || ""} onChange={(url) => field.onChange(url)} endpoint="sectionResource" page="Edit Section" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={!isValid || isSubmitting} type="submit" className="flex items-end justify-end ml-auto">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ResourceForm;
