import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CalendarDays, BarChart3, ShieldCheck } from "lucide-react";

const steps = [
  {
    title: "Morning check-in",
    text: "Start the day by logging what matters before it gets lost in the noise.",
  },
  {
    title: "Midday snapshot",
    text: "See what has moved so far and make a better choice before the day ends.",
  },
  {
    title: "Weekly clarity",
    text: "Your patterns surface automatically so you can spend smarter, faster.",
  },
];

const StorySection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const floatY = useTransform(scrollYProgress, [0, 1], [24, -24]);

  return (
    <section className="bg-white py-16">
      <div className="container" ref={containerRef}>
        <div className="grid gap-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-start">
          <div className="space-y-6">
            <p className="text-sm font-semibold text-[#2a9d8f]">Your story</p>
            <h2 className="font-display text-3xl text-slate-900 md:text-4xl">
              A calmer way to stay on top of money
            </h2>
            <p className="mt-3 text-slate-600">
              A calm flow from daily input to weekly insight. No spreadsheets, no noise, no pressure.
            </p>

            <div className="grid gap-3 pt-2 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <CalendarDays className="h-5 w-5 text-[#0b3b2e]" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Daily check-in</p>
                <p className="mt-1 text-sm text-slate-600">Log what changed before the day gets busy.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <BarChart3 className="h-5 w-5 text-[#0b3b2e]" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Weekly insight</p>
                <p className="mt-1 text-sm text-slate-600">Watch trends build without digging around.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <ShieldCheck className="h-5 w-5 text-[#0b3b2e]" />
                <p className="mt-3 text-sm font-semibold text-slate-900">Protected account</p>
                <p className="mt-1 text-sm text-slate-600">Your data stays behind secure access.</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-[#f7f4ee] p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3b2e]">
                The feeling
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                It should feel like a calm check-in, not a chore. The goal is to help people see
                their money more clearly and make a better decision sooner.
              </p>
            </div>
          </div>

          <motion.div
            style={{ y: floatY }}
            className="relative rounded-3xl border border-slate-200 bg-[#f7f4ee] p-6 shadow-sm"
          >
            <div className="absolute left-6 top-8 h-[calc(100%-4rem)] w-px bg-slate-200" />
            <div className="space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true, amount: 0.4 }}
                  className="relative flex gap-6"
                >
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-[#f47d4a] shadow">
                    {index + 1}
                  </div>
                  <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-slate-600">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Result
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    Less guesswork, more confidence
                  </p>
                </div>
                <div className="rounded-full bg-[#0b3b2e] px-3 py-1 text-xs font-semibold text-white">
                  Weekly rhythm
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
