import { NextResponse } from "next/server";
import type { CreativeBrief, Requirements } from "../../../types";
import { generateImage } from "../../../services/openaiService";
import { uploadRender } from "../../../services/storageService";

export async function POST(request: Request) {
  const { requirements, brief, size, assetPaths } = (await request.json()) as {
    requirements: Requirements;
    brief: CreativeBrief;
    size: "1:1" | "9:16";
    assetPaths?: string[];
  };

  try {
    const buffer = await generateImage({ requirements, brief, size, assetPaths });
    const path = `${crypto.randomUUID()}-${size.replace(":", "x")}.png`;
    const upload = await uploadRender(path, buffer, "image/png");
    return NextResponse.json(upload);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate image." }, { status: 500 });
  }
}
