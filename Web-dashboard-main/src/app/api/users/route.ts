// app/api/users/route.ts
import { mockUsers } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json(mockUsers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, avatar } = body;

    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      role,
      avatar: avatar || `https://i.pravatar.cc/150?u=${mockUsers.length + 1}`,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
