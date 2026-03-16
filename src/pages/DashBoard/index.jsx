import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Navigation from './Component/Navigation';

const Layout = ({ children }) => {
  const { sessionExpired, clearSessionExpired } = useAuth();
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f4ee] lg:flex-row">
      <Navigation />
      <div className="flex-grow overflow-auto pb-10 pt-4 lg:pt-6">
        {sessionExpired && (
          <div className="mx-4 mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900 lg:mx-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>
                Your session expired. Please log in again to keep tracking your budget.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearSessionExpired}
                  className="rounded-md border border-orange-300 px-3 py-1 text-xs font-semibold text-orange-900 hover:bg-orange-100"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="px-4 pb-6 lg:px-6">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
