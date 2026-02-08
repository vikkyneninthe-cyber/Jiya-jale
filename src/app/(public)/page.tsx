import Link from "next/link";
import { BrandLogo } from "../../components/BrandLogo";
import { FadeZoom } from "../../components/Motion";

export default function LandingPage() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <header className="flex items-center justify-between">
          <BrandLogo />
          <span className="text-xs uppercase tracking-[0.4em] text-white/40">Agency Hub</span>
        </header>
        <FadeZoom>
          <section className="glass-panel rounded-4xl px-10 py-16">
            <p className="text-xs uppercase tracking-[0.5em] text-white/40">HYDD AI</p>
            <h1 className="mt-6 text-4xl italic text-white md:text-6xl">
              Elite Creative Intelligence. Delivered as Software.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/70">
              Replace agencies with a premium, automated workflow that generates strategic concepts, creative briefs, and
              cinematic ad renders in minutes.
            </p>
            <div className="mt-10">
              <Link
                href="/dashboard"
                className="heartbeat inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-8 py-4 text-xs uppercase tracking-[0.3em]"
              >
                Enter the Agency
              </Link>
            </div>
          </section>
        </FadeZoom>
      </div>
    </main>
  );
}
