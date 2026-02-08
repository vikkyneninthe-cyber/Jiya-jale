import { NextResponse } from "next/server";
import type { Concept, Requirements } from "../../../types";
import { generateBrief } from "../../../services/openaiService";

export async function POST(request: Request) {
  const { requirements, selectedConcept } = (await request.json()) as {
    requirements: Requirements;
    selectedConcept: Concept;
  };

  try {
    const brief = await generateBrief(requirements, selectedConcept);
    return NextResponse.json({ brief });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate brief." }, { status: 500 });
  }
}
