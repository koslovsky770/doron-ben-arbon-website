import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { footer, site } from "@/data/site";

export function Footer() {
  return (
    <footer id="contact" className="relative z-10 border-t border-ink-10 bg-ink-13">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-4 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[280px_1fr_1fr_1.2fr] lg:gap-10 lg:px-16 lg:py-[72px]">
        {/* brand + quick actions (the template's newsletter slot — the brief asks
            for no contact form, so it holds the two conversion actions instead) */}
        <div>
          <Logo />
          <p className="mt-5 max-w-[260px] text-sm leading-[1.6] text-ink-7">
            תיווך מסחרי, שיווק פרויקטים ומגרשים בבני ברק. ליווי אישי עד קבלת המפתח.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={site.phoneHref}
              className="relative flex h-[52px] items-center justify-center gap-2.5 rounded-lg bg-brand px-6 text-base font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 btn-inner-brand"
            >
              <Phone className="h-[18px] w-[18px]" aria-hidden />
              {site.phone}
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex h-[52px] items-center justify-center gap-2.5 rounded-lg bg-ink-12 px-6 text-base font-medium text-ink-4 transition-colors hover:bg-ink-11 btn-inner-dark"
            >
              <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
              וואטסאפ
            </a>
          </div>
        </div>

        {footer.columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-lg font-medium text-ink-7">{column.title}</h2>
            <ul className="mt-6 flex flex-col gap-4">
              {column.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-base text-ink-4 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-lg font-medium text-ink-7">{footer.contactTitle}</h2>
          <ul className="mt-6 flex flex-col gap-4 text-base text-ink-4">
            <li>
              <a
                href={site.phoneHref}
                className="flex items-center gap-2.5 transition-colors hover:text-brand"
              >
                <Phone className="h-[18px] w-[18px] shrink-0 text-ink-7" aria-hidden />
                <span className="ltr">{site.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 transition-colors hover:text-brand"
              >
                <MessageCircle className="h-[18px] w-[18px] shrink-0 text-ink-7" aria-hidden />
                וואטסאפ
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2.5 transition-colors hover:text-brand"
              >
                <Mail className="h-[18px] w-[18px] shrink-0 text-ink-7" aria-hidden />
                <span className="ltr">{site.email}</span>
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="h-[18px] w-[18px] shrink-0 text-ink-7" aria-hidden />
              {site.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-10 bg-ink-12">
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-8 lg:px-16">
          <p className="text-sm text-ink-7">{footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
