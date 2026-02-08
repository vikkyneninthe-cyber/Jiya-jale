"use client";

import type { Concept } from "../types";

export const ConceptsPicker = ({
  concepts,
  selectedIndex,
  onSelect
}: {
  concepts: Concept[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}) => (
  <div className="grid gap-6 md:grid-cols-3">
    {concepts.map((concept, index) => (
      <button
        key={concept.name}
        type="button"
        onClick={() => onSelect(index)}
        className={`glass-panel rounded-3xl p-6 text-left transition hover:border-white/20 ${
          selectedIndex === index ? "border border-emerald-400/40" : "border border-white/5"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl italic text-white">{concept.name}</h3>
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">{index + 1}</span>
        </div>
        <p className="text-sm text-white/70">{concept.angle}</p>
        <p className="mt-4 text-xs text-white/50">{concept.visual_philosophy}</p>
      </button>
    ))}
  </div>
);
