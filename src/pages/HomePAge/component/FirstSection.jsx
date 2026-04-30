import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";


const FirstSection = () => {
  const { accessToken } = useAuth();
  const isLoggedIn = Boolean(accessToken);
  return (
    <header className="border-b border-slate-200 bg-[#f7f4ee]">
      <div className="bg-[#0b3b2e] text-white">
        <div className="container flex items-center justify-between py-2 text-sm">
          <p className="font-medium">Built for everyday money tracking in Nigeria.</p>
          <span className="hidden sm:inline">Bank syncs and smarter automation are on the way</span>
        </div>
      </div>
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          {/* <div className="h-8 w-8 rounded-lg bg-[#f47d4a]" /> */}
          <img className="h-8 w-8" src="/icons/icon.svg" alt="AequoPath" />
          <span className="text-lg leading-none">
            <span className="brand-name">Aequo</span>
            <span className="brand-suffix">Path</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <a href="#features" className="hover:text-slate-900">Features</a>
          <a href="#how" className="hover:text-slate-900">How it works</a>
          <a href="#integrations" className="hover:text-slate-900">Integrations</a>
        </nav>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Button asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/logIn">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default FirstSection;
