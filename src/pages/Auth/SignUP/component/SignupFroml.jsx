
import { Form } from "@/components/ui/form";
import { useSignUp } from "../hooks/useSignUP";
import { Button } from "@/components/ui/button";
import google from "/src/assets/google.png";
import facebook from "/src/assets/facebook.png";
import { inputs } from "../utils/inputs";
import GenericFormInputs from "@/shared/GenericFormInputs";
import AuthLayout from "../../components/AuthLayout";
import { Camera } from "lucide-react";

const SignupForm = () => {
  const { onSubmit, form, isLoading, handleChange, imageSrc } = useSignUp();
  return (
    <AuthLayout
      badge="Create your space"
      title="Set up your account"
      subtitle="Join the tracker and keep your spending, savings, and goals in one focused place."
      highlights={[
        {
          title: "Personalized budgets",
          description: "Organize income and expenses with categories that match real life.",
        },
        {
          title: "Mobile friendly",
          description: "Designed to feel smooth on smaller screens and quick on the go.",
        },
        {
          title: "Privacy first",
          description: "Session handling stays behind the scenes while you focus on numbers.",
        },
      ]}
      stats={[
        {
          label: "Onboarding",
          value: "2 min",
          description: "Quick signup and OTP verification.",
        },
        {
          label: "Setup",
          value: "Simple",
          description: "Upload a picture and get started fast.",
        },
        {
          label: "Support",
          value: "Always",
          description: "Designed to be clear and easy to use.",
        },
      ]}
      footerHint="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/logIn"
      footerPrompt="Ready to return?"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Profile picture</p>
                <p className="mt-1 text-sm text-slate-500">
                  Add a photo so your dashboard feels more personal.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {imageSrc ? (
                    <img src={imageSrc} className="h-full w-full object-cover" alt="Profile preview" />
                  ) : (
                    <Camera className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <label className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                  Choose file
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleChange}
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {inputs.map((elem, i) => (
              <GenericFormInputs key={i + elem.name} form={form} {...elem} />
            ))}
          </div>

          <p className="text-sm text-slate-500">
            Your password must have at least 6 characters.
          </p>

          <Button
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-[#0b3b2e] to-[#145a45] text-base font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:from-[#0a3429] hover:to-[#124d3b]"
            disabled={isLoading}
            type="Submit"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
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

export default SignupForm;

