"use client";

import { Category } from "@prisma/client";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
}

const Categories = ({ categories, selectedCategory }: CategoriesProps) => {
  const router = useRouter();
  const onClick = (categoryId: string | null) => {
    router.push(categoryId ? `/categories/${categoryId}` : "/");
  };
  return (
    <div className=" flex flex-wrap px-4 justify-center my-10 gap-7">
      <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => onClick(null)}>
        All Categories
      </Button>
      {categories.map((category) => (
        <Button onClick={() => onClick(category.id)} key={category.id} variant={selectedCategory === category.id ? "default" : "outline"}>
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default Categories;
