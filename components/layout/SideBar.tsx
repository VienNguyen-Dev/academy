"use client";
import { BarChart4, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideBar = () => {
  const pathname = usePathname();
  const sidebarRoutes = [
    { icon: <MonitorPlay />, label: "Courses", path: "/instructor/courses" },
    {
      icon: <BarChart4 />,
      label: "Performence",
      path: "/instructor/performence",
    },
  ];
  return (
    <div className=" max-sm:hidden flex flex-col items-center w-64 border-r shadow-md text-sm px-3 my-4 font-medium gap-4">
      {sidebarRoutes.map((route) => (
        <Link
          href={route.path}
          key={route.path}
          className={` w-full gap-4 flex items-center p-3 rounded-lg hover:bg-[#FFF8EB] ${pathname.startsWith(route.path) && "bg-[#FDAB04] hover:bg-[#FDAB04]/80"}`}
        >
          {route.icon}
          {route.label}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
