import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const HeroPage = () => {
  const { accessToken } = useAuth();
  const isLoggedIn = Boolean(accessToken);

  return (
    <section className="relative overflow-hidden bg-[#f7f4ee]">
      <div className="absolute -top-24 right-[-12rem] h-[28rem] w-[28rem] rounded-full bg-[#f47d4a]/20 blur-3xl" />
      <div className="absolute -bottom-32 left-[-10rem] h-[24rem] w-[24rem] rounded-full bg-[#2a9d8f]/20 blur-3xl" />

      <div className="container grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            Smart budget tracking for real life
          </p>
          <h1 className="font-display text-4xl leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Track spending. Grow savings. Feel in control.
          </h1>
          <p className="text-lg text-slate-700">
            A clean, Nigeria-first expense tracker that turns daily spending into weekly clarity.
            Manual today, bank-connected tomorrow.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link to={isLoggedIn ? "/dashboard" : "/logIn"}>Start tracking</Link>
            </Button>
            <Button variant="outline" asChild>
              <a href="#features">See features</a>
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-6 text-sm text-slate-700">
            <div className="rounded-xl bg-white/80 p-3">
              <div className="text-xl font-semibold text-slate-900">2 min</div>
              <div>to log a day</div>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <div className="text-xl font-semibold text-slate-900">7 days</div>
              <div>to see trends</div>
            </div>
            <div className="rounded-xl bg-white/80 p-3">
              <div className="text-xl font-semibold text-slate-900">0 guess</div>
              <div>on cash flow</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
              <span>This week</span>
              <span className="font-medium text-slate-900">NGN 42,500</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div className="h-2 w-2/3 rounded-full bg-[#2a9d8f]" />
            </div>
            <div className="mt-4 rounded-xl bg-[#f7f4ee] p-4">
              <video
                src="https://res.cloudinary.com/dqwkg8qcx/video/upload/v1717159210/sbseg-en_row-Reports_iqbwmr.mp4"
                autoPlay
                loop
                muted
                className="w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroPage;
