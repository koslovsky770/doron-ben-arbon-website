import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { navLinks, site } from "@/data/site";

export function Navbar({ current = "/" }: { current?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-ink-10 transition-colors duration-300 ${
        scrolled ? "bg-ink-13/90 backdrop-blur-md" : "bg-ink-13"
      }`}
    >
      <nav className="mx-auto flex h-[84px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:h-[112px] lg:px-16">
        <Logo size="lg" />

        {/* desktop links */}
        <ul className="hidden items-center gap-[18px] xl:flex xl:gap-[30px]">
          {navLinks.map((link) => {
            const active = link.href === current;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "flex items-center justify-center rounded-lg border border-ink-10 bg-ink-12 px-6 py-4 text-base font-medium text-ink-4"
                      : "whitespace-nowrap text-base font-medium text-ink-4 transition-colors hover:text-brand"
                  }
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={site.phoneHref}
            className="relative hidden items-center justify-center gap-2 rounded-lg bg-ink-11 px-6 py-4 text-base font-medium text-ink-4 transition-colors hover:bg-ink-10 sm:flex btn-inner-dark"
          >
            <Phone className="h-4 w-4" aria-hidden />
            צור קשר
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-ink-10 bg-ink-12 text-ink-4 xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-x-0 top-[84px] bottom-0 z-50 overflow-y-auto border-t border-ink-10 bg-ink-13 px-4 pb-10 pt-6 xl:hidden">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg border px-5 py-4 text-lg font-medium transition-colors ${
                    link.href === current
                      ? "border-ink-10 bg-ink-12 text-ink-4"
                      : "border-transparent text-ink-6 hover:border-ink-10 hover:bg-ink-12"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href={site.phoneHref}
              className="relative flex items-center justify-center rounded-lg bg-brand px-6 py-4 text-base font-bold text-white btn-inner-brand"
            >
              התקשרו עכשיו
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center rounded-lg bg-ink-11 px-6 py-4 text-base font-medium text-ink-4 btn-inner-dark"
            >
              וואטסאפ
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
