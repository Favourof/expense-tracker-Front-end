import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    title: "Morning check-in",
    text: "Log your first expense in under 10 seconds. The day starts clear.",
  },
  {
    title: "Midday snapshot",
    text: "See what has moved so far and adjust before the day ends.",
  },
  {
    title: "Weekly clarity",
    text: "Your patterns surface automatically. You spend smarter, faster.",
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
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-[#2a9d8f]">Your story</p>
            <h2 className="font-display text-3xl text-slate-900 md:text-4xl">
              A smooth rhythm for your money
            </h2>
            <p className="mt-3 text-slate-600">
              A calm flow from daily input to weekly insight. No spreadsheets. No pressure.
            </p>
          </div>

          <motion.div
            style={{ y: floatY }}
            className="relative rounded-3xl bg-[#f7f4ee] p-6"
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
                  <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#f47d4a] shadow">
                    {index + 1}
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-slate-600">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
