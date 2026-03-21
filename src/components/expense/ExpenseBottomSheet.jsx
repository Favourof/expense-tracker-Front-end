import { useState } from "react";
import ExpenseQuickForm from "./ExpenseQuickForm";

const ExpenseBottomSheet = ({
  triggerLabel = "Add expense",
  onSuccess,
  triggerClassName = "",
}) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) onSuccess();
  };

  return (
    <>
      <button
        className={triggerClassName}
        onClick={() => setOpen(true)}
        type="button"
      >
        {triggerLabel}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Add expense</h3>
              <button
                className="text-xs font-semibold text-slate-500"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <ExpenseQuickForm onSuccess={handleSuccess} onClose={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ExpenseBottomSheet;
