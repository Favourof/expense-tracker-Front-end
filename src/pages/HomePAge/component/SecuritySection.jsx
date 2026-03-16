import React from "react";

const SecuritySection = () => {
  return (
    <section id="security" className="bg-[#f7f4ee] py-16">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-slate-900 md:text-4xl">Security you can trust</h2>
            <p className="mt-3 text-slate-600">
              Built with rotating tokens, Redis-backed revocation, and strict validation.
              Your data stays yours.
            </p>
          </div>
          <ul className="space-y-3 text-slate-700">
            <li className="rounded-xl border border-slate-200 bg-white p-4">JWT access + refresh token rotation</li>
            <li className="rounded-xl border border-slate-200 bg-white p-4">HttpOnly cookies for refresh tokens</li>
            <li className="rounded-xl border border-slate-200 bg-white p-4">Global validation + sanitization</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
