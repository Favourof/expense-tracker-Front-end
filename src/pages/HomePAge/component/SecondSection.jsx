import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck, Wallet2 } from "lucide-react";

const features = [
  {
    icon: Wallet2,
    title: "Track spending fast",
    description:
      "Log daily purchases in seconds and keep every expense grouped where it belongs.",
    accent: "from-[#0b3b2e] to-[#145a45]",
  },
  {
    icon: BarChart3,
    title: "Read your patterns",
    description:
      "See totals, trends, and summaries that make it easier to understand where money goes.",
    accent: "from-[#1f6f63] to-[#2a9d8f]",
  },
  {
    icon: ShieldCheck,
    title: "Stay private",
    description:
      "Your account and financial data stay protected while you review and update your budget.",
    accent: "from-[#4f46e5] to-[#7c3aed]",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-white py-16">
      <div className="container mx-auto px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b3b2e]">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-bold text-gray-800 sm:text-4xl">
            Built to feel simple, clear, and calm
          </h2>
          <p className="mt-3 text-gray-600">
            Every screen helps users move from quick logging to real understanding without extra
            noise.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className={`inline-flex rounded-2xl bg-gradient-to-br ${feature.accent} p-3 text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    0{index + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-[#f7f4ee] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Daily input</p>
              <p className="mt-1 text-sm text-slate-600">Add money movement the moment it happens.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Weekly review</p>
              <p className="mt-1 text-sm text-slate-600">Spot trends before they become a surprise.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Private access</p>
              <p className="mt-1 text-sm text-slate-600">Keep your financial history behind your login.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
