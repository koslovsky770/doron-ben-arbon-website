import { useEffect, useState } from "react";
import { consentBanner } from "@/data/site";

const STORAGE_KEY = "doron-privacy-consent";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private mode, etc.) — skip rather than block the page
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore — worst case the banner reappears next visit
    }
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-10 bg-ink-12/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:px-8 lg:px-16">
        <p className="text-sm leading-[1.6] text-ink-6">
          {consentBanner.text}{" "}
          <a
            href={consentBanner.linkHref}
            className="underline underline-offset-4 transition-colors hover:text-brand"
          >
            {consentBanner.linkLabel}
          </a>
        </p>
        <button
          type="button"
          onClick={accept}
          className="relative shrink-0 rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 btn-inner-brand"
        >
          {consentBanner.acceptLabel}
        </button>
      </div>
    </div>
  );
}
