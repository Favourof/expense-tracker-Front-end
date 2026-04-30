import { useEffect, useState } from "react";
import { Download, RefreshCw, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRegisterSW } from "virtual:pwa-register/react";

const PwaPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisterError(error) {
      console.error("PWA registration failed:", error);
    },
  });

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    const mobile = window.matchMedia("(max-width: 640px)").matches;

    setIsStandalone(standalone);
    setIsMobile(mobile);

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const handleRefresh = async () => {
    await updateServiceWorker();
    setNeedRefresh(false);
  };

  const handleClose = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
    setDeferredPrompt(null);
  };

  const isInstallPrompt = Boolean(deferredPrompt && !isStandalone);
  const isMobileInstallPrompt = isInstallPrompt && isMobile;

  const banner = needRefresh
    ? {
        badge: "Update available",
        title: "A new version of AequoPath is ready.",
        message: "Refresh once to keep the latest improvements and fixes.",
        actionLabel: "Refresh now",
        actionIcon: RefreshCw,
        onAction: handleRefresh,
        tone: "emerald",
      }
    : isInstallPrompt
    ? {
        badge: "Install app",
        title: "Install AequoPath for quicker access.",
        message:
          "Save it to your home screen for a smoother, app-like experience.",
        actionLabel: "Install app",
        actionIcon: Download,
        onAction: handleInstall,
        tone: "amber",
      }
    : offlineReady
    ? {
        badge: "Ready offline",
        title: "AequoPath is ready to use offline.",
        message: "You can open the app even when your connection drops.",
        actionLabel: "Dismiss",
        actionIcon: Sparkles,
        onAction: handleClose,
        tone: "success",
      }
    : null;

  if (!banner) {
    return null;
  }

  const ActionIcon = banner.actionIcon;
  const containerPosition = isMobileInstallPrompt
    ? "bottom-4 top-auto"
    : "top-4";
  const motionStart = isMobileInstallPrompt
    ? { opacity: 0, y: 18, scale: 0.98 }
    : { opacity: 0, y: -16, scale: 0.98 };
  const motionExit = isMobileInstallPrompt
    ? { opacity: 0, y: 12, scale: 0.98 }
    : { opacity: 0, y: -10, scale: 0.98 };
  const shellTone =
    banner.tone === "amber"
      ? "border-[#f48451]/25 bg-white/96"
      : banner.tone === "emerald"
      ? "border-[#1a3c2f]/15 bg-white/96"
      : "border-emerald-200 bg-emerald-50/90";
  const iconTone =
    banner.tone === "amber"
      ? "bg-[#f48451]/15 text-[#f48451]"
      : banner.tone === "emerald"
      ? "bg-[#1a3c2f]/12 text-[#1a3c2f]"
      : "bg-emerald-100 text-emerald-700";
  const accentBar =
    banner.tone === "amber"
      ? "from-[#1a3c2f] via-[#2d5a46] to-[#f48451]"
      : banner.tone === "emerald"
      ? "from-[#1a3c2f] via-[#2d5a46] to-[#5d8d73]"
      : "from-emerald-500 via-emerald-400 to-emerald-300";

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed left-1/2 ${containerPosition} z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2`}
        initial={motionStart}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={motionExit}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div
          className={`overflow-hidden rounded-2xl border shadow-[0_24px_80px_rgba(10,46,36,0.16)] backdrop-blur ${shellTone}`}
        >
          <div className={`h-1 w-full bg-gradient-to-r ${accentBar}`} />
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-full ${iconTone}`}>
                {banner.tone === "amber" ? (
                  <Download className="h-5 w-5" />
                ) : banner.tone === "emerald" ? (
                  <RefreshCw className="h-5 w-5" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <span className="brand-name">Aequo</span>
                    <span className="brand-suffix">Path</span>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {banner.badge}
                  </p>
                  <h3
                    className={`mt-1 text-sm font-semibold ${
                      banner.tone === "success" ? "text-emerald-950" : "text-slate-900"
                    }`}
                  >
                    {banner.title}
                  </h3>
                  <p
                    className={`mt-1 text-sm leading-6 ${
                      banner.tone === "success" ? "text-emerald-800" : "text-slate-600"
                    }`}
                  >
                    {banner.message}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 sm:mt-0 sm:shrink-0">
                  <button
                    type="button"
                    onClick={banner.onAction}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a3c2f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#143126]"
                  >
                    <ActionIcon className="h-4 w-4" />
                    {banner.actionLabel}
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PwaPrompt;
