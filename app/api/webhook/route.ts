import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  console.log("Webhook POST received");

  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new NextResponse(`Webhook Error: ${error.message}`, {
        status: 400,
      });
    }
    return new NextResponse("An unknown error occurred");
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
    }

    await db.purchase.create({
      data: {
        courseId,
        userId,
      }
    });
  } else {
    return new NextResponse(`Webhook Error: Unhandled event type ${event.type}`, {
      status: 200,
    }
    )
  }

  return new NextResponse("Webhook received", { status: 200 });
}
