import { getPerformence } from "@/app/actions/getPerformence";
import Chart from "@/components/performence/Chart";
import DataCard from "@/components/performence/DataCard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const PerformencePage = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const { data, totalRevenue, totalSales } = await getPerformence(userId);
  return (
    <div className="p-6">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard value={totalRevenue} label="Total Revenue" shouldFormat />
        <DataCard value={totalSales} label="Total Sales" />
        <Chart data={data} />
      </div>
    </div>
  );
};

export default PerformencePage;
