import { BRIEF_PROMPT_TEMPLATE, CONCEPT_PROMPT_TEMPLATE, IMAGE_PROMPT_TEMPLATE, SYSTEM_INSTRUCTION } from "../constants";
import type { Concept, CreativeBrief, Requirements } from "../types";
import { getAssetPublicUrls } from "./storageService";

const OPENAI_BASE = "https://api.openai.com/v1";

const getResponseText = (payload: any) => {
  if (payload.output_text) {
    return payload.output_text as string;
  }
  const texts: string[] = [];
  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" || content.type === "text") {
        texts.push(content.text);
      }
    }
  }
  return texts.join("\n");
};

const fetchJson = async (path: string, body: Record<string, unknown>) => {
  const response = await fetch(`${OPENAI_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${errorText}`);
  }

  return response.json();
};

export const generateConcepts = async (requirements: Requirements): Promise<Concept[]> => {
  const payload = {
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: [{ type: "text", text: SYSTEM_INSTRUCTION }] },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${CONCEPT_PROMPT_TEMPLATE}\nRequirements: ${JSON.stringify(requirements)}`
          }
        ]
      }
    ],
    response_format: { type: "json_object" }
  };

  const data = await fetchJson("/responses", payload);
  const text = getResponseText(data);
  const parsed = JSON.parse(text);
  const concepts = parsed.concepts as Concept[];
  if (!Array.isArray(concepts) || concepts.length !== 3) {
    throw new Error("Expected exactly 3 concepts");
  }
  return concepts;
};

export const generateBrief = async (
  requirements: Requirements,
  selectedConcept: Concept
): Promise<CreativeBrief> => {
  const payload = {
    model: "gpt-4.1-mini",
    input: [
      { role: "system", content: [{ type: "text", text: SYSTEM_INSTRUCTION }] },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${BRIEF_PROMPT_TEMPLATE}\nRequirements: ${JSON.stringify(requirements)}\nConcept: ${JSON.stringify(selectedConcept)}`
          }
        ]
      }
    ],
    response_format: { type: "json_object" }
  };

  const data = await fetchJson("/responses", payload);
  const text = getResponseText(data);
  const parsed = JSON.parse(text);
  return parsed.brief as CreativeBrief;
};

export const generateImage = async (options: {
  requirements: Requirements;
  brief: CreativeBrief;
  size: "1:1" | "9:16";
  assetPaths?: string[];
}) => {
  const { requirements, brief, size, assetPaths = [] } = options;
  const sizeMap = {
    "1:1": "1024x1024",
    "9:16": "1024x1792"
  } as const;

  const assetUrls = assetPaths.length ? await getAssetPublicUrls(assetPaths) : [];
  const assetText = assetUrls.length
    ? `Brand assets (reference visually): ${assetUrls.map((asset) => asset.url).join(", ")}`
    : "No brand asset URLs available; use textual brand cues only.";

  const prompt = `${IMAGE_PROMPT_TEMPLATE}\nRequirements: ${JSON.stringify(requirements)}\nBrief: ${JSON.stringify(brief)}\n${assetText}`;

  const payload = {
    model: "gpt-image-1",
    prompt,
    size: sizeMap[size],
    quality: "high",
    n: 1
  };

  const data = await fetchJson("/images/generations", payload);
  const base64 = data.data?.[0]?.b64_json;
  if (!base64) {
    throw new Error("Image generation failed");
  }
  const buffer = Buffer.from(base64, "base64");
  return buffer;
};
