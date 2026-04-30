import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import { useOTP } from "../hooks/useOTP";
import AuthLayout from "../../components/AuthLayout";
import { ShieldCheck, Smartphone, TimerReset } from "lucide-react";

const FormComp = () => {
  const [value, setValue] = useState("");
  const { handleOtp, isLoading } = useOTP();

  return (
    <AuthLayout
      badge="Verify your account"
      title="Check your inbox"
      subtitle="Enter the one-time password we sent to your email to activate your account."
      highlights={[
        {
          title: "Quick access",
          description: "Your verification step is designed to feel fast and easy.",
        },
        {
          title: "Secure step",
          description: "Keeps account setup protected before you enter the dashboard.",
        },
        {
          title: "Simple retry",
          description: "If the code expires, you can request a new one from email.",
        },
      ]}
      stats={[
        {
          label: "Digits",
          value: "5",
          description: "Enter the code exactly as shown.",
        },
        {
          label: "Security",
          value: "OTP",
          description: "A quick identity check before login.",
        },
        {
          label: "Support",
          value: "Email",
          description: "The code is sent to your registered inbox.",
        },
      ]}
      footerHint="Need to use another account?"
      footerLinkText="Go back"
      footerLinkTo="/signup"
      footerPrompt="Wrong email?"
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-4 text-sm text-emerald-900">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-white p-2 text-emerald-700 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold">Verification code sent</p>
              <p className="mt-1 text-sm text-emerald-800">
                Please check your email and type the 5-digit code below.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">One-time password</p>
          <p className="mt-1 text-sm text-slate-500">
            Enter the code exactly as it appears in your inbox.
          </p>

          <div className="mt-5 flex justify-center">
            <InputOTP
              maxLength={5}
              value={value}
              onChange={(nextValue) => setValue(nextValue)}
              containerClassName="gap-2"
              className="disabled:cursor-not-allowed"
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot
                  index={0}
                  className="h-14 w-12 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-900 shadow-sm transition focus-within:border-emerald-400"
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 w-12 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-900 shadow-sm transition focus-within:border-emerald-400"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 w-12 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-900 shadow-sm transition focus-within:border-emerald-400"
                />
                <InputOTPSlot
                  index={3}
                  className="h-14 w-12 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-900 shadow-sm transition focus-within:border-emerald-400"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 w-12 rounded-2xl border border-slate-200 bg-slate-50 text-lg font-semibold text-slate-900 shadow-sm transition focus-within:border-emerald-400"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Works well on mobile keyboards
            </span>
            <span className="inline-flex items-center gap-2">
              <TimerReset className="h-4 w-4" />
              Codes expire after a short time
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {value === "" ? (
              <>Enter your one-time password.</>
            ) : (
              <>You entered: {value}</>
            )}
          </div>

          <Button
            className="mt-5 h-12 w-full rounded-2xl bg-gradient-to-r from-[#0b3b2e] to-[#145a45] text-base font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:from-[#0a3429] hover:to-[#124d3b]"
            onClick={() => handleOtp(value)}
            disabled={isLoading}
            type="Submit"
          >
            {isLoading ? "Verifying..." : "Verify code"}
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default FormComp;
