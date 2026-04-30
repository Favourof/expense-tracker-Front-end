import React from "react";
import { ArrowRight, BarChart3, Wallet2, ShieldCheck } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Wallet2,
      step: "Step 01",
      title: "Capture money fast",
      text: "Create your categories and log income or expenses in a few taps.",
    },
    {
      icon: BarChart3,
      step: "Step 02",
      title: "See the pattern",
      text: "Use the dashboard to spot spending trends, totals, and pressure points.",
    },
    {
      icon: ShieldCheck,
      step: "Step 03",
      title: "Stay in control",
      text: "Review the week, adjust early, and keep your account protected while you work.",
    },
  ];

  return (
    <section id="how" className="bg-gradient-to-b from-white to-[#f7f4ee] py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b3b2e]">
            How it works
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-900 md:text-4xl">
            A simple flow from setup to insight
          </h2>
          <p className="mt-3 text-slate-600">
            The experience is built to move quickly, stay clear, and give you useful feedback
            without making you learn a new system.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr,0.75fr] lg:items-start">
          <div>
            <div className="grid gap-6 md:grid-cols-3 lg:items-start">
              {steps.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold tracking-wide text-[#2a9d8f]">
                        {item.step}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0b3b2e] text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3b2e]">
                    Keep it simple
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Start with just a few entries a day, then let the dashboard do the heavy
                    lifting.
                  </p>
                </div>
                <div className="grid gap-2 text-sm text-slate-600 sm:min-w-[220px]">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Setup</span>
                    <span className="font-semibold text-slate-900">Fast</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Logging</span>
                    <span className="font-semibold text-slate-900">Daily</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <span>Review</span>
                    <span className="font-semibold text-slate-900">Weekly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="self-start rounded-3xl border border-slate-200 bg-[#0b3b2e] p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              What you get
            </p>
            <h3 className="mt-3 text-2xl font-semibold">A flow that stays easy from the first tap</h3>
            <p className="mt-3 text-sm leading-6 text-white/75">
              You set up once, log daily, then review the picture in a way that feels clear instead
              of overwhelming.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <div className="mt-0.5 rounded-full bg-white/15 p-2">
                  <Wallet2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Fast entry</p>
                  <p className="text-sm text-white/70">Capture money movement without slowing down.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <div className="mt-0.5 rounded-full bg-white/15 p-2">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Clear insight</p>
                  <p className="text-sm text-white/70">See totals and trends that are easy to act on.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                <div className="mt-0.5 rounded-full bg-white/15 p-2">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Protected account</p>
                  <p className="text-sm text-white/70">Sign in securely and keep your budget private.</p>
                </div>
              </div>
            </div>
            <a
              href="#features"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f47d4a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e56f3d]"
            >
              See features
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
