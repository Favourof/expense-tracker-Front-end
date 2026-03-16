import React from "react";

const FooterSection = () => {
  return (
    <footer className="bg-white py-10">
      <div className="container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-lg font-semibold">ExpenseTracker</div>
          <p className="mt-2 text-sm text-slate-600">Built for clarity, designed for growth.</p>
        </div>
        <div className="text-sm text-slate-600">© 2026 ExpenseTracker. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default FooterSection;
