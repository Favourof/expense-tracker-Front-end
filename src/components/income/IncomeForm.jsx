import { useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/shared/api/request";
import { useFinance } from "@/context/FinanceContext";

const IncomeForm = ({ onSuccess, onClose, className = "" }) => {
  const [formData, setFormData] = useState({ amount: "", source: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { onIncomeMutated } = useFinance();
  const sourcePresets = ["Salary", "Trade", "Freelance", "Gift", "Business"];
  const sourceRef = useRef(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetSelect = (preset) => {
    if (preset === "Other") {
      setFormData((prev) => ({ ...prev, source: "" }));
      setTimeout(() => sourceRef.current?.focus(), 0);
      return;
    }
    setFormData((prev) => ({ ...prev, source: preset }));
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.source) {
      toast({
        title: "Missing fields",
        description: "Please add an amount and a source.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post("/income/addincome", {
        amount: Number(formData.amount),
        source: formData.source,
      });
      await onIncomeMutated();
      toast({ title: "Success", description: "Income added successfully." });
      setFormData({ amount: "", source: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Unable to add income.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleAddIncome} className={className}>
      <div>
        <label className="text-xs font-semibold text-slate-500">Amount</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleFormChange}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
          placeholder="e.g. 25000"
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500">Source</label>
        <input
          type="text"
          name="source"
          value={formData.source}
          onChange={handleFormChange}
          ref={sourceRef}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
          placeholder="Salary, trade, freelance"
          required
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {sourcePresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              {preset}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handlePresetSelect("Other")}
            className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            Other
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {isSubmitting ? "Saving..." : "Save income"}
        </button>
      </div>
    </form>
  );
};

export default IncomeForm;
