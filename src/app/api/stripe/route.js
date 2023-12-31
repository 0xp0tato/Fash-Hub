import AuthUser from "@/middleware/AuthUser";
import { NextResponse } from "next/server";
import { server } from "../../../config";

const stripe = require("stripe")(
  "sk_test_51O1l0rSJaq8BUHhWkZ2b6cnu1Bd0KiASlfW1YdaGcfe3wQzQosa7hh9eb26XV5O5O0oHH2JV5FGKXEbnmcK4ZoYu00ZOTQKwk6"
);

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const res = await req.json();

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: res,
        mode: "payment",
        success_url: `${server}/checkout?status=success`,
        cancel_url: `${server}/checkout?status=cancel`,
      });

      return NextResponse.json({
        success: true,
        id: session.id,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated",
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Something went wrong ! Please try again",
    });
  }
}
