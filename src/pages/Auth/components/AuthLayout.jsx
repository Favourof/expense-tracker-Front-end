import { ArrowRight, CheckCircle2, ShieldCheck, Wallet2, TrendingUp } from "lucide-react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const iconMap = [Wallet2, TrendingUp, ShieldCheck];

const AuthLayout = ({
  badge,
  title,
  subtitle,
  highlights,
  stats,
  footerPrompt,
  footerLinkText,
  footerLinkTo,
  footerHint,
  children,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(20,83,45,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(244,125,74,0.2),_transparent_28%),linear-gradient(180deg,_#f8faf7_0%,_#f4efe7_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -left-24 top-24 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr,0.95fr] lg:px-8">
        <section className="space-y-8 text-slate-900">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur">
            <ShieldCheck className="h-4 w-4" />
            {badge}
          </div>

          <div className="max-w-2xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              {subtitle}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = iconMap[index % iconMap.length];
              return (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-slate-200/80 bg-slate-950/95 p-4 text-white shadow-xl shadow-slate-900/10"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-300">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {footerHint}
            </div>
            <Link
              to={footerLinkTo}
              className="inline-flex items-center gap-2 rounded-full bg-[#0b3b2e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a3429]"
            >
              {footerLinkText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-6">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/90 p-4 sm:p-6">
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  {badge}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950 sm:text-3xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
              </div>
              {children}
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            {footerPrompt}{" "}
            <Link to={footerLinkTo} className="font-semibold text-[#0b3b2e] hover:underline">
              {footerLinkText}
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  badge: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  footerPrompt: PropTypes.string.isRequired,
  footerLinkText: PropTypes.string.isRequired,
  footerLinkTo: PropTypes.string.isRequired,
  footerHint: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
