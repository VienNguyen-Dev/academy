"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Course } from "@prisma/client";
import RichEditor from "../custom/RichEditor";
import { Combobox } from "../custom/ComboBox";
import FileUpload from "../custom/FileUpload";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

import Delete from "../custom/Delete";
import PublishButton from "../custom/PublishButton";

const formSchema = z.object({
  title: z.string().min(2, "Title is required and must be at least  2 characters long"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().min(1, {
    message: "Category is required ",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required",
  }),
  levelId: z.string().optional(),
  imageUrl: z.string().optional(),
  price: z.coerce.number().optional(),
});

interface EditCourseFormProps {
  course: Course;
  levels: { label: string; value: string }[];
  categories: {
    label: string;
    value: string;
    subCategories: { label: string; value: string }[];
  }[];
  isCompleted: boolean;
}
const EditCourseForm = ({ course, levels, categories, isCompleted }: EditCourseFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      subtitle: course.subtitle || "",
      description: course.description || "",
      categoryId: course.categoryId,
      subCategoryId: course.subCategoryId,
      imageUrl: course.imageUrl || "",
      levelId: course.levelId || "",
      price: course.price || undefined,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await axios.patch(`/api/courses/${course.id}`, values);
      toast.success("Course updated");
      router.refresh();
    } catch (error) {
      console.log("Fail to update the course", error);
      toast.error("Soething went wrong!");
    }
  }

  const routes = [
    { label: "Basic Infomation", path: `/instructor/courses/${course.id}/basic` },
    { label: "Curriculum", path: `/instructor/courses/${course.id}/sections` },
  ];
  return (
    <>
      <div className=" flex flex-col sm:flex-row gap-2 sm:justify-between mb-7">
        <div className="flex gap-5">
          {routes.map((route) => (
            <Link key={route.path} href={route.path} className="flex gap-4">
              <Button variant={pathname === route.path ? "default" : "outline"}>{route.label}</Button>
            </Link>
          ))}
        </div>
        <div className="flex gap-4">
          <PublishButton isPublished={course.isPublished} disabled={!isCompleted} courseId={course.id} page="Course" />
          <Delete item="course" courseId={course.id} />
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Title <span className=" text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Web Development for Beginners" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Besome a Full-Stack Developer with just ONE course HTML, CSS, Javascript, Node, React, MongoDB and more!" {...field} />
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
                  Description<span className=" text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RichEditor placeholder="What is this course about?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" flex flex-wrap gap-10">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="mr-2">
                    Category<span className=" text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox options={categories} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="mr-2">
                    Subcategory<span className=" text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox options={categories.find((category) => category.value === form.watch("categoryId"))?.subCategories || []} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="levelId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <FormLabel className="mr-2">
                    Level<span className=" text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Combobox options={levels} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-2">
                  Course Banner<span className=" text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <FileUpload value={field.value || ""} onChange={(url) => field.onChange(url)} endpoint="courseBanner" page="Edit Course" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Price <span className=" text-red-500">*</span> (USD)
                </FormLabel>
                <FormControl>
                  <Input step={"0.01"} type="number" placeholder="29.99" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 justify-end">
            <Link href={"/instructor/courses"}>
              <Button variant={"outline"} type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default EditCourseForm;
