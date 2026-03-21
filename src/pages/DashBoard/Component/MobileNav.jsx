import { NavLink } from "react-router-dom";
import { Home, Wallet, TrendingUp, PlusCircle } from "lucide-react";
import { useState } from "react";
import IncomeBottomSheet from "@/components/income/IncomeBottomSheet";
import ExpenseBottomSheet from "@/components/expense/ExpenseBottomSheet";

const MobileNav = () => {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-2 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-semibold ${
                isActive ? "text-[#0b3b2e]" : "text-slate-500"
              }`
            }
          >
            <Home className="h-5 w-5" />
            Home
          </NavLink>
          <NavLink
            to="/dashboard/income"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-semibold ${
                isActive ? "text-[#0b3b2e]" : "text-slate-500"
              }`
            }
          >
            <TrendingUp className="h-5 w-5" />
            Income
          </NavLink>
          <button
            type="button"
            onClick={() => setShowAdd((prev) => !prev)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f47d4a] text-white shadow-lg"
          >
            <PlusCircle className="h-6 w-6" />
          </button>
          <NavLink
            to="/dashboard/myexpense"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-semibold ${
                isActive ? "text-[#0b3b2e]" : "text-slate-500"
              }`
            }
          >
            <Wallet className="h-5 w-5" />
            Expense
          </NavLink>
          <NavLink
            to="/dashboard/addExpense"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-semibold ${
                isActive ? "text-[#0b3b2e]" : "text-slate-500"
              }`
            }
          >
            <Wallet className="h-5 w-5" />
            Manage
          </NavLink>
        </div>
      </nav>

      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-20 lg:hidden"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Quick add
            </p>
            <div className="mt-3 grid gap-2">
              <IncomeBottomSheet
                triggerLabel="Add income"
                triggerClassName="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                onSuccess={() => setShowAdd(false)}
              />
              <ExpenseBottomSheet
                triggerLabel="Add expense"
                triggerClassName="w-full rounded-xl bg-[#f47d4a] px-3 py-2 text-sm font-semibold text-white hover:bg-[#e56f3d]"
                onSuccess={() => setShowAdd(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
