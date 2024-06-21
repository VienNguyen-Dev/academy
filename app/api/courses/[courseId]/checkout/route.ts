import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
export const POST = async (request: NextRequest, { params }: { params: { courseId: string } }) => {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        courseId_customerId: { courseId: params.courseId, customerId: user.id },
      },
    });

    if (purchase) {
      return new NextResponse("Course Allready Purchase", { status: 400 });
    }
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "cad",
          product_data: {
            name: course.title,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripedCustomer = await db.stripeCustomer.findUnique({
      //tim kiem thong tin khach hang da duoc tao va luu tru vao database
      where: {
        customerId: user.id,
      },
      select: { stripeCustomerId: true },
    });
    //Khach hang chua ton tai trong database
    if (!stripedCustomer) {
      const custommer = await stripe.customers.create({
        //tao khach hang theo email
        email: user.emailAddresses[0].emailAddress,
      });
      stripedCustomer = await db.stripeCustomer.create({
        data: {
          stripeCustomerId: custommer.id,
          customerId: user.id,
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripedCustomer.stripeCustomerId,
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}/overview?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}/overview?canceled=true`,
      metadata: {
        courseId: course.id,
        customerId: user.id,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log(["CourseId_checkout_POST", error]);
    return new NextResponse("Interval Server Error", { status: 500 });
  }
};
