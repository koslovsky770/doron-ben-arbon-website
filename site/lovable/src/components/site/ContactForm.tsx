import { useState, type FormEvent } from "react";
import { ChevronDown, Mail, MessageCircle, Phone, User } from "lucide-react";
import { contactPage } from "@/data/site";

const WHATSAPP_NUMBER = "972544980159";

const fieldRow =
  "flex items-center gap-2 rounded-lg border border-ink-10 bg-ink-13 px-4 py-4 text-base text-ink-4";
const fieldInput =
  "w-full min-w-0 flex-1 bg-transparent text-base text-ink-4 placeholder:text-ink-6 focus:outline-none";

export function ContactForm() {
  const { form } = contactPage;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState(form.interestOptions[0].value);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  // מוחלף בקריאה ל-Resend דרך site/preview/api/send-contact.php כשהאתר
  // רץ על שרת עם PHP (cPanel). כל עוד אין endpoint פעיל (למשל ב-GitHub
  // Pages, שלא מריץ PHP) הבקשה נכשלת בשקט והטופס נופל חזרה לפתיחת וואטסאפ.
  const openWhatsappFallback = () => {
    const interestLabel =
      form.interestOptions.find((option) => option.value === interest)?.label ?? interest;

    const lines = [
      "היי דורון, השארתי פרטים דרך האתר:",
      `שם: ${name}`,
      `טלפון: ${phone}`,
      email && `אימייל: ${email}`,
      `תחום עניין: ${interestLabel}`,
      `הודעה: ${message || "-"}`,
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const interestLabel =
      form.interestOptions.find((option) => option.value === interest)?.label ?? interest;

    setStatus("sending");
    try {
      const res = await fetch("/api/send-contact.php", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, phone, email, interest: interestLabel, message }),
      });
      // A static host with no PHP (e.g. GitHub Pages) still answers 200 with
      // the raw file — only a real { ok: true } JSON body counts as success.
      const data = await res.json().catch(() => null);
      if (!res.ok || !data || data.ok !== true) throw new Error("send failed");
      setStatus("sent");
    } catch {
      setStatus("idle");
      openWhatsappFallback();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-6 rounded-2xl border border-ink-10 bg-ink-13 p-6 sm:gap-8 sm:p-8"
    >
      <h2 className="font-display text-d3 font-bold text-ink-2">{form.title}</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className={fieldRow}>
          <User className="h-5 w-5 shrink-0 text-ink-7" aria-hidden />
          <input
            type="text"
            required
            placeholder={form.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldInput}
          />
        </label>

        <label className={fieldRow}>
          <Phone className="h-5 w-5 shrink-0 text-ink-7" aria-hidden />
          <input
            type="tel"
            required
            placeholder={form.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${fieldInput} ltr text-right`}
          />
        </label>

        <label className={fieldRow}>
          <Mail className="h-5 w-5 shrink-0 text-ink-7" aria-hidden />
          <input
            type="email"
            placeholder={form.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${fieldInput} ltr text-right`}
          />
        </label>
      </div>

      <label className={fieldRow}>
        <span className="shrink-0 text-ink-7">{form.interestLabel}</span>
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className={`${fieldInput} cursor-pointer appearance-none`}
        >
          {form.interestOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-ink-13">
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="h-5 w-5 shrink-0 text-ink-7" aria-hidden />
      </label>

      <label className={`${fieldRow} h-[170px] items-start`}>
        <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-ink-7" aria-hidden />
        <textarea
          placeholder={form.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${fieldInput} h-full resize-none`}
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="relative inline-flex items-center gap-2.5 self-start rounded-lg bg-brand px-6 py-4 text-base font-bold text-white transition-transform duration-200 hover:-translate-y-0.5 btn-inner-brand disabled:opacity-60"
      >
        <MessageCircle className="h-[18px] w-[18px]" aria-hidden />
        {status === "sending" ? "שולח…" : status === "sent" ? "נשלח, תודה!" : form.submitLabel}
      </button>
    </form>
  );
}
