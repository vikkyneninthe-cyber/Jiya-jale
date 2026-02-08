"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabaseBrowser } from "../../../services/supabaseClient";
import type { Campaign, Concept, CreativeBrief, Requirements } from "../../../types";
import { BrandLogo } from "../../../components/BrandLogo";
import { FadeZoom } from "../../../components/Motion";
import { StepShell } from "../../../components/StepShell";
import { RequirementsForm } from "../../../components/RequirementsForm";
import { ConceptsPicker } from "../../../components/ConceptsPicker";
import { ExecutionPanel } from "../../../components/ExecutionPanel";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [selectedConceptIndex, setSelectedConceptIndex] = useState<number | null>(null);
  const [brief, setBrief] = useState<CreativeBrief | null>(null);
  const [renders, setRenders] = useState<{ label: string; url: string; path?: string }[]>([
    { label: "1:1 Square", url: "" },
    { label: "9:16 Vertical", url: "" }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.from("campaigns").select("*").eq("id", campaignId).single();
      if (data) {
        setCampaign(data as Campaign);
        if (data.concepts) {
          setConcepts(data.concepts as Concept[]);
        }
        if (data.selected_concept_index !== null && data.selected_concept_index !== undefined) {
          setSelectedConceptIndex(data.selected_concept_index);
        }
        if (data.brief) {
          setBrief(data.brief as CreativeBrief);
        }
        if (data.render_paths?.length) {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
          const urls = data.render_paths.map((path: string, index: number) => ({
            label: index === 0 ? "1:1 Square" : "9:16 Vertical",
            url: `${supabaseUrl}/storage/v1/object/public/renders/${path}`,
            path
          }));
          setRenders(urls);
        }
      }
    };
    fetchCampaign();
  }, [campaignId]);

  const requirements = useMemo<Requirements | null>(() => {
    if (!campaign) return null;
    return {
      market: campaign.market,
      objective: campaign.objective as Requirements["objective"],
      platform: campaign.platform as Requirements["platform"],
      tone: campaign.tone as Requirements["tone"],
      notes: campaign.notes ?? "",
      assetIds: campaign.asset_paths
    };
  }, [campaign]);

  const handleRequirementsSubmit = async (req: Requirements) => {
    if (!campaign) return;
    setLoading(true);
    const supabase = supabaseBrowser();
    await supabase
      .from("campaigns")
      .update({
        market: req.market,
        objective: req.objective,
        platform: req.platform,
        tone: req.tone,
        notes: req.notes ?? null,
        asset_paths: req.assetIds ?? []
      })
      .eq("id", campaign.id);

    const conceptsResponse = await fetch("/api/concepts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    });
    const conceptsData = await conceptsResponse.json();
    setConcepts(conceptsData.concepts);
    await supabase.from("campaigns").update({ concepts: conceptsData.concepts }).eq("id", campaign.id);
    setCampaign({ ...campaign, ...req, asset_paths: req.assetIds ?? [], concepts: conceptsData.concepts });
    setLoading(false);
  };

  const handleConceptSelect = async (index: number) => {
    if (!campaign || !requirements) return;
    setSelectedConceptIndex(index);
    setLoading(true);
    const selectedConcept = concepts[index];
    const briefResponse = await fetch("/api/brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requirements, selectedConcept })
    });
    const briefData = await briefResponse.json();
    setBrief(briefData.brief);
    const supabase = supabaseBrowser();
    await supabase
      .from("campaigns")
      .update({
        selected_concept_index: index,
        brief: briefData.brief,
        performance_index: briefData.brief.performance_index
      })
      .eq("id", campaign.id);
    setLoading(false);
  };

  const handleGenerateImages = async () => {
    if (!requirements || !brief || !campaign) return;
    setLoading(true);
    const payload = { requirements, brief, assetPaths: campaign.asset_paths };
    const responses = await Promise.all([
      fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, size: "1:1" })
      }),
      fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, size: "9:16" })
      })
    ]);
    const data = await Promise.all(responses.map((res) => res.json()));
    const renderPaths = data.map((item) => item.storagePath);
    const renderUrls = data.map((item, index) => ({
      label: index === 0 ? "1:1 Square" : "9:16 Vertical",
      url: item.publicUrl,
      path: item.storagePath
    }));
    setRenders(renderUrls);
    const supabase = supabaseBrowser();
    await supabase.from("campaigns").update({ render_paths: renderPaths }).eq("id", campaign.id);
    setLoading(false);
  };

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <header className="flex items-center justify-between">
        <BrandLogo />
        <span className="text-xs uppercase tracking-[0.4em] text-white/40">Campaign Detail</span>
      </header>
      <div className="mt-12 grid gap-10">
        {!campaign ? (
          <div className="text-sm text-white/50">Loading campaign...</div>
        ) : (
          <FadeZoom>
            {!concepts.length ? (
              <StepShell title="Requirements" description="Define the market, objective, platform, and tone.">
                <RequirementsForm onSubmit={handleRequirementsSubmit} />
              </StepShell>
            ) : !brief ? (
              <StepShell title="Concepts" description="Select one of three strategic concepts.">
                <ConceptsPicker
                  concepts={concepts}
                  selectedIndex={selectedConceptIndex}
                  onSelect={handleConceptSelect}
                />
                <div className="mt-6 text-sm text-white/50">
                  {loading ? "Generating brief..." : "Select a concept to proceed."}
                </div>
              </StepShell>
            ) : (
              <StepShell title="Execution" description="Creative brief and premium ad renders.">
                <ExecutionPanel brief={brief} renders={renders} />
                <button
                  onClick={handleGenerateImages}
                  className="mt-8 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em]"
                  disabled={loading}
                >
                  {loading ? "Rendering..." : "Generate Images"}
                </button>
              </StepShell>
            )}
          </FadeZoom>
        )}
      </div>
    </main>
  );
}
