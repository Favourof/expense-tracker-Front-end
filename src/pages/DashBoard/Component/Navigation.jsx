import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEnvelope, FaInfoCircle, FaBars, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard, MdOutlineInsights } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { GiExpense } from "react-icons/gi";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser } from "@/features/AuthPage/AuthSlice";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <MdDashboard className="h-5 w-5" /> },
  { name: "Income", path: "income", icon: <MdOutlineInsights className="h-5 w-5" /> },
  { name: "Add Expense", path: "addExpense", icon: <FaEnvelope className="h-5 w-5" /> },
  { name: "My Expense", path: "myexpense", icon: <GiExpense className="h-5 w-5" /> },
  { name: "Review", path: "review", icon: <FaInfoCircle className="h-5 w-5" /> },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    if (refresh) {
      dispatch(getCurrentUser());
      setRefresh(false);
    }
  }, [dispatch, refresh]);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogOut = () => {
    logout();
    localStorage.removeItem("currency");
    localStorage.removeItem("monthlyIncome");
    localStorage.removeItem("monthlyExpense");
    localStorage.removeItem("cov");
    setRefresh(true);
    navigate("/");
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
        <button onClick={toggleMenu} className="text-slate-700">
          <FaBars className="h-6 w-6" />
        </button>
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="text-right text-sm">
            <p className="font-semibold text-slate-900">
              {currentUser?.firstName || "Hi there"}
            </p>
            <p className="text-xs text-slate-500">Welcome back</p>
          </div>
          <img
            src={currentUser?.image}
            alt={currentUser?.firstName || "User avatar"}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>
        <div className="h-6 w-6" />
      </div>

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 border-r border-slate-200 bg-white px-5 pb-6 pt-6 shadow-lg transition-transform sm:w-72 lg:static lg:translate-x-0 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
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
            <img
              src={currentUser?.image}
              alt={currentUser?.firstName || "User avatar"}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {currentUser?.firstName || "Account"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {currentUser?.email || "Active member"}
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
            <button
              onClick={() => navigate("/dashboard/income")}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Add income
            </button>
            <button
              onClick={() => navigate("/dashboard/addExpense")}
              className="flex-1 rounded-lg bg-[#f47d4a] px-3 py-2 text-xs font-semibold text-white hover:bg-[#e56f3d]"
            >
              Add expense
            </button>
          </div>
        </div>

        <button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          onClick={handleLogOut}
        >
          <FaSignOutAlt className="h-4 w-4" /> Log out
        </button>
      </aside>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Navigation;
