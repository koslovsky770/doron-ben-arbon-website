import type { ReactNode } from "react";

/**
 * Renders `**bold**` markers as <strong>. Lets copy in site.ts carry light
 * emphasis without switching every paragraph to dangerouslySetInnerHTML —
 * also the exact notation the on-site visual editor's "copy to Claude"
 * summary already uses for bold, so edited copy pastes back in as-is.
 */
export function renderBold(text: string): ReactNode {
  const parts = text.split("**");
  if (parts.length === 1) return text;
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}
