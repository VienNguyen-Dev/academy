import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & { course: Course };
const groupByCource = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: { total: number; count: number } } = {}; //lay thong tin ve tong so tien va tong so khoa hoc
  purchases.forEach((purchase) => {
    //duyet qua mang khoa hoc da duoc mua,
    const courseTitle = purchase.course.title; //luu ten cua khoa hoc vao bien courseTitle

    if (!grouped[courseTitle]) {
      //kiem tra neu trong
      grouped[courseTitle] = { total: 0, count: 0 };
    }

    grouped[courseTitle].total += purchase.course.price!;
    grouped[courseTitle].count++;
  });
  return grouped;
};

export const getPerformence = async (userId: string) => {
  try {
    const purcharses = await db.purchase.findMany({
      where: {
        course: { instructorId: userId },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCource(purcharses); //tim tong gia tri cau cac khoa hoc va so khoa hoc da dang ki hoc

    const data = Object.entries(groupedEarnings).map(([courseTitle, { total, count }]) => ({
      name: courseTitle,
      total,
      count,
    }));

    const totalRevenue = data.reduce((acc, current) => acc + current.total, 0);
    const totalSales = purcharses.length;
    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log(["getPerformence", error]);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
