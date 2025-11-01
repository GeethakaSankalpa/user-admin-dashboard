// app/api/users/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().sort({ createdAt: -1 });
    const formattedUsers = users.map((user) => ({
      ...user.toObject(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));
    return NextResponse.json(formattedUsers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, username, password, accessLevel } = await req.json();

    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "Name, email, username, and password are required." },
        { status: 400 }
      );
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return NextResponse.json(
        { error: "User already exists with this email." },
        { status: 400 }
      );

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return NextResponse.json(
        { error: "Username is already taken." },
        { status: 400 }
      );

    const newUser = await User.create({
      name,
      email,
      username,
      password,
      accessLevel: accessLevel || "member",
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
