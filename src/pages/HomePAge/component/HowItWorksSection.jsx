import React from "react";

const HowItWorksSection = () => {
  return (
    <section id="how" className="bg-white py-16">
      <div className="container">
        <h2 className="font-display text-3xl text-slate-900 md:text-4xl">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-[#2a9d8f]">Step 01</div>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Create your categories</h3>
            <p className="mt-2 text-slate-600">Use default Nigeria-friendly categories or customize your own.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-[#2a9d8f]">Step 02</div>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Log income + expenses</h3>
            <p className="mt-2 text-slate-600">Add entries in seconds and attach labels for clarity.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-6">
            <div className="text-sm font-semibold text-[#2a9d8f]">Step 03</div>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">See weekly insights</h3>
            <p className="mt-2 text-slate-600">Track progress and adjust spending before month-end.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
