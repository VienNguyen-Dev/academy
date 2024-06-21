"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import toast from "react-hot-toast";
import SectionList from "./SectionList";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is requied and must be at least 2 characters long.",
  }),
});
const CreateSectionForm = ({ course }: { course: Course & { sections: Section[] } }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const router = useRouter();
  const { isValid, isSubmitting } = form.formState;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post(`/api/courses/${course.id}/sections`, values);
      router.push(`/instructor/courses/${course.id}/sections/${response.data.id}`);
      toast.success("New Section Created");
    } catch (error) {
      console.log("Fail to create section", error);
      toast.error("Something went wrong");
    }
  }
  const routes = [
    { label: "Basic Infomation", path: `/instructor/courses/${course.id}/basic` },
    { label: "Curriculum", path: `/instructor/courses/${course.id}/sections` },
  ];

  const pathname = usePathname();

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      await axios.put(`/api/courses/${course.id}/sections/reorder`, {
        list: updateData,
      });
      toast.success("Sections reordered successfully!");
    } catch (error) {
      console.log("Fail to reorder sections", error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="px-10 py-6">
      <div className=" flex gap-5">
        {routes.map((route) => (
          <Link key={route.path} href={route.path}>
            <Button variant={pathname === route.path ? "default" : "outline"}>{route.label}</Button>
          </Link>
        ))}
      </div>
      <SectionList items={course.sections || []} onReorder={onReorder} onEdit={(id) => router.push(`/instructor/courses/${course.id}/sections/${id}`)} />
      <h1 className=" text-xl font-bold mt-5">Add New Section</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Introduction" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex gap-5">
            <Link href={`/intructor/courses/${course.id}/basic`}>
              <Button type="button" variant={"outline"}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Section"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateSectionForm;
