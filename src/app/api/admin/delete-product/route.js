import connectToDB from "@/database";
import AuthUser from "@/middleware/AuthUser";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(req);

    if (isAuthUser && isAuthUser.role === "admin") {
      const { searchParams } = new URL(req.url);

      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Product ID is required",
        });
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (deletedProduct) {
        return NextResponse.json({
          success: true,
          message: "Product Deleted Successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to delete the product! Please try again",
        });
      }
    }
    else{
      return NextResponse.json({
        success: false,
        message: "You are not an authenticated user",
      });
    }
  } catch (error) {
    console.log(error);
    console.log(error);
    return NextResponsesponse.json({
      success: false,
      message: "Something went Wrong. Try Again Later",
    });
  }
}
