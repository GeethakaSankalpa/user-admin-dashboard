import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: "MongoDB connected successfully!" });
  } catch (err) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}
