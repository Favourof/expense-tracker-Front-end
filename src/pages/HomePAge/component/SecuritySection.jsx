import React from "react";
import { ShieldCheck, LockKeyhole, BadgeCheck, CircleAlert } from "lucide-react";

const SecuritySection = () => {
  return (
    <section id="security" className="bg-[#f7f4ee] py-16">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0b3b2e]">
              Security first
            </p>
            <h2 className="font-display text-3xl text-slate-900 md:text-4xl">
              Security you can trust
            </h2>
            <p className="max-w-xl text-slate-600">
              Built around verified sign-in, refresh-token protection, and clear session handling so
              your account feels safe from the first login.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <ShieldCheck className="h-5 w-5 text-[#0b3b2e]" />
                <p className="mt-3 font-semibold text-slate-900">Protected access</p>
                <p className="mt-1 text-sm text-slate-600">JWT access + refresh token rotation.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <LockKeyhole className="h-5 w-5 text-[#0b3b2e]" />
                <p className="mt-3 font-semibold text-slate-900">Private sessions</p>
                <p className="mt-1 text-sm text-slate-600">Refresh tokens stay in HttpOnly cookies.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <BadgeCheck className="h-5 w-5 text-[#0b3b2e]" />
                <p className="mt-3 font-semibold text-slate-900">Verified accounts</p>
                <p className="mt-1 text-sm text-slate-600">OTP verification helps reduce fake signups.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <CircleAlert className="h-5 w-5 text-[#0b3b2e]" />
                <p className="mt-3 font-semibold text-slate-900">Clear recovery</p>
                <p className="mt-1 text-sm text-slate-600">Expired sessions are handled with clear prompts.</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Trust signals
            </p>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                Secure login flow with access token refresh
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                Email OTP verification before account access
              </li>
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                Session-expiry messaging that does not hide what happened
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
