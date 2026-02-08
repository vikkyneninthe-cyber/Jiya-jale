"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "../../services/supabaseClient";
import type { Campaign } from "../../types";
import { BrandLogo } from "../../components/BrandLogo";
import { CampaignCard } from "../../components/CampaignCard";
import { FadeZoom } from "../../components/Motion";

export default function DashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const supabase = supabaseBrowser();
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        setUserId(null);
        setLoading(false);
        return;
      }
      setUserId(user.id);
      const { data: campaignsData } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });
      setCampaigns((campaignsData ?? []) as Campaign[]);
      setLoading(false);
    };
    init();
  }, []);

  const handleSignIn = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const handleCreateCampaign = async () => {
    const supabase = supabaseBrowser();
    if (!userId) return;
    const { data, error } = await supabase
      .from("campaigns")
      .insert({
        user_id: userId,
        title: "Untitled Campaign",
        objective: "Leads",
        platform: "Meta",
        tone: "Premium",
        market: "Global"
      })
      .select("*")
      .single();
    if (!error && data) {
      router.push(`/campaign/${data.id}`);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <header className="flex items-center justify-between">
        <BrandLogo />
        <span className="text-xs uppercase tracking-[0.4em] text-white/40">Vault Dashboard</span>
      </header>
      <div className="mt-12">
        <FadeZoom>
          <section className="glass-panel rounded-4xl p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl italic text-white">Campaign Vault</h1>
                <p className="mt-2 text-white/60">Secure every concept, brief, and render.</p>
              </div>
              {userId ? (
                <button
                  onClick={handleCreateCampaign}
                  className="rounded-full border border-white/10 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em]"
                >
                  New Campaign
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="rounded-full border border-white/10 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em]"
                >
                  Sign in with Google
                </button>
              )}
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {loading ? (
                <div className="text-sm text-white/50">Loading vault...</div>
              ) : campaigns.length ? (
                campaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)
              ) : userId ? (
                <div className="text-sm text-white/50">No campaigns yet.</div>
              ) : (
                <div className="text-sm text-white/50">Sign in to access your vault.</div>
              )}
            </div>
          </section>
        </FadeZoom>
      </div>
    </main>
  );
}
