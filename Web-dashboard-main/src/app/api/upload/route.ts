import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
      if (error) throw error;
      return result;
    });

    // ใช้ Promisify upload_stream
    const uploaded = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
      stream.end(buffer);
    });

    return NextResponse.json({ url: uploaded.secure_url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
