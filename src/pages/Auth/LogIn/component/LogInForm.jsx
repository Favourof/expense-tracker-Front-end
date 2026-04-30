import { Form } from "@/components/ui/form";
import { useLogIn } from "../hooks/useLogIn";
import { Button } from "@/components/ui/button";
import google from "/src/assets/google.png";
import facebook from "/src/assets/facebook.png";
import { inputs } from "../utils/inputs";
import GenericFormInputs from "@/shared/GenericFormInputs";
import AuthLayout from "../../components/AuthLayout";
import { ShieldCheck } from "lucide-react";

const LogInForm = () => {
  const { onSubmit, form, isLoading } = useLogIn();
  return (
    <AuthLayout
      badge="Secure access"
      title="Welcome back"
      subtitle="Sign in to review your income, expenses, and savings in a calmer, cleaner workspace."
      highlights={[
        {
          title: "Fast overview",
          description: "See the money flow that matters most without digging through clutter.",
        },
        {
          title: "Safer sessions",
          description: "Built around refresh tokens, session restoration, and clear feedback.",
        },
        {
          title: "Budget focus",
          description: "Stay centered on the numbers that help you make better decisions.",
        },
      ]}
      stats={[
        {
          label: "Tracking",
          value: "24/7",
          description: "Keep your budget moving any time.",
        },
        {
          label: "Insights",
          value: "Weekly",
          description: "Understand your pattern at a glance.",
        },
        {
          label: "Security",
          value: "JWT",
          description: "Protected with token refresh flow.",
        },
      ]}
      footerHint="New to AequoPath?"
      footerLinkText="Create an account"
      footerLinkTo="/signup"
      footerPrompt="Need a new start?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-white p-2 text-emerald-700 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold">Good to see you again</p>
                <p className="mt-1 text-sm text-emerald-800">
                  Your dashboard is ready once you sign in.
                </p>
              </div>
            </div>
          </div>

          {inputs.map((elem, i) => (
            <GenericFormInputs key={i + elem.name} form={form} {...elem} />
          ))}

          <p className="text-sm text-slate-500">
            Your password must have at least 6 characters.
          </p>

          <Button
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#0b3b2e] to-[#145a45] text-base font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:from-[#0a3429] hover:to-[#124d3b]"
            disabled={isLoading}
            type="Submit"
          >
            {isLoading ? "Signing in..." : "Log In"}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              or continue with
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <img src={google} alt="" className="h-5 w-5" />
              Google
            </button>
            <button
              type="button"
              className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              <img src={facebook} alt="" className="h-5 w-5" />
              Facebook
            </button>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default LogInForm;
