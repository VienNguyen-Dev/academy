"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Combobox } from "../custom/ComboBox";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title is required and minimum 2 characters.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required and minimum 1 character.",
  }),
  subCategoryId: z.string().min(1, {
    message: "Subcategory is required and minimum 1 character.",
  }),
});

interface CreateCourseFormProps {
  categories: {
    label: string;
    value: string;
    subCategories: { label: string; value: string }[];
  }[];
}
const CreateCourseForm = ({ categories }: CreateCourseFormProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      subCategoryId: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/instructor/courses/${response.data.id}/basic`);
      toast.success("New Course Created");
    } catch (error) {
      console.log("Fail to create new course", error);
      toast.error("Something went wrong!");
    }
  }
  return (
    <div className="p-10">
      <h1 className=" text-xl font-bold">Let us give some basics for your courses</h1>
      <p className=" text-sm mt-3"> It is ok if you cannot think of a good title or correct category now. You can change them later.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Web Development for Beginners" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-2">Category</FormLabel>
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
              <FormItem className="flex flex-col">
                <FormLabel className="mr-2">Subcategory</FormLabel>
                <FormControl>
                  <Combobox options={categories.find((category) => category.value === form.watch("categoryId"))?.subCategories || []} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={!isValid || isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Course"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;
