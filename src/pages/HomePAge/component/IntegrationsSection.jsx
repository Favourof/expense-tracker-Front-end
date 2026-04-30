import React from "react";
import { ArrowRight, Wallet2, ShieldCheck, RefreshCw, Banknote } from "lucide-react";

const IntegrationsSection = () => {
  const banks = [
    {
      name: "Opay",
      status: "Planned",
      icon: Wallet2,
    },
    {
      name: "PalmPay",
      status: "Planned",
      icon: RefreshCw,
    },
    {
      name: "Kuda",
      status: "Planned",
      icon: Banknote,
    },
    {
      name: "Moniepoint",
      status: "Planned",
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="integrations" className="bg-gradient-to-b from-white to-[#f7f4ee] py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b3b2e]">
            Integrations
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-900 md:text-4xl">
            Bank connections that are coming next
          </h2>
          <p className="mt-3 text-slate-600">
            We are starting with Nigeria-focused banks and wallets, then expanding into automatic
            syncing once the core experience is solid.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {banks.map((bank) => {
            const Icon = bank.icon;
            return (
              <div
                key={bank.name}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0b3b2e] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700">
                    {bank.status}
                  </span>
                </div>
                <div className="mt-5">
                  <p className="text-lg font-semibold text-slate-900">{bank.name}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Planned as part of the next wave of financial connectivity.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b3b2e]">
                Roadmap note
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Right now the app is manual-first. Bank sync will come later, once the core budget
                flow is stable and ready.
              </p>
            </div>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full bg-[#0b3b2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a3429]"
            >
              Explore features
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
