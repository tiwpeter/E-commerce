import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();

  const category = await prisma.category.update({
    where: { id: params.id },
    data: body,
  });

  return NextResponse.json(category);
}

export async function DELETE(_: any, { params }: any) {
  await prisma.category.delete({
    where: { id: params.id },
  });

  return NextResponse.json({ message: "Deleted" });
}
export async function POST(req: Request) {
  const body = await req.json();
  const category = await prisma.category.create({ data: body });
  return NextResponse.json(category);
}
