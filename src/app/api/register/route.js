import connectToDB from "@/database";
import User from "@/models/user";
import Joi from "joi";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(req) {
  await connectToDB();

  const { name, email, password, role } = await req.json();

  const { error } = schema.validate({ name, email, password, role });

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    //check if user exists

    const isUserAlreadyExists = await User.findOne({ email });

    if (isUserAlreadyExists) {
      return NextResponse.json({
        success: false,
        message: "User Already Exist",
      });
    } else {
      const hashPassword = await hash(password, 12);

      const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        role,
      });

      if (newUser) {
        return NextResponse.json({
          success: true,
          message: "Account Created Successfully",
        });
      }
    }
  } catch (error) {
    console.log("Error in registering user");

    return NextResponse.json({
      success: false,
      message: "Something went Wrong. Try Again Later",
    });
  }
}
