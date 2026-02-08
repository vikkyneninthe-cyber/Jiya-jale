import Link from "next/link";
import type { Campaign } from "../types";

export const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
  <Link href={`/campaign/${campaign.id}`} className="glass-panel block rounded-3xl p-6 transition hover:border-white/20">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-xl italic text-white">{campaign.title}</h3>
        <p className="mt-2 text-sm text-white/60">
          {campaign.market} · {campaign.platform}
        </p>
      </div>
      {campaign.performance_index !== null && campaign.performance_index !== undefined ? (
        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
          {campaign.performance_index}
        </span>
      ) : null}
    </div>
  </Link>
);
