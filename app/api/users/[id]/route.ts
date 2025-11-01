// app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";

// Type for params in Next.js 15+
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    await dbConnect();
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    console.log("DELETE request for user ID:", id);
    
    await dbConnect();
    const user = await User.findByIdAndUpdate(id, { status: "deactivated" }, { new: true });
    
    if (!user) {
      console.error("User not found:", id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("User deactivated successfully:", user);
    return NextResponse.json({ message: "User deactivated successfully", user }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}