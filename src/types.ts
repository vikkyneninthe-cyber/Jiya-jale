export type Requirements = {
  market: string;
  objective: "Leads" | "Sales" | "Awareness";
  platform: "Meta" | "Google" | "YouTube" | "Display";
  tone: "Premium" | "Bold" | "Minimal" | "Aspirational";
  notes?: string;
  assetIds?: string[];
};

export type Concept = {
  name: string;
  angle: string;
  visual_philosophy: string;
  messaging: string;
  hooks: string[];
};

export type CreativeBrief = {
  headline: string;
  primary_copy: string;
  cta: string;
  strategy: string;
  performance_index: number;
  performance_rationale: string;
};

export type Campaign = {
  id: string;
  user_id: string;
  title: string;
  objective: string;
  platform: string;
  tone: string;
  market: string;
  notes?: string | null;
  asset_paths: string[];
  concepts?: Concept[] | null;
  selected_concept_index?: number | null;
  brief?: CreativeBrief | null;
  performance_index?: number | null;
  render_paths: string[];
  created_at: string;
};
