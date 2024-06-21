"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const TopBar = () => {
  const { isSignedIn } = useAuth();
  const topRoutes = [
    { label: "Instructor", path: "/instructor/courses" },
    { label: "Learning", path: "/learning" },
  ];
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      router.push(`/search?query=${searchInput}`);
    }
  };

  const pathname = usePathname();
  const sidebarRoutes = [
    { label: "Courses", path: "/instructor/courses" },
    {
      label: "Performence",
      path: "/instructor/performance",
    },
  ];
  return (
    <div className=" flex justify-between items-center p-4">
      <Link href={"/"}>
        <Image src={"/logo.png"} width={100} height={200} alt="logo" />
      </Link>
      <div className=" max-md:hidden w-[400px] rounded-full flex">
        <input
          className=" flex-grow rounded-l-full bg-[#FFF8EB] border-none outline-none pl-4 py-3 text-sm"
          type="text"
          placeholder="Search for courses"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button disabled={searchInput.trim() === ""} onClick={handleSearch} className=" bg-[#FDAB04] rounded-r-full px-4 py-3 border-none rounded-none cursor-pointer hover:bg-[#FDAB04]/80">
          <Search className="h-4 w-4" />
        </button>
      </div>
      <div className="flex items-center gap-6">
        <div className="max-sm:hidden gap-6 flex">
          {topRoutes.map((route) => (
            <Link href={route.path} key={route.path} className=" text-sm font-medium hover:text-[#FDAB04]">
              {route.label}
            </Link>
          ))}
        </div>
        <div className="w-full max-w-[200px] sm:hidden z-20">
          <Sheet>
            <SheetTrigger>
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent className=" flex flex-col gap-4">
              <div className=" flex flex-col gap-4">
                {topRoutes.map((route) => (
                  <Link href={route.path} key={route.path} className=" text-sm font-medium hover:text-[#FDAB04]">
                    {route.label}
                  </Link>
                ))}
                {pathname.startsWith("/instructor") && (
                  <div className="flex flex-col gap-4">
                    {sidebarRoutes.map((route) => (
                      <Link href={route.path} key={route.path} className=" text-sm font-medium hover:text-[#FDAB04]">
                        {route.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {isSignedIn ? (
          <UserButton afterSignOutUrl="/sign-in" />
        ) : (
          <Link href={"/sign-in"}>
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TopBar;
