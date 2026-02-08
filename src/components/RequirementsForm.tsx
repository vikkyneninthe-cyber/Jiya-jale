"use client";

import { useState } from "react";
import { OBJECTIVES, PLATFORMS, TONES } from "../constants";
import type { Requirements } from "../types";
import { supabaseBrowser } from "../services/supabaseClient";

export const RequirementsForm = ({ onSubmit }: { onSubmit: (requirements: Requirements) => Promise<void> }) => {
  const [form, setForm] = useState<Requirements>({
    market: "",
    objective: "Leads",
    platform: "Meta",
    tone: "Premium",
    notes: ""
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadAssets = async () => {
    if (!files?.length) return [] as string[];
    const supabase = supabaseBrowser();
    const uploads: string[] = [];

    for (const file of Array.from(files)) {
      const path = `${crypto.randomUUID()}-${file.name}`;
      const { error } = await supabase.storage.from("assets").upload(path, file, {
        upsert: true
      });
      if (!error) {
        uploads.push(path);
      }
    }

    return uploads;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const assetIds = await uploadAssets();
    await onSubmit({ ...form, assetIds });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div>
        <label className="text-sm text-white/60">Market</label>
        <input
          value={form.market}
          onChange={(event) => setForm({ ...form, market: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-white"
          placeholder="Luxury skincare in US"
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm text-white/60">Objective</label>
          <select
            value={form.objective}
            onChange={(event) => setForm({ ...form, objective: event.target.value as Requirements["objective"] })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          >
            {OBJECTIVES.map((objective) => (
              <option key={objective} value={objective}>
                {objective}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/60">Platform</label>
          <select
            value={form.platform}
            onChange={(event) => setForm({ ...form, platform: event.target.value as Requirements["platform"] })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          >
            {PLATFORMS.map((platform) => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-white/60">Tone</label>
          <select
            value={form.tone}
            onChange={(event) => setForm({ ...form, tone: event.target.value as Requirements["tone"] })}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          >
            {TONES.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm text-white/60">Notes</label>
        <textarea
          value={form.notes}
          onChange={(event) => setForm({ ...form, notes: event.target.value })}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-4"
          rows={4}
          placeholder="Optional cues"
        />
      </div>
      <div>
        <label className="text-sm text-white/60">Brand assets</label>
        <input
          type="file"
          multiple
          onChange={(event) => setFiles(event.target.files)}
          className="mt-2 w-full text-sm text-white/60"
        />
      </div>
      <button
        type="submit"
        className="heartbeat rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.2em]"
        disabled={loading}
      >
        {loading ? "Securing vault..." : "Lock requirements"}
      </button>
    </form>
  );
};
