import React from "react";

const StatsSection = () => {
  return (
    <section className="bg-[#f7f4ee] py-12">
      <div className="container grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-2xl font-semibold text-slate-900">+30%</div>
          <p className="mt-2 text-slate-600">Better visibility on spending after just one month.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-2xl font-semibold text-slate-900">NGN ready</div>
          <p className="mt-2 text-slate-600">Designed with local realities and cash flow in mind.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="text-2xl font-semibold text-slate-900">1 tap</div>
          <p className="mt-2 text-slate-600">Quick inputs, automatic summaries, less clutter.</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
