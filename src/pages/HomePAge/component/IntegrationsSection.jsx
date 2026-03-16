import React from "react";

const IntegrationsSection = () => {
  const banks = ["Opay", "PalmPay", "Kuda", "Moniepoint"]; 
  return (
    <section id="integrations" className="bg-white py-16">
      <div className="container">
        <h2 className="font-display text-3xl text-slate-900 md:text-4xl">Bank integrations</h2>
        <p className="mt-3 text-slate-600">Automatic syncing is on the roadmap. Starting with Nigeria-focused banks.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {banks.map((bank) => (
            <div key={bank} className="rounded-2xl border border-slate-200 p-5 text-center">
              <div className="text-lg font-semibold text-slate-900">{bank}</div>
              <p className="mt-2 text-sm text-slate-600">Coming soon</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
