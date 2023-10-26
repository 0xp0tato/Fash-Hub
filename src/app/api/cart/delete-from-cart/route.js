import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(req);
    if (isAuthUser) {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Cart item ID is required",
        });
      }

      const deleteCartItem = await Cart.findByIdAndDelete(id);

      if (deleteCartItem) {
        return NextResponse.json({
          success: true,
          message: "Cart item deleted successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to delete cart item. Please try again",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not an Authenticated User",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again later",
    });
  }
}
