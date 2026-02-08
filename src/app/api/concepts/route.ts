import { NextResponse } from "next/server";
import type { Requirements } from "../../../types";
import { generateConcepts } from "../../../services/openaiService";

export async function POST(request: Request) {
  const requirements = (await request.json()) as Requirements;
  try {
    const concepts = await generateConcepts(requirements);
    return NextResponse.json({ concepts });
  } catch (error) {
    try {
      const concepts = await generateConcepts(requirements);
      return NextResponse.json({ concepts });
    } catch (finalError) {
      return NextResponse.json({ error: "Failed to generate concepts." }, { status: 500 });
    }
  }
}
