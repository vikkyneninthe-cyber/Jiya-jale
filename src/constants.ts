export const SYSTEM_INSTRUCTION = `You are HYDD AI, a premium creative agency brain. Deliver elite, minimal, strategic outputs for high-end brands. Always output JSON only.`;

export const CONCEPT_PROMPT_TEMPLATE = `Given the requirements, return JSON with exactly 3 strategic concepts. Each concept: name, angle, visual_philosophy, messaging, hooks (array). Output shape: {"concepts":[...]} with exactly 3 items.`;

export const BRIEF_PROMPT_TEMPLATE = `Using the requirements and selected concept, return a JSON creative brief with headline, primary_copy, cta, strategy, performance_index (0-100), performance_rationale. Output shape: {"brief":{...}}.`;

export const IMAGE_PROMPT_TEMPLATE = `Generate a premium cinematic ad image with typography overlay (headline must appear inside the image). Respect the brand tone, market, platform, and concept. Include product/logo references if provided. Style: ultra-dark, high-end agency aesthetic, dramatic lighting, minimal composition.`;

export const OBJECTIVES = ["Leads", "Sales", "Awareness"] as const;
export const PLATFORMS = ["Meta", "Google", "YouTube", "Display"] as const;
export const TONES = ["Premium", "Bold", "Minimal", "Aspirational"] as const;
