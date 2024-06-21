import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: NextRequest) => {
  //1. Webhook
  //2. Create session
  const rawBody = await request.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    return new NextResponse(`Invalid Webhook: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const customerId = session?.metadata?.customerId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    //kiem tra checkout duoc thuc hien
    if (!customerId || !courseId) {
      //kiem tra viec xac nhan khoa hoc co tra ve dung thong tin cua khoa hoc va khach hang hay khon
      return new NextResponse("Missing metadata", { status: 400 });
    }
    await db.purchase.create({
      data: {
        courseId,
        customerId,
      },
    });
  } else {
    return new NextResponse(`UnHandled event type: ${event.type}`, { status: 400 });
  }
  return new NextResponse("Success", { status: 200 });
};
