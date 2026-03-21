import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEnvelope, FaInfoCircle, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard, MdOutlineInsights } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { useAuth } from "@/context/AuthContext";
import IncomeBottomSheet from "@/components/income/IncomeBottomSheet";
import ExpenseBottomSheet from "@/components/expense/ExpenseBottomSheet";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdDashboard className="h-5 w-5" /> },
  { name: "Income", path: "income", icon: <MdOutlineInsights className="h-5 w-5" /> },
  { name: "Manage Expense", path: "addExpense", icon: <FaEnvelope className="h-5 w-5" /> },
  { name: "My Expense", path: "myexpense", icon: <GiExpense className="h-5 w-5" /> },
  { name: "Review", path: "review", icon: <FaInfoCircle className="h-5 w-5" /> },
];

const Navigation = () => {
  const navigate = useNavigate();
  const { logout, currentUser, fetchCurrentUser, isUserLoading } = useAuth();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleLogOut = () => {
    logout();
    localStorage.removeItem("currency");
    localStorage.removeItem("monthlyIncome");
    localStorage.removeItem("monthlyExpense");
    localStorage.removeItem("cov");
    navigate("/");
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-900">
              {isUserLoading ? "Loading..." : currentUser?.firstName || "Hi there"}
            </p>
            <p className="text-xs text-slate-500">
              {isUserLoading ? "Fetching profile" : "Welcome back"}
            </p>
          </div>
          {isUserLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          ) : (
            <img
              src={currentUser?.image}
              alt={currentUser?.firstName || "User avatar"}
              className="h-9 w-9 rounded-full object-cover"
            />
          )}
        </div>
        <div className="h-6 w-6" />
      </div>

      <aside
        className="hidden w-72 border-r border-slate-200 bg-white px-5 pb-6 pt-6 shadow-lg lg:sticky lg:top-0 lg:block lg:h-screen lg:overflow-y-auto"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#f47d4a]" />
          <div>
            <p className="text-base font-semibold text-slate-900">ExpenseTracker</p>
            <p className="text-xs text-slate-500">Nigeria-first money flow</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            {isUserLoading ? (
              <div className="h-12 w-12 animate-pulse rounded-full bg-slate-200" />
            ) : (
              <img
                src={currentUser?.image}
                alt={currentUser?.firstName || "User avatar"}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {isUserLoading ? "Loading..." : currentUser?.firstName || "Account"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {isUserLoading ? "Fetching details" : currentUser?.email || "Active member"}
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-white px-3 py-2 text-xs text-slate-600">
            Verified profile. Keep your budgets up to date.
          </div>
        </div>

        <nav className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Overview</p>
          <ul className="mt-3 space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#0b3b2e] text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                  end
                  onClick={() => setIsMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? "text-white" : "text-slate-500"}>
                        {item.icon}
                      </span>
                      {item.name}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Quick actions</p>
          <p className="mt-1 text-xs text-slate-500">Log income or expense faster.</p>
          <div className="mt-3 flex gap-2">
            <IncomeBottomSheet
              triggerLabel="Add income"
              triggerClassName="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              onSuccess={fetchCurrentUser}
            />
            <ExpenseBottomSheet
              triggerLabel="Add expense"
              triggerClassName="flex-1 rounded-lg bg-[#f47d4a] px-3 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d]"
            />
          </div>
        </div>

        <button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={handleLogOut}
        >
          <FaSignOutAlt className="h-4 w-4" /> Log out
        </button>
      </aside>

    </div>
  );
};

export default Navigation;
