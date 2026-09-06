# פאנל ניהול לאתר דורון בן ארבון — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site owner an `/admin` panel to edit all page texts (rich formatting), testimonials, and projects (with drag-and-drop image upload) — persisted to JSON data files that the public static pages read from, with writes served by the existing local Node dev server (no external database yet).

**Architecture:** Public pages (`site/preview/*.html`) fetch content at load time from static JSON under `site/data/` (works unmodified on GitHub Pages — plain static files). The admin panel (`site/admin/index.html`) is a password-gated UI that calls a small write API added to the existing local server (`.claude/serve.mjs`), which is the only thing that can actually persist changes (GitHub Pages can't accept writes). All data access goes through one shared browser script (`site/assets/data-store.js`) so a future swap to Supabase/MySQL only touches that one file.

**Tech Stack:** Plain HTML/CSS (Tailwind CDN)/vanilla JS — no build step, no npm dependencies, matching the existing codebase. Node.js built-in `http` module for the server, Node's built-in `node:test` + `node:assert/strict` for the parts that are pure logic (no test framework dependency needed — confirmed Node v24.17.0 is installed, which has a stable built-in test runner).

**Spec:** [docs/superpowers/specs/2026-09-06-admin-panel-design.md](../specs/2026-09-06-admin-panel-design.md)

## Global Constraints

- No npm dependencies — everything runs on Node's built-ins and the browser (matches `.claude/serve.mjs`'s existing "no dependencies" comment).
- Admin password is the fixed literal string `12345`, checked both client-side (gate) and server-side (every write request) — per spec.
- Admin login state persists across visits on the same device (`localStorage`), per user's explicit choice.
- The rich-text editor toolbar (bold/italic/underline/font-family/font-size) applies to **every** editable text field (texts, testimonial quotes, project descriptions) — per user's explicit choice.
- Do **not** connect anything to Supabase or any external database in this plan — user explicitly deferred that decision. The existing paused Supabase project (`doron-ben-arbon`) is out of scope here.
- Visual output of the 4 public pages must be pixel-identical to today after wiring — this plan only changes *where the data comes from*, never the markup/classes/design.
- No automated test framework exists in this repo; use `node --test` for pure/logic-only pieces (sanitizer, JSON merge helpers, atomic write) and manual browser verification (via the Browser tool) for anything DOM/UI-related — matches the spec's own Testing section.
- The regex-based HTML sanitizer built in Task 2 is a deliberate, documented simplification (no DOM-parsing dependency) appropriate for a single trusted admin editing their own site's content — not a general-purpose UGC sanitizer.

---

## Task 1: Seed content data files

**Files:**
- Create: `site/data/content.json`
- Create: `site/data/testimonials.json`
- Create: `site/data/projects.json`
- Create: `site/data/google-reviews.json`
- Test: `site/data/data-files.test.mjs`

**Interfaces:**
- Produces: the on-disk JSON shape every later task reads/writes. `content.json` is a flat `{ [dotKey: string]: string }` map (values are HTML strings, may contain plain text with no tags). `testimonials.json` is `Array<{id, name, role, quote, featured, order}>`. `projects.json` is `Array<{id, category, title, description, location, tags: string[], image, order}>`. `google-reviews.json` is `Array<{id, initial, author, when, text}>` (read-only from the admin — no CRUD UI for this one, per spec).

- [ ] **Step 1: Create `site/data/content.json`** with this exact content (extracted 1:1 from `site/preview/index.html`, `about.html`, `commercial.html`, `testimonials.html` as they exist today):

```json
{
  "home.hero.titleStart": "מחפשים משרד או חנות ב",
  "home.hero.titleHighlight": "בני ברק",
  "home.hero.titleEnd": "?",
  "home.hero.subtitle": "העסק שלך צריך את הנכס הנכון והליווי שידאג לעסקה הנכונה.",
  "home.hero.paragraph": "דורון בן ארבון מלווה בעלי עסקים כבר למעלה מ־15 שנה בשוק הנדל״ן המסחרי בבני ברק — מאיתור הנכס הנכון, דרך המשא ומתן ועד לסגירת העסקה בתנאים הטובים ביותר.",
  "home.hero.primaryCta": "התקשרו עכשיו",
  "home.hero.secondaryCta": "וואטסאפ",
  "home.about.titleStart": "נכס נכון",
  "home.about.titleEnd": "שקט אמיתי",
  "home.about.titleSecondLine": "גם אחרי החתימה.",
  "home.about.paragraph": "במקום לרוץ בין נכסים, להתלבט אם המחיר נכון ולחשוש ממה שלא ידעתם לבדוק — אתם מקבלים ליווי מקצועי ממי שחי את השוק כבר מעל 15 שנה, מכיר את המחירים, את האזורים ואת העסקאות, ודואג שתוכלו להיכנס לעסקה בראש שקט.",
  "home.about.cta": "עוד עלינו ←",
  "home.about.stat1Value": "+15",
  "home.about.stat1Label": "שנות ניסיון בנדל״ן מסחרי",
  "home.about.stat2Value": "1:1",
  "home.about.stat2Label": "ליווי אישי לאורך כל העסקה",
  "home.about.stat3Value": "+125",
  "home.about.stat3Label": "חנויות ומשרדים שהושכרו בבני ברק",
  "home.services.title": "תיווך מסחרי - חשיבה יזמית",
  "home.services.paragraph": "אנחנו מלווים בעלי עסקים ויזמים בדרך לנכס הנכון, מתוך אחריות אמיתית לתוצאה. בוחנים התאמה, שומרים על האינטרסים שלכם ומנהלים את התהליך מתוך הבנה מסחרית עמוקה וניסיון של שנים.",
  "home.services.linkLabel": "קראו עוד…",
  "home.services.commercial.title": "תיווך מסחרי",
  "home.services.commercial.description": "חנויות, משרדים, מחסנים ושטחי מסחר בבני ברק - איתור, תמחור והשכרה או מכירה מדויקת ומהירה.",
  "home.services.projectMarketing.title": "שיווק פרויקטים",
  "home.services.projectMarketing.description": "ליווי ושיווק פרויקטים חדשים בניינים ומתחמים עבור יזמים, מוסדות ורשויות, עד לאכלוס מלא.",
  "home.services.plots.title": "מגרשים",
  "home.services.plots.description": "איתור ותיווך מגרשים לבנייה ולהשקעה, עם היכרות מלאה עם השטח והזדמנויות שלא מגיעות למודעות.",
  "home.projects.title": "פרויקטים נבחרים",
  "home.projects.paragraph": "חלק מהעסקאות שליווינו: חנויות, מחסנים, משרדים ובניינים שלמים. לכל נכס יש את הסיפור שלו, ולכל לקוח את ההתאמה הנכונה עבורו.",
  "home.projects.cta": "לכל הפרויקטים",
  "home.projects.emptyState": "עדיין לא העלינו לכאן עסקאות מקטגוריה זו. יש לנו מה לספר — דברו איתי ואשמח לעדכן במה שרלוונטי עבורכם.",
  "home.projects.emptyStateCta": "דברו איתי",
  "home.projects.cardCta": "דברו איתי על נכס דומה",
  "home.reviews.title": "ממליצים עלינו בגוגל",
  "home.reviews.count": "23 ביקורות בגוגל",
  "home.reviews.link": "לכל הביקורות בגוגל",
  "home.footer.tagline": "מתווך בין נכסים לאנשים",
  "home.footer.blurb": "תיווך מסחרי, שיווק פרויקטים ומגרשים בבני ברק. ליווי אישי עד קבלת המפתח.",
  "home.cta.titleStart": "בואו נמצא",
  "home.cta.titleEnd": "את הנכס",
  "home.cta.titleSecondLine": "הבא שלכם",
  "home.cta.button": "דברו איתי בוואטסאפ",

  "about.hero.title": "מתווך בין<br/>נכסים לאנשים.",
  "about.hero.paragraph": "במקום לרוץ בין נכסים, להתלבט אם המחיר נכון ולחשוש ממה שלא ידעתם לבדוק — אתם מקבלים ליווי מקצועי ממי שחי את השוק כבר מעל 15 שנה, מכיר את המחירים, את האזורים ואת העסקאות, ודואג שתוכלו להיכנס לעסקה בראש שקט.",
  "about.story.title": "הסיפור<br/>והערכים שלי",
  "about.story.paragraph1": "שמי דורון בן ארבון. אני מלווה בעלי עסקים ויזמים בבני ברק כבר למעלה מ־15 שנה — בתחומי התיווך המסחרי, שיווק פרויקטים ומגרשים. בס״ד ליוויתי עשרות עסקאות של מכירה, השכרה ותיווך עסקים, מהחנות הקטנה ברחוב ועד לבניינים שלמים.",
  "about.story.quote": "\"איש מדהים ויקר שמלווה אותך עד לחתימה ודואג ללקוח הכי הרבה. נאמן, אמין, דיסקרטי וישר.\"",
  "about.story.quoteAttribution": "Glory office · ביקורת בגוגל",
  "about.story.paragraph2": "במקום לרוץ בין נכסים, להתלבט אם המחיר נכון ולחשוש ממה שלא ידעתם לבדוק — אתם מקבלים ליווי מקצועי ממי שחי את השוק כבר מעל 15 שנה, מכיר את המחירים, את האזורים ואת העסקאות, ודואג שתוכלו להיכנס לעסקה בראש שקט.",
  "about.story.valuesIntro": "אלה הערכים שמובילים אותי בכל עסקה:",
  "about.story.value1Title": "בקיאות חסרת פשרות",
  "about.story.value1Text": "הכרות מעמיקה של כל מטר רבוע בבני ברק, לצורך קידום השכרה ומכירה מדויקים ומהירים.",
  "about.story.value2Title": "יושר ואמינות לפני הכל",
  "about.story.value2Text": "מבטלים עסקה בכל שלב אם משהו לא מרגיש נכון או מתאים ללקוח.",
  "about.story.value3Title": "ליווי מלא ואישי",
  "about.story.value3Text": "ייעוץ בתמחור ומימון, חיבור לאנשי מקצוע (עו״ד, אדריכלית), עד לקבלת המפתח.",
  "about.achievements.title": "בקצרה, במספרים",
  "about.achievements.paragraph": "כל מספר כאן מייצג עסקה אמיתית, לקוח מרוצה ועבודה משותפת לאורך זמן.",
  "about.achievements.stat1Value": "+15",
  "about.achievements.stat1Label": "שנות ניסיון בנדל״ן מסחרי",
  "about.achievements.stat2Value": "1:1",
  "about.achievements.stat2Label": "ליווי אישי לאורך כל העסקה",
  "about.achievements.stat3Value": "+125",
  "about.achievements.stat3Label": "חנויות ומשרדים שהושכרו",
  "about.achievements.stat4Value": "5.0",
  "about.achievements.stat4Label": "דירוג ב־23 ביקורות בגוגל",
  "about.testimonialsTitle": "מה אומרים עלינו",
  "about.cta.titleStart": "בואו נמצא",
  "about.cta.titleEnd": "את הנכס",
  "about.cta.titleSecondLine": "הבא שלכם",
  "about.cta.button": "דברו איתי בוואטסאפ",

  "commercial.hero.title": "תיווך מסחרי<br/>בבני ברק — נכון מהיסוד.",
  "commercial.hero.paragraph": "חנויות, משרדים, מחסנים ושטחי מסחר — איתור, תמחור ומשא ומתן עד לחתימה, מתוך היכרות של מעל 15 שנה עם השוק המקומי ועם כל מטר רבוע בעיר.",
  "commercial.listings.title": "תיווך<br/>מסחרי",
  "commercial.listings.whatsappButton": "דברו איתי בוואטסאפ",
  "commercial.listings.paragraph": "חלק מהעסקאות שליווינו בתחום: חנויות, מחסנים ומשרדים שהושכרו ונמכרו לבעלי עסקים ויזמים ברחבי בני ברק. לכל עסקה יש את הסיפור שלה, ולכל עסק את ההתאמה הנכונה עבורו.",
  "commercial.cta.titleStart": "בואו נמצא",
  "commercial.cta.titleEnd": "את הנכס",
  "commercial.cta.titleSecondLine": "הבא שלכם",
  "commercial.cta.button": "דברו איתי בוואטסאפ",

  "testimonialsPage.title": "ממליצים עלינו",
  "testimonialsPage.paragraph": "לקוחות ועסקים שליווינו לאורך השנים, בלשונם שלהם — וגם מה שכותבים עלינו בגוגל.",
  "testimonialsPage.reviewsTitle": "ממליצים עלינו בגוגל",
  "testimonialsPage.reviewsCount": "23 ביקורות בגוגל",
  "testimonialsPage.reviewsLink": "לכל הביקורות בגוגל",
  "testimonialsPage.cta.titleStart": "בואו נמצא",
  "testimonialsPage.cta.titleEnd": "את הנכס",
  "testimonialsPage.cta.titleSecondLine": "הבא שלכם",
  "testimonialsPage.cta.button": "דברו איתי בוואטסאפ"
}
```

- [ ] **Step 2: Create `site/data/testimonials.json`** (9 business testimonials — 3 shown on home/about as `featured`, all 9 on the testimonials page; extracted from `testimonials.html`):

```json
[
  { "id": "greenblatt", "name": "אברהם גרינבלט", "role": "מנהל, ח.מ.ג מהנדסים", "quote": "״לאורך כל התהליך תמיד היית זמין לענות לשיחות ולמיילים באופן מיידי, ועדכנת אותי בכל שלב. הידע שלך על שוק הנדל״ן המקומי וכישורי המשא ומתן שלך היו יקרי ערך — עלית על הציפיות שלי מכל הבחינות.״", "featured": true, "order": 1 },
  { "id": "pesel", "name": "שי פסל", "role": "גרסטנפלד הנדסה ובניין בע״מ", "quote": "״דורון תרם רבות להצלחתו של הפרויקט. היחס המיוחד שלו והליווי גם לאחר חתימת החוזה יוצאים מגדר הרגיל — ללא צל של ספק הייתי פונה אליו לכל פרויקט בבני ברק.״", "featured": true, "order": 2 },
  { "id": "benpaz", "name": "יוסף בן פז", "role": "מנכ״ל, יגאל נכסים", "quote": "״אחד המשרדים החזקים והמומלצים בבני ברק. 100% אמינות, ליווי אישי ומקצועי, התמצאות במחירי השוק וליווי עד לחתימת החוזה. אנחנו מרוצים מאוד מהעבודה איתו.״", "featured": true, "order": 3 },
  { "id": "gvirtz", "name": "שמעון גבירץ", "role": "", "quote": "אמינות והגינות שטרם נתקלנו בהם, ובמיוחד דורון נעים ההליכות שליווה אותנו לכל אורך הדרך והפך עולמות בשבילנו. הלוואי שירבו עוד עסקים טובים וישרים כמו אלו.", "featured": false, "order": 4 },
  { "id": "brecher", "name": "אסתי ברכר", "role": "", "quote": "בתור מעצבת פנים יצא לי להכיר את דורון, אחד האנשים, ביקש ממני לכמה עזרה לקוחות שלו..", "featured": false, "order": 5 },
  { "id": "kleinman", "name": "עוזיאל קליינמן", "role": "", "quote": "מתווך הכי אמין וישר שאני מכיר, שולט חזק בתחום הנדל״ן, חניות ועסקי, מומלץ מאד גם לבעלי עסקים.", "featured": false, "order": 6 },
  { "id": "nechemad", "name": "יצחק נחמד", "role": "", "quote": "לדעתי משרד תיווך מהמובילים בבני ברק, שירות ברמה גבוהה, ובמיוחד ביותר מומלץ עם אדם כמו דורון מנהל המשרד שהוא נותן שירות מכל הלב ובצורה מקצועית מאד עם ליווי עד לסיום העסקה.", "featured": false, "order": 7 },
  { "id": "schwartz", "name": "יצחק שוורץ", "role": "", "quote": "יש לציין שקיבלנו שרות מעולה, אדיב אמין ומהיר, ממליץ בחום.", "featured": false, "order": 8 },
  { "id": "bukris", "name": "עדן בוכריס", "role": "", "quote": "שירות ברמה גבוהה ללקוח, ענה על הציפיות, רואים שהמקום עתיר נסיון, אדיבות, הבנת צרכי הלקוח, פתרון אישי ותואם. תודה רבה לכם.", "featured": false, "order": 9 }
]
```

Note: the 3 `featured` quotes keep the literal ״…״ characters exactly as they appear in the current site (the source HTML embeds them directly in the string, inconsistently — the other 6 quotes on the testimonials page never had them). This plan preserves that existing inconsistency rather than "fixing" it, to keep the migration visually identical to what's live today; nothing in the rendering code adds or strips quote marks.

- [ ] **Step 3: Create `site/data/projects.json`** (6 projects, extracted from `index.html`'s `PROJECTS` array; `image` is relative to `site/lovable/public/`):

```json
[
  { "id": "hadad", "category": "commercial", "title": "האחים חדד – כלי כסף", "description": "השכרת שטח מסחרי גדול לרשת כלי כסף מובילה, כולל התאמת השטח לצורכי התצוגה והמכירה.", "location": "רח׳ הקישון, בני ברק", "tags": ["550 מ״ר", "שטח מסחרי"], "image": "images/proj-hadad.jpg", "order": 1 },
  { "id": "glory", "category": "commercial", "title": "יבואן גלורי", "description": "מחסנים ומשרדים ליבואן פעיל — שילוב של שטח אחסון נוח וקומת משרדים צמודה.", "location": "רח׳ הקישון, בני ברק", "tags": ["300 מ״ר", "מחסנים ומשרדים"], "image": "images/proj-glory.jpg", "order": 2 },
  { "id": "mishkan", "category": "commercial", "title": "משכן התכלת", "description": "השכרת ארבע חנויות ברחבי בני ברק לרשת אחת, בהתאמה מדויקת של מיקום וקהל לכל סניף.", "location": "ברחבי בני ברק", "tags": ["4 חנויות", "רשת קמעונאית"], "image": "images/proj-mishkan.jpg", "order": 3 },
  { "id": "akiva-101", "category": "project-marketing", "title": "רבי עקיבא 101", "description": "שיווק ואכלוס בניין מגורים וחנויות חדש בלב הפועם של בני ברק, על ציר רבי עקיבא–סוקולוב. שווק בהצלחה.", "location": "רבי עקיבא 101, בני ברק", "tags": ["מגורים ומסחר", "אוכלס במלואו"], "image": "images/proj-akiva101.jpg", "order": 4 },
  { "id": "akiva-34", "category": "project-marketing", "title": "רבי עקיבא 34", "description": "שיווק כ־2,000 מ״ר שטחי מסחר ומשרדים. הפרויקט שווק לעיריית בני ברק, ובאזור שווקו משרדים גם לחברות מובילות.", "location": "רבי עקיבא 34, בני ברק", "tags": ["2,000 מ״ר", "מסחר ומשרדים"], "image": "images/proj-akiva34.jpg", "order": 5 },
  { "id": "hazon-ish-12", "category": "project-marketing", "title": "חזון איש 12", "description": "שיווק מבנה של כ־900 מ״ר ששימש בעבר כבית אבות, והותאם לבית ספר לחינוך מיוחד.", "location": "חזון איש 12, בני ברק", "tags": ["900 מ״ר", "מבנה ציבור"], "image": "images/proj-hazon12.jpg", "order": 6 }
]
```

- [ ] **Step 4: Create `site/data/google-reviews.json`** (read-only, no admin CRUD — matches spec's out-of-scope note):

```json
[
  { "id": "glory-office", "initial": "G", "author": "Glory office", "when": "לפני חודש", "text": "איש מדהים ויקר שמלווה אותך עד לחתימה ודואג ללקוח הכי הרבה. נאמן, אמין, דיסקרטי וישר. התיווך הכי טוב מכל הסיבות שבעולם — דורון מתווך מושלם." },
  { "id": "meitavel-simhi", "initial": "M", "author": "Meitavel Simhi", "when": "לפני 6 חודשים", "text": "המתווך הכי טוב ומקצועי שתמצאו. דורון איש מדהים, מגדיל ראש, אפשר לסמוך עליו גם בדברים קטנים — במיוחד אם אתה לא נמצא בעיר." },
  { "id": "yoel-rosner", "initial": "Y", "author": "yoel rosner", "when": "לפני שנה", "text": "תיווך דורון הציע לי נכס ולא ראיתי כזה מתווך בחיים. עם כזאת הוגנות ויושר ורצון שיהיה ללקוח הכי טוב שאפשר, ולא דוחף אותך לעסקה עד שבדקת שהכל טוב לך, ומלווה אותך לאורך כל הדרך. בפעם הבאה אני פונה רק לדורון." }
]
```

- [ ] **Step 5: Write a validation test**

```javascript
// site/data/data-files.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DIR = dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(join(DIR, name), "utf8"));

test("content.json is a flat string map", () => {
  const content = load("content.json");
  assert.equal(typeof content, "object");
  for (const [key, value] of Object.entries(content)) {
    assert.equal(typeof key, "string");
    assert.equal(typeof value, "string", `value for ${key} must be a string`);
  }
  assert.ok("home.hero.titleStart" in content);
  assert.ok("testimonialsPage.title" in content);
});

test("testimonials.json has 9 unique-id records with required fields", () => {
  const list = load("testimonials.json");
  assert.equal(list.length, 9);
  const ids = new Set(list.map((t) => t.id));
  assert.equal(ids.size, 9, "ids must be unique");
  for (const t of list) {
    assert.equal(typeof t.name, "string");
    assert.equal(typeof t.quote, "string");
    assert.equal(typeof t.featured, "boolean");
    assert.equal(typeof t.order, "number");
  }
  assert.equal(list.filter((t) => t.featured).length, 3);
});

test("projects.json has 6 unique-id records across 2 categories", () => {
  const list = load("projects.json");
  assert.equal(list.length, 6);
  const ids = new Set(list.map((p) => p.id));
  assert.equal(ids.size, 6);
  const categories = new Set(list.map((p) => p.category));
  assert.deepEqual([...categories].sort(), ["commercial", "project-marketing"]);
  for (const p of list) {
    assert.ok(Array.isArray(p.tags));
    assert.ok(p.image.startsWith("images/"));
  }
});

test("google-reviews.json has 3 records", () => {
  assert.equal(load("google-reviews.json").length, 3);
});
```

- [ ] **Step 6: Run the test**

Run: `node --test site/data/data-files.test.mjs`
Expected: 4 tests pass, 0 fail.

- [ ] **Step 7: Commit**

```bash
git add site/data/content.json site/data/testimonials.json site/data/projects.json site/data/google-reviews.json site/data/data-files.test.mjs
git commit -m "הוספת קבצי תוכן JSON (טקסטים, המלצות, פרויקטים, ביקורות גוגל)"
```

---

## Task 2: Pure admin-API helpers (`.claude/admin-api.mjs`)

**Files:**
- Create: `.claude/admin-api.mjs`
- Test: `.claude/admin-api.test.mjs`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces (all pure or fs-only, no HTTP): `checkPassword(header)`, `mergeContent(content, key, html)`, `upsertById(list, record)`, `removeById(list, id)`, `nextOrder(list)`, `sanitizeImageFilename(name)`, `isAllowedImageType(mimeType)`, `sanitizeRichHtml(html)`, `readJsonFile(filePath)` (async), `writeJsonFileAtomic(filePath, data)` (async). Task 3 imports all of these.

- [ ] **Step 1: Write the failing tests**

```javascript
// .claude/admin-api.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  checkPassword,
  mergeContent,
  upsertById,
  removeById,
  nextOrder,
  sanitizeImageFilename,
  isAllowedImageType,
  sanitizeRichHtml,
  readJsonFile,
  writeJsonFileAtomic,
} from "./admin-api.mjs";

test("checkPassword accepts only the exact shared password", () => {
  assert.equal(checkPassword("12345"), true);
  assert.equal(checkPassword("wrong"), false);
  assert.equal(checkPassword(undefined), false);
  assert.equal(checkPassword(""), false);
});

test("mergeContent returns a new object with the key set, without mutating the input", () => {
  const original = { "home.hero.subtitle": "old" };
  const result = mergeContent(original, "home.hero.subtitle", "new");
  assert.equal(result["home.hero.subtitle"], "new");
  assert.equal(original["home.hero.subtitle"], "old");
});

test("upsertById appends a new record and assigns the next order", () => {
  const list = [{ id: "a", order: 1 }, { id: "b", order: 2 }];
  const result = upsertById(list, { id: "c", name: "new" });
  assert.equal(result.length, 3);
  assert.equal(result[2].id, "c");
  assert.equal(result[2].order, 3);
  assert.equal(list.length, 2, "original list must not be mutated");
});

test("upsertById replaces an existing record in place, keeping its position", () => {
  const list = [{ id: "a", name: "A", order: 1 }, { id: "b", name: "B", order: 2 }];
  const result = upsertById(list, { id: "a", name: "A2", order: 1 });
  assert.equal(result.length, 2);
  assert.equal(result[0].name, "A2");
});

test("removeById filters out the matching id without mutating the input", () => {
  const list = [{ id: "a" }, { id: "b" }];
  const result = removeById(list, "a");
  assert.deepEqual(result, [{ id: "b" }]);
  assert.equal(list.length, 2);
});

test("nextOrder returns one past the current max order, or 1 for an empty list", () => {
  assert.equal(nextOrder([]), 1);
  assert.equal(nextOrder([{ order: 1 }, { order: 5 }, { order: 3 }]), 6);
});

test("sanitizeImageFilename strips path separators and unsafe characters but keeps the extension", () => {
  assert.equal(sanitizeImageFilename("../../etc/passwd.jpg"), "etc-passwd.jpg");
  assert.equal(sanitizeImageFilename("תמונה חדשה!.png"), "png");
  assert.equal(sanitizeImageFilename("My Photo (1).webp"), "My-Photo-1.webp");
});

test("isAllowedImageType only allows jpeg/png/webp", () => {
  assert.equal(isAllowedImageType("image/jpeg"), true);
  assert.equal(isAllowedImageType("image/png"), true);
  assert.equal(isAllowedImageType("image/webp"), true);
  assert.equal(isAllowedImageType("image/svg+xml"), false);
  assert.equal(isAllowedImageType("text/html"), false);
});

test("sanitizeRichHtml strips script tags and event-handler attributes", () => {
  const dirty = '<script>alert(1)</script><b onclick="evil()">bold</b>';
  const clean = sanitizeRichHtml(dirty);
  assert.ok(!clean.includes("<script"));
  assert.ok(!clean.includes("onclick"));
  assert.ok(clean.includes("<b>bold</b>"));
});

test("sanitizeRichHtml keeps allowed tags and a limited style allow-list", () => {
  const input = '<span style="font-weight:700;font-family:Polin;position:fixed">טקסט</span><br>עוד שורה';
  const clean = sanitizeRichHtml(input);
  assert.ok(clean.includes("font-weight:700"));
  assert.ok(clean.includes("font-family:Polin"));
  assert.ok(!clean.includes("position:fixed"));
  assert.ok(clean.includes("<br>") || clean.includes("<br/>"));
});

test("sanitizeRichHtml drops unknown tags but keeps their text content", () => {
  const clean = sanitizeRichHtml("<div><iframe src=\"evil\"></iframe>שלום</div>");
  assert.ok(!clean.includes("<div"));
  assert.ok(!clean.includes("<iframe"));
  assert.ok(clean.includes("שלום"));
});

test("writeJsonFileAtomic then readJsonFile round-trips data and leaves no temp file behind", async () => {
  const dir = mkdtempSync(join(tmpdir(), "admin-api-test-"));
  const filePath = join(dir, "data.json");
  await writeJsonFileAtomic(filePath, { hello: "world" });
  const result = await readJsonFile(filePath);
  assert.deepEqual(result, { hello: "world" });
  assert.equal(existsSync(filePath + ".tmp"), false);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test .claude/admin-api.test.mjs`
Expected: FAIL — `Cannot find module './admin-api.mjs'`

- [ ] **Step 3: Implement `.claude/admin-api.mjs`**

```javascript
// Pure helpers + fs-only utilities behind the admin panel's write API.
// No HTTP here — .claude/serve.mjs wires these into routes.
import { readFile, writeFile, rename } from "node:fs/promises";

export function checkPassword(header) {
  return header === "12345";
}

export function mergeContent(content, key, html) {
  return { ...content, [key]: html };
}

export function upsertById(list, record) {
  const index = list.findIndex((item) => item.id === record.id);
  if (index === -1) {
    const order = record.order ?? nextOrder(list);
    return [...list, { ...record, order }];
  }
  const copy = [...list];
  copy[index] = { ...list[index], ...record };
  return copy;
}

export function removeById(list, id) {
  return list.filter((item) => item.id !== id);
}

export function nextOrder(list) {
  if (list.length === 0) return 1;
  return Math.max(...list.map((item) => item.order ?? 0)) + 1;
}

export function sanitizeImageFilename(name) {
  const dot = name.lastIndexOf(".");
  const ext = dot === -1 ? "" : name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "");
  const base = (dot === -1 ? name : name.slice(0, dot))
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (!base) return ext;
  return ext ? `${base}.${ext}` : base;
}

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export function isAllowedImageType(mimeType) {
  return ALLOWED_IMAGE_TYPES.has(mimeType);
}

const ALLOWED_TAGS = new Set(["b", "strong", "i", "em", "u", "span", "br"]);
const ALLOWED_STYLE_PROPS = new Set(["font-family", "font-weight", "font-style", "font-size", "text-decoration", "color"]);

function sanitizeStyleAttr(styleValue) {
  return styleValue
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .filter((declaration) => {
      const prop = declaration.split(":")[0]?.trim().toLowerCase();
      return ALLOWED_STYLE_PROPS.has(prop);
    })
    .join(";");
}

export function sanitizeRichHtml(html) {
  let out = String(html).replace(/<script[\s\S]*?<\/script>/gi, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");
  out = out.replace(/<\/?([a-zA-Z0-9]+)((?:\s+[a-zA-Z-]+(?:=(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*\/?>/g, (full, tagName, attrs) => {
    const tag = tagName.toLowerCase();
    const isClosing = full.startsWith("</");
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (tag === "br") return "<br>";
    if (isClosing) return `</${tag}>`;
    let keptAttrs = "";
    if (tag === "span") {
      const styleMatch = attrs.match(/\sstyle\s*=\s*"([^"]*)"/i) || attrs.match(/\sstyle\s*=\s*'([^']*)'/i);
      if (styleMatch) {
        const cleaned = sanitizeStyleAttr(styleMatch[1]);
        if (cleaned) keptAttrs = ` style="${cleaned}"`;
      }
    }
    return `<${tag}${keptAttrs}>`;
  });
  return out;
}

export async function readJsonFile(filePath) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function writeJsonFileAtomic(filePath, data) {
  const tmpPath = `${filePath}.tmp`;
  await writeFile(tmpPath, JSON.stringify(data, null, 2), "utf8");
  await rename(tmpPath, filePath);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test .claude/admin-api.test.mjs`
Expected: PASS — all tests green.

- [ ] **Step 5: Commit**

```bash
git add .claude/admin-api.mjs .claude/admin-api.test.mjs
git commit -m "הוספת פונקציות ליבה לפאנל הניהול (סניטציה, מיזוג, כתיבה אטומית) עם בדיקות"
```

---

## Task 3: Write API in the local dev server

**Files:**
- Modify: `.claude/serve.mjs`

**Interfaces:**
- Consumes: every export from `.claude/admin-api.mjs` (Task 2).
- Produces: running HTTP behavior only (no other task imports `serve.mjs` programmatically) — verified manually with `curl`/browser. Routes: `POST /api/content`, `POST /api/testimonials`, `DELETE /api/testimonials/:id`, `POST /api/projects`, `DELETE /api/projects/:id`, `POST /api/upload-image`. Every write route requires header `x-admin-password: 12345`.

- [ ] **Step 1: Read the current file**

Read `.claude/serve.mjs` in full before editing — it's the existing static file server (44 lines) that this task extends.

- [ ] **Step 2: Replace the file with the extended version**

```javascript
// Minimal static server for the local preview (no dependencies) — now also
// serves the admin panel's write API (content/testimonials/projects/images).
import { createServer } from "node:http";
import { createReadStream, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import {
  checkPassword,
  mergeContent,
  upsertById,
  removeById,
  sanitizeImageFilename,
  isAllowedImageType,
  sanitizeRichHtml,
  readJsonFile,
  writeJsonFileAtomic,
} from "./admin-api.mjs";
import { writeFile } from "node:fs/promises";

const ROOT = fileURLToPath(new URL("../site/", import.meta.url));
const DATA_DIR = join(ROOT, "data");
const IMAGES_DIR = join(ROOT, "lovable", "public", "images");
const PORT = Number(process.env.PORT) || 5273;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(payload);
}

async function handleApi(req, res, pathname) {
  const password = req.headers["x-admin-password"];
  if (!checkPassword(password)) {
    sendJson(res, 401, { error: "סיסמה שגויה" });
    return true;
  }

  if (pathname === "/api/content" && req.method === "POST") {
    const { key, html } = await readJsonBody(req);
    if (typeof key !== "string" || typeof html !== "string") {
      sendJson(res, 400, { error: "חסר key או html" });
      return true;
    }
    const filePath = join(DATA_DIR, "content.json");
    const current = await readJsonFile(filePath);
    const updated = mergeContent(current, key, sanitizeRichHtml(html));
    await writeJsonFileAtomic(filePath, updated);
    sendJson(res, 200, updated);
    return true;
  }

  const testimonialMatch = pathname.match(/^\/api\/testimonials(?:\/([^/]+))?$/);
  if (testimonialMatch) {
    const filePath = join(DATA_DIR, "testimonials.json");
    const current = await readJsonFile(filePath);
    if (req.method === "POST" && !testimonialMatch[1]) {
      const record = await readJsonBody(req);
      if (typeof record.id !== "string" || !record.id) {
        sendJson(res, 400, { error: "חסר id" });
        return true;
      }
      record.quote = sanitizeRichHtml(record.quote ?? "");
      const updated = upsertById(current, record);
      await writeJsonFileAtomic(filePath, updated);
      sendJson(res, 200, updated);
      return true;
    }
    if (req.method === "DELETE" && testimonialMatch[1]) {
      const updated = removeById(current, testimonialMatch[1]);
      await writeJsonFileAtomic(filePath, updated);
      sendJson(res, 200, updated);
      return true;
    }
  }

  const projectMatch = pathname.match(/^\/api\/projects(?:\/([^/]+))?$/);
  if (projectMatch) {
    const filePath = join(DATA_DIR, "projects.json");
    const current = await readJsonFile(filePath);
    if (req.method === "POST" && !projectMatch[1]) {
      const record = await readJsonBody(req);
      if (typeof record.id !== "string" || !record.id) {
        sendJson(res, 400, { error: "חסר id" });
        return true;
      }
      record.description = sanitizeRichHtml(record.description ?? "");
      const updated = upsertById(current, record);
      await writeJsonFileAtomic(filePath, updated);
      sendJson(res, 200, updated);
      return true;
    }
    if (req.method === "DELETE" && projectMatch[1]) {
      const updated = removeById(current, projectMatch[1]);
      await writeJsonFileAtomic(filePath, updated);
      sendJson(res, 200, updated);
      return true;
    }
  }

  if (pathname === "/api/upload-image" && req.method === "POST") {
    const { filename, mimeType, dataBase64 } = await readJsonBody(req);
    if (typeof filename !== "string" || typeof mimeType !== "string" || typeof dataBase64 !== "string") {
      sendJson(res, 400, { error: "חסרים שדות" });
      return true;
    }
    if (!isAllowedImageType(mimeType)) {
      sendJson(res, 400, { error: "סוג קובץ לא נתמך — jpg/png/webp בלבד" });
      return true;
    }
    const buffer = Buffer.from(dataBase64, "base64");
    const MAX_BYTES = 5 * 1024 * 1024;
    if (buffer.length > MAX_BYTES) {
      sendJson(res, 400, { error: "הקובץ גדול מדי (מקסימום 5MB)" });
      return true;
    }
    const safeName = sanitizeImageFilename(filename);
    const finalName = `${Date.now()}-${safeName}`;
    await writeFile(join(IMAGES_DIR, finalName), buffer);
    sendJson(res, 200, { path: `images/${finalName}` });
    return true;
  }

  sendJson(res, 404, { error: "נתיב לא נמצא" });
  return true;
}

createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400).end("Bad request");
    return;
  }

  if (pathname.startsWith("/api/")) {
    handleApi(req, res, pathname).catch((err) => {
      sendJson(res, 500, { error: String(err && err.message || err) });
    });
    return;
  }

  if (pathname === "/") pathname = "/preview/index.html";
  if (pathname === "/admin" || pathname === "/admin/") pathname = "/admin/index.html";

  const filePath = join(ROOT, normalize(pathname).replace(/^(\.\.[/\\])+/, ""));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  let target = filePath;
  try {
    if (statSync(target).isDirectory()) target = join(target, "index.html");
    statSync(target);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
    return;
  }

  res.writeHead(200, {
    "content-type": TYPES[extname(target).toLowerCase()] ?? "application/octet-stream",
    "cache-control": "no-cache",
  });
  createReadStream(target).pipe(res);
}).listen(PORT, () => {
  console.log(`preview ready on http://localhost:${PORT}`);
});
```

- [ ] **Step 3: Manually verify the server starts and serves the API**

Run: `node .claude/serve.mjs` (leave it running in one terminal), then in another terminal:

```bash
curl -s http://localhost:5273/data/content.json | head -c 200
curl -s -X POST http://localhost:5273/api/content -H "content-type: application/json" -H "x-admin-password: wrong" -d '{"key":"home.hero.subtitle","html":"test"}'
curl -s -X POST http://localhost:5273/api/content -H "content-type: application/json" -H "x-admin-password: 12345" -d '{"key":"home.hero.subtitle","html":"בדיקה"}'
curl -s http://localhost:5273/data/content.json | grep subtitle
```

Expected: first curl prints JSON; second returns `{"error":"סיסמה שגויה"}` with HTTP 401; third returns the full updated content object; fourth shows `"home.hero.subtitle":"בדיקה"`. Then **revert the test edit**: `git checkout -- site/data/content.json`.

- [ ] **Step 4: Commit**

```bash
git add .claude/serve.mjs
git commit -m "הוספת API כתיבה לשרת המקומי (טקסטים, המלצות, פרויקטים, העלאת תמונה)"
```

---

## Task 4: Shared `data-store.js`

**Files:**
- Create: `site/assets/data-store.js`
- Test: `site/assets/data-store.test.mjs`

**Interfaces:**
- Consumes: the `/data/*.json` static files (Task 1) and the `/api/*` routes (Task 3) at runtime — not at test time.
- Produces (attached to `globalThis.DataStore`): `sortByOrder(list)`, `initialsFromName(name)`, `imageUrl(relPath)`, `AUTH_KEY`, `getContent()`, `getTestimonials()`, `getProjects()`, `getGoogleReviews()`, `saveContent(key, html, password)`, `saveTestimonial(record, password)`, `deleteTestimonial(id, password)`, `saveProject(record, password)`, `deleteProject(id, password)`, `uploadImage(file, password)`. Tasks 6-12 all consume this file via `<script src="../assets/data-store.js">`.

- [ ] **Step 1: Write the failing tests** (only the pure functions — network calls are verified manually in later tasks' browser checks)

```javascript
// site/assets/data-store.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import "./data-store.js";

const { sortByOrder, initialsFromName, imageUrl } = globalThis.DataStore;

test("sortByOrder sorts ascending by the order field without mutating the input", () => {
  const list = [{ id: "b", order: 2 }, { id: "a", order: 1 }, { id: "c", order: 3 }];
  const sorted = sortByOrder(list);
  assert.deepEqual(sorted.map((x) => x.id), ["a", "b", "c"]);
  assert.equal(list[0].id, "b", "original array must not be mutated");
});

test("initialsFromName takes the first letter of the first two words", () => {
  assert.equal(initialsFromName("אברהם גרינבלט"), "אג");
  assert.equal(initialsFromName("שי פסל"), "שפ");
  assert.equal(initialsFromName("יוסי"), "י");
  assert.equal(initialsFromName(""), "");
});

test("imageUrl prefixes a relative path with the shared images location", () => {
  assert.equal(imageUrl("images/hero.jpg"), "../lovable/public/images/hero.jpg");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test site/assets/data-store.test.mjs`
Expected: FAIL — `Cannot find module './data-store.js'`

- [ ] **Step 3: Implement `site/assets/data-store.js`**

```javascript
// Single point of access to site content. Everything else (public pages,
// admin panel) calls into DataStore instead of touching fetch/JSON directly —
// swapping the storage backend later (Supabase/MySQL) only changes this file.
(function (global) {
  const AUTH_KEY = "doron-admin-auth";

  function sortByOrder(list) {
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  function initialsFromName(name) {
    if (!name) return "";
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
  }

  function imageUrl(relPath) {
    return `../lovable/public/${relPath}`;
  }

  async function getJson(path) {
    const res = await fetch(path, { cache: "no-cache" });
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  }

  function getContent() {
    return getJson("../data/content.json");
  }

  async function getTestimonials() {
    return sortByOrder(await getJson("../data/testimonials.json"));
  }

  async function getProjects() {
    return sortByOrder(await getJson("../data/projects.json"));
  }

  function getGoogleReviews() {
    return getJson("../data/google-reviews.json");
  }

  async function postJson(path, body, password) {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json", "x-admin-password": password },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `POST ${path} failed: ${res.status}`);
    return data;
  }

  async function deleteRequest(path, password) {
    const res = await fetch(path, { method: "DELETE", headers: { "x-admin-password": password } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `DELETE ${path} failed: ${res.status}`);
    return data;
  }

  function saveContent(key, html, password) {
    return postJson("/api/content", { key, html }, password);
  }

  function saveTestimonial(record, password) {
    return postJson("/api/testimonials", record, password);
  }

  function deleteTestimonial(id, password) {
    return deleteRequest(`/api/testimonials/${encodeURIComponent(id)}`, password);
  }

  function saveProject(record, password) {
    return postJson("/api/projects", record, password);
  }

  function deleteProject(id, password) {
    return deleteRequest(`/api/projects/${encodeURIComponent(id)}`, password);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadImage(file, password) {
    const dataBase64 = await fileToBase64(file);
    return postJson("/api/upload-image", { filename: file.name, mimeType: file.type, dataBase64 }, password);
  }

  global.DataStore = {
    AUTH_KEY,
    sortByOrder,
    initialsFromName,
    imageUrl,
    getContent,
    getTestimonials,
    getProjects,
    getGoogleReviews,
    saveContent,
    saveTestimonial,
    deleteTestimonial,
    saveProject,
    deleteProject,
    uploadImage,
  };
})(typeof window !== "undefined" ? window : globalThis);
```

Note: `getContent`/`getTestimonials`/`getProjects`/`getGoogleReviews` fetch with a path relative to `../data/...` — this file is loaded from both `site/preview/*.html` and `site/admin/index.html`, which both sit one directory below `site/`, so the relative path is identical from both call sites.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test site/assets/data-store.test.mjs`
Expected: PASS — 3 tests green. (Requiring the file in Node just registers `globalThis.DataStore`; it doesn't call `fetch` at load time, so this works outside a browser.)

- [ ] **Step 5: Commit**

```bash
git add site/assets/data-store.js site/assets/data-store.test.mjs
git commit -m "הוספת data-store.js כשכבת גישה יחידה לתוכן האתר"
```

---

## Task 5: Shared rich-text toolbar (`rich-editor.js`)

**Files:**
- Create: `site/assets/rich-editor.js`

**Interfaces:**
- Consumes: nothing (standalone DOM component).
- Produces (attached to `globalThis.RichEditor`): `RichEditor.mount(container, { value, onChange })` → `{ getValue(): string, setValue(html): void, destroy(): void }`. Tasks 10-12 use this for every rich-text field in the admin (texts, testimonial quotes, project descriptions).

- [ ] **Step 1: Implement `site/assets/rich-editor.js`**

No automated test here — this is pure DOM/Selection-API interaction with no meaningful logic to test outside a real browser (the sanitizer that matters for security already lives server-side in `admin-api.mjs`, Task 2, and is fully tested there). This gets verified visually in Task 10's browser check.

```javascript
// Small reusable rich-text box: a contenteditable div + a toolbar with
// bold/italic/underline/font-family/font-size. Used identically across the
// admin's Texts/Testimonials/Projects tabs. The server (admin-api.mjs) is the
// authoritative sanitizer — this file only shapes what the admin types.
(function (global) {
  const FONTS = ["Polin", "Assistant"];
  const SIZES = [
    { label: "רגיל", value: "" },
    { label: "קטן", value: "13px" },
    { label: "גדול", value: "20px" },
    { label: "גדול מאוד", value: "28px" },
  ];

  function wrapSelection(editable, styleProp, styleValue) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!editable.contains(range.commonAncestorContainer)) return;
    if (range.collapsed) return;
    const span = document.createElement("span");
    span.style[styleProp] = styleValue;
    range.surroundContents(span);
    selection.removeAllRanges();
    const after = document.createRange();
    after.selectNodeContents(span);
    selection.addRange(after);
  }

  function createToolbar(editable, onChange) {
    const bar = document.createElement("div");
    bar.className = "re-toolbar";
    bar.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px";

    function button(label, onClick) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.style.cssText = "border:1px solid #282726;background:#161514;color:#F0F0F0;border-radius:6px;padding:4px 10px;cursor:pointer;font:600 12px Assistant,system-ui,sans-serif";
      btn.addEventListener("click", () => {
        editable.focus();
        onClick();
        onChange(editable.innerHTML);
      });
      bar.appendChild(btn);
      return btn;
    }

    button("B", () => wrapSelection(editable, "fontWeight", "700"));
    button("I", () => wrapSelection(editable, "fontStyle", "italic"));
    button("U", () => wrapSelection(editable, "textDecoration", "underline"));

    const fontSelect = document.createElement("select");
    fontSelect.style.cssText = "border:1px solid #282726;background:#161514;color:#F0F0F0;border-radius:6px;padding:4px";
    for (const font of FONTS) {
      const opt = document.createElement("option");
      opt.value = font;
      opt.textContent = font;
      fontSelect.appendChild(opt);
    }
    fontSelect.addEventListener("change", () => {
      wrapSelection(editable, "fontFamily", fontSelect.value);
      onChange(editable.innerHTML);
    });
    bar.appendChild(fontSelect);

    const sizeSelect = document.createElement("select");
    sizeSelect.style.cssText = "border:1px solid #282726;background:#161514;color:#F0F0F0;border-radius:6px;padding:4px";
    for (const size of SIZES) {
      const opt = document.createElement("option");
      opt.value = size.value;
      opt.textContent = size.label;
      sizeSelect.appendChild(opt);
    }
    sizeSelect.addEventListener("change", () => {
      if (sizeSelect.value) wrapSelection(editable, "fontSize", sizeSelect.value);
      onChange(editable.innerHTML);
    });
    bar.appendChild(sizeSelect);

    return bar;
  }

  function mount(container, { value = "", onChange = () => {} } = {}) {
    const wrapper = document.createElement("div");
    const editable = document.createElement("div");
    editable.contentEditable = "true";
    editable.innerHTML = value;
    editable.style.cssText = "min-height:38px;border:1px solid #282726;border-radius:8px;padding:8px 10px;background:#0d0c0b;color:#F0F0F0;direction:rtl";

    const toolbar = createToolbar(editable, onChange);
    editable.addEventListener("input", () => onChange(editable.innerHTML));

    wrapper.appendChild(toolbar);
    wrapper.appendChild(editable);
    container.appendChild(wrapper);

    return {
      getValue: () => editable.innerHTML,
      setValue: (html) => { editable.innerHTML = html; },
      destroy: () => wrapper.remove(),
    };
  }

  global.RichEditor = { mount };
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 2: Commit**

```bash
git add site/assets/rich-editor.js
git commit -m "הוספת רכיב עורך טקסט עשיר משותף (rich-editor.js)"
```

---

## Task 6: Wire `site/preview/index.html` to `data-store.js`

**Files:**
- Modify: `site/preview/index.html`

**Interfaces:**
- Consumes: `DataStore.getContent/getTestimonials/getProjects/getGoogleReviews/imageUrl/initialsFromName` (Task 4).

- [ ] **Step 1: Add the script tag** — right before the existing `<script>` block near the end of `<body>` (the one starting with `const WA = ...`), add:

```html
<script src="../assets/data-store.js"></script>
```

- [ ] **Step 2: Tag static text nodes with `data-field`** — add a `data-field="<key>"` attribute to each element carrying editable text, matching `content.json`'s keys from Task 1. For example (hero section):

Old:
```html
      <h1 class="font-display text-d2 font-extrabold tracking-tight text-ink-2">מחפשים משרד או חנות ב<span class="text-brand">בני ברק</span>?</h1>
      <p class="mt-4 max-w-[815px] text-[20px] font-semibold leading-snug text-ink-4 sm:text-[22px]">העסק שלך צריך את הנכס הנכון והליווי שידאג לעסקה הנכונה.</p>
      <p class="mt-5 max-w-[815px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">דורון בן ארבון מלווה בעלי עסקים כבר למעלה מ־15 שנה בשוק הנדל״ן המסחרי בבני ברק — מאיתור הנכס הנכון, דרך המשא ומתן ועד לסגירת העסקה בתנאים הטובים ביותר.</p>
```

New:
```html
      <h1 class="font-display text-d2 font-extrabold tracking-tight text-ink-2"><span data-field="home.hero.titleStart">מחפשים משרד או חנות ב</span><span class="text-brand" data-field="home.hero.titleHighlight">בני ברק</span><span data-field="home.hero.titleEnd">?</span></h1>
      <p class="mt-4 max-w-[815px] text-[20px] font-semibold leading-snug text-ink-4 sm:text-[22px]" data-field="home.hero.subtitle">העסק שלך צריך את הנכס הנכון והליווי שידאג לעסקה הנכונה.</p>
      <p class="mt-5 max-w-[815px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg" data-field="home.hero.paragraph">דורון בן ארבון מלווה בעלי עסקים כבר למעלה מ־15 שנה בשוק הנדל״ן המסחרי בבני ברק — מאיתור הנכס הנכון, דרך המשא ומתן ועד לסגירת העסקה בתנאים הטובים ביותר.</p>
```

Repeat the same pattern (wrap/tag each text node with `data-field="<matching content.json key>"`, keeping every class and surrounding markup untouched) for: the two hero CTA button labels (`home.hero.primaryCta`, `home.hero.secondaryCta`), the About section title/paragraph/cta/stat labels (`home.about.*`), the Services section title/paragraph (`home.services.title`, `home.services.paragraph`), the Projects section title/paragraph/cta/empty-state text/empty-state cta (`home.projects.*`), the Google reviews title/count/link (`home.reviews.*`), the footer tagline (both header logo at line ~82 and footer logo at line ~330 — tag **both** occurrences with `data-field="home.footer.tagline"`) and blurb (`home.footer.blurb`), and the bottom CTA section title/button (`home.cta.*`).

- [ ] **Step 3: Replace the data arrays and rendering with a `DataStore`-driven version** — replace the `<script>` block's data section (currently `const PROJECTS = [...]` through the end of the `render()`/`measure()` calls) so it fetches instead of hardcoding. Old (abbreviated — the full current block is at `site/preview/index.html:429-588`):

```javascript
/* ---- data ---- */
const PROJECTS = [ /* ...hardcoded... */ ];
const FILTERS = [["all","הכל"],["commercial","תיווך מסחרי"],["project-marketing","שיווק פרויקטים"],["plots","מגרשים"]];
const SERVICES = [ /* ...hardcoded... */ ];
const TESTIS = [ /* ...hardcoded... */ ];
const IMG = "../lovable/public/images/";
/* ...services render, google reviews render, testimonials render, projects render, all called synchronously... */
```

New — wrap the whole data-dependent section in an async bootstrap function called once at the bottom of the script:

```javascript
const FILTERS = [["all", "הכל"], ["commercial", "תיווך מסחרי"], ["project-marketing", "שיווק פרויקטים"], ["plots", "מגרשים"]];
const SERVICES_META = [
  { id: "commercial", i: "images/svc-commercial.jpg", href: "commercial.html" },
  { id: "projectMarketing", i: "images/svc-projects.jpg", href: "project-marketing.html" },
  { id: "plots", i: "images/svc-plots.jpg", href: "plots.html" },
];

async function boot() {
  let content, projects, testimonials, googleReviews;
  try {
    [content, projects, testimonials, googleReviews] = await Promise.all([
      DataStore.getContent(),
      DataStore.getProjects(),
      DataStore.getTestimonials(),
      DataStore.getGoogleReviews(),
    ]);
  } catch (err) {
    console.error("שגיאה בטעינת תוכן מ-data-store, נשאר על הטקסט המקורי בעמוד:", err);
    return;
  }

  document.querySelectorAll("[data-field]").forEach((el) => {
    const value = content[el.dataset.field];
    if (value != null) el.innerHTML = value;
  });

  const IMG = (rel) => DataStore.imageUrl(rel);

  document.getElementById("services-grid").innerHTML = SERVICES_META.map((s) => `
    <article class="group flex flex-col gap-8 rounded-2xl border border-ink-10 bg-ink-12 p-6">
      <div class="h-[220px] w-full overflow-hidden rounded-2xl">
        <img src="${IMG(s.i)}" alt="${content[`home.services.${s.id}.title`]}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
      </div>
      <div class="flex flex-1 flex-col gap-3">
        <h3 class="font-display text-d3 font-bold text-ink-4">${content[`home.services.${s.id}.title`]}</h3>
        <p class="text-base leading-[1.5] text-ink-6">${content[`home.services.${s.id}.description`]}</p>
      </div>
      <a href="${s.href}" class="inline-flex items-center gap-2 self-start text-base font-medium text-ink-4 underline underline-offset-4 transition-colors hover:text-brand">${content["home.services.linkLabel"]}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </a>
    </article>`).join("");

  const revTrack = document.getElementById("revTrack");
  const revDots = document.getElementById("revDots");
  revTrack.innerHTML = googleReviews.map((r) => `
    <figure class="w-full shrink-0 px-1">
      <div class="mx-auto flex max-w-[900px] flex-col gap-7 rounded-2xl border border-ink-10 bg-ink-12 p-7 sm:p-10">
        <div class="flex items-center gap-4">
          <div aria-hidden class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand font-display text-xl font-bold text-white">${r.initial}</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-base font-bold text-ink-4">${r.author}</p>
            <p class="text-sm text-ink-7">${r.when}</p>
          </div>
          ${G_SMALL}
        </div>
        <div class="flex items-center gap-[3px]" aria-label="5 מתוך 5">${STAR_LG.repeat(5)}</div>
        <blockquote class="font-display text-[19px] font-medium leading-[1.45] text-ink-4 sm:text-[22px] sm:leading-[1.4]">${r.text}</blockquote>
      </div>
    </figure>`).join("");

  let revIndex = 0, revPaused = false;
  function renderDots() {
    revDots.innerHTML = googleReviews.map((_, i) => `<button type="button" role="tab" aria-selected="${i === revIndex}" aria-label="ביקורת ${i + 1}" data-rev="${i}" class="h-2 rounded-full transition-all duration-300 ${i === revIndex ? "w-7 bg-brand" : "w-2 bg-ink-10 hover:bg-ink-7"}"></button>`).join("");
  }
  function revGo(next) {
    revIndex = ((next % googleReviews.length) + googleReviews.length) % googleReviews.length;
    revTrack.style.transform = `translateX(${revIndex * 100}%)`;
    renderDots();
  }
  revGo(0);
  revDots.addEventListener("click", (e) => { const b = e.target.closest("[data-rev]"); if (b) revGo(+b.dataset.rev); });
  document.getElementById("revNext").addEventListener("click", () => revGo(revIndex + 1));
  document.getElementById("revPrev").addEventListener("click", () => revGo(revIndex - 1));
  const revWrap = document.getElementById("revWrap");
  revWrap.addEventListener("mouseenter", () => { revPaused = true; });
  revWrap.addEventListener("mouseleave", () => { revPaused = false; });
  setInterval(() => { if (!revPaused) revGo(revIndex + 1); }, 7000);

  const featured = testimonials.filter((t) => t.featured);
  document.getElementById("testi-grid").innerHTML = featured.map((t) => `
    <figure class="flex flex-col gap-5 rounded-2xl border border-ink-10 bg-ink-13 p-6">
      <div class="flex items-center gap-3">
        <div aria-hidden class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand font-display text-base font-bold text-white">${DataStore.initialsFromName(t.name)}</div>
        <figcaption class="min-w-0">
          <span class="block truncate text-[15px] font-bold text-ink-4">${t.name}</span>
          ${t.role ? `<span class="block truncate text-[13px] text-ink-7">${t.role}</span>` : ""}
        </figcaption>
      </div>
      <blockquote class="text-[15px] leading-[1.6] text-ink-6">${t.quote}</blockquote>
    </figure>`).join("");

  const track = document.getElementById("track"), empty = document.getElementById("empty"), pager = document.getElementById("pager");
  let filter = "all";

  document.getElementById("tabs").innerHTML = FILTERS.map(([id, label]) => `
    <button type="button" role="tab" data-f="${id}" aria-selected="${id === "all"}"
      class="flex h-[53px] items-center justify-center whitespace-nowrap rounded-lg border px-5 text-[15px] font-medium transition-colors sm:text-base ${id === "all" ? "border-ink-10 bg-ink-13 text-ink-4" : "border-transparent text-ink-7 hover:text-ink-4"}">${label}</button>`).join("");

  function card(p) {
    return `<article class="flex w-[85vw] shrink-0 snap-start flex-col gap-8 rounded-2xl border border-ink-10 bg-ink-13 p-6 sm:w-[360px] lg:w-[calc((100%-2rem)/3)]">
      <div class="h-[220px] w-full overflow-hidden rounded-2xl sm:h-[300px]">
        <img src="${IMG(p.image)}" alt="${p.title}" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
      </div>
      <div class="flex flex-1 flex-col gap-6">
        <div class="flex flex-col gap-2">
          <h3 class="font-display text-d3 font-bold text-ink-4">${p.title}</h3>
          <p class="line-clamp-2-safe text-base leading-[1.5] text-ink-6">${p.description}</p>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-[14px] w-[14px] shrink-0 text-ink-7"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="truncate text-sm text-ink-7">${p.location}</span>
          </div>
          <ul class="flex flex-wrap gap-2">${p.tags.map((g) => `<li class="flex items-center justify-center rounded-lg border border-ink-10 bg-ink-12 px-4 py-2 text-xs text-ink-6">${g}</li>`).join("")}</ul>
        </div>
        <a href="${WA}" target="_blank" rel="noopener noreferrer" class="mt-auto flex items-center justify-center rounded-lg bg-brand px-6 py-4 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-light">${content["home.projects.cardCta"]}</a>
      </div>
    </article>`;
  }

  function render() {
    const list = filter === "all" ? projects : projects.filter((p) => p.category === filter);
    track.innerHTML = list.map(card).join("");
    const has = list.length > 0;
    track.classList.toggle("hidden", !has);
    pager.classList.toggle("hidden", !has);
    empty.classList.toggle("hidden", has);
    empty.classList.toggle("flex", !has);
    track.scrollLeft = 0;
    measure();
  }
  function measure() {
    const first = track.firstElementChild;
    if (!first) return;
    const step = first.offsetWidth + 16;
    const all = track.children.length;
    const now = Math.min(all, Math.round(Math.abs(track.scrollLeft) / step) + 1);
    document.getElementById("pgAll").textContent = String(all).padStart(2, "0");
    document.getElementById("pgNow").textContent = String(now).padStart(2, "0");
  }
  track.addEventListener("scroll", measure, { passive: true });
  addEventListener("resize", measure);
  const stepSize = () => (track.firstElementChild ? track.firstElementChild.offsetWidth + 16 : track.clientWidth);
  document.getElementById("next").addEventListener("click", () => track.scrollBy({ left: -stepSize(), behavior: "smooth" }));
  document.getElementById("prev").addEventListener("click", () => track.scrollBy({ left: stepSize(), behavior: "smooth" }));
  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-f]"); if (!btn) return;
    filter = btn.dataset.f;
    document.querySelectorAll("#tabs [data-f]").forEach((b) => {
      const on = b.dataset.f === filter;
      b.setAttribute("aria-selected", String(on));
      b.className = `flex h-[53px] items-center justify-center whitespace-nowrap rounded-lg border px-5 text-[15px] font-medium transition-colors sm:text-base ${on ? "border-ink-10 bg-ink-13 text-ink-4" : "border-transparent text-ink-7 hover:text-ink-4"}`;
    });
    render();
  });
  render();
}
boot();
```

Note: `G_SMALL`, `STAR_LG` stay defined earlier in the script exactly as they are today (unrelated to this task — leave those declarations untouched); this block only replaces what depended on the removed hardcoded arrays.

- [ ] **Step 4: Manually verify** — with `.claude/serve.mjs` running, open `http://localhost:5273/` (or `http://localhost:5273/preview/index.html`) in the Browser tool, and confirm the page renders identically to before (hero, about stats, 3 services, project tabs + cards, google review slider, 3 featured testimonials, footer) with no console errors.

- [ ] **Step 5: Commit**

```bash
git add site/preview/index.html
git commit -m "חיבור דף הבית ל-data-store.js במקום מערכי תוכן קשיחים"
```

---

## Task 7: Wire `site/preview/about.html` to `data-store.js`

**Files:**
- Modify: `site/preview/about.html`

**Interfaces:**
- Consumes: `DataStore.getContent/getTestimonials/initialsFromName` (Task 4).

- [ ] **Step 1: Add the script tag** before the page's existing `<script>` block:

```html
<script src="../assets/data-store.js"></script>
```

- [ ] **Step 2: Tag every static text node with `data-field`**, matching the `about.*` keys from Task 1's `content.json`. Concretely, in `site/preview/about.html`:

Old (hero, lines ~130-131):
```html
      <h1 class="font-display text-h3 font-bold leading-[1.05] tracking-tight text-ink-2">מתווך בין<br />נכסים לאנשים.</h1>
      <p class="max-w-[707px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">במקום לרוץ בין נכסים, להתלבט אם המחיר נכון ולחשוש ממה שלא ידעתם לבדוק — אתם מקבלים ליווי מקצועי ממי שחי את השוק כבר מעל 15 שנה, מכיר את המחירים, את האזורים ואת העסקאות, ודואג שתוכלו להיכנס לעסקה בראש שקט.</p>
```
New:
```html
      <h1 class="font-display text-h3 font-bold leading-[1.05] tracking-tight text-ink-2" data-field="about.hero.title">מתווך בין<br />נכסים לאנשים.</h1>
      <p class="max-w-[707px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg" data-field="about.hero.paragraph">במקום לרוץ בין נכסים, להתלבט אם המחיר נכון ולחשוש ממה שלא ידעתם לבדוק — אתם מקבלים ליווי מקצועי ממי שחי את השוק כבר מעל 15 שנה, מכיר את המחירים, את האזורים ואת העסקאות, ודואג שתוכלו להיכנס לעסקה בראש שקט.</p>
```

Apply the same `data-field="<key>"` tagging (element unchanged otherwise) to: the Story & Values heading (`about.story.title`), first paragraph (`about.story.paragraph1`), the Google-review blockquote (`about.story.quote`) and its figcaption text (`about.story.quoteAttribution` — keep the `Glory office · ביקורת בגוגל` text but wrap it in the tagged element, the `<svg>` icon stays outside the tag), second paragraph (`about.story.paragraph2`), the "אלה הערכים..." intro line (`about.story.valuesIntro`), and each of the 3 value bullets — split each `<li>`'s bold lead (`value1Title`/`value2Title`/`value3Title`) from its trailing description text (`value1Text`/`value2Text`/`value3Text`) into two tagged `<span>`s as already structured in the source (the bold span and the following text already are separate `<span>` elements — just add `data-field` to each). Then the Achievements title/paragraph (`about.achievements.title`/`.paragraph`) and all 4 stat value/label pairs (`about.achievements.stat1Value/Label` … `stat4Value/Label`). Then the testimonials heading "מה אומרים עלינו" → `data-field="about.testimonialsTitle"`. Then the bottom CTA's three title fragments and button (`about.cta.titleStart`, `about.cta.titleEnd`, `about.cta.titleSecondLine`, `about.cta.button`).

- [ ] **Step 3: Replace the hardcoded `TESTIS` block with a `DataStore`-driven version.** Old (`site/preview/about.html:350-366`):

```javascript
/* business testimonials (same 3 verified quotes as the homepage) */
const TESTIS = [ /* ...hardcoded... */ ];
document.getElementById("testi-grid").innerHTML = TESTIS.map(t => ` ... `).join("");
```

New:
```javascript
async function boot() {
  let content, testimonials;
  try {
    [content, testimonials] = await Promise.all([DataStore.getContent(), DataStore.getTestimonials()]);
  } catch (err) {
    console.error("שגיאה בטעינת תוכן מ-data-store, נשאר על הטקסט המקורי בעמוד:", err);
    return;
  }
  document.querySelectorAll("[data-field]").forEach((el) => {
    const value = content[el.dataset.field];
    if (value != null) el.innerHTML = value;
  });
  const featured = testimonials.filter((t) => t.featured);
  document.getElementById("testi-grid").innerHTML = featured.map((t) => `
    <figure class="flex flex-col gap-5 rounded-2xl border border-ink-10 bg-ink-13 p-6">
      <div class="flex items-center gap-3">
        <div aria-hidden class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand font-display text-base font-bold text-white">${DataStore.initialsFromName(t.name)}</div>
        <figcaption class="min-w-0">
          <span class="block truncate text-[15px] font-bold text-ink-4">${t.name}</span>
          ${t.role ? `<span class="block truncate text-[13px] text-ink-7">${t.role}</span>` : ""}
        </figcaption>
      </div>
      <blockquote class="text-[15px] leading-[1.6] text-ink-6">${t.quote}</blockquote>
    </figure>`).join("");
}
boot();
```

- [ ] **Step 4: Manually verify** — open `http://localhost:5273/preview/about.html`, confirm hero/story/achievements/testimonials/CTA all render identically, no console errors.

- [ ] **Step 5: Commit**

```bash
git add site/preview/about.html
git commit -m "חיבור עמוד האודות ל-data-store.js"
```

---

## Task 8: Wire `site/preview/commercial.html` to `data-store.js`

**Files:**
- Modify: `site/preview/commercial.html`

**Interfaces:**
- Consumes: `DataStore.getContent/getProjects/imageUrl` (Task 4).

- [ ] **Step 1: Add the script tag** before the page's existing `<script>` block:

```html
<script src="../assets/data-store.js"></script>
```

- [ ] **Step 2: Tag static text nodes with `data-field`.** Old (hero, lines ~130-131):

```html
      <h1 class="font-display text-h3 font-bold leading-[1.05] tracking-tight text-ink-2">תיווך מסחרי<br />בבני ברק — נכון מהיסוד.</h1>
      <p class="max-w-[707px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">חנויות, משרדים, מחסנים ושטחי מסחר — איתור, תמחור ומשא ומתן עד לחתימה, מתוך היכרות של מעל 15 שנה עם השוק המקומי ועם כל מטר רבוע בעיר.</p>
```
New:
```html
      <h1 class="font-display text-h3 font-bold leading-[1.05] tracking-tight text-ink-2" data-field="commercial.hero.title">תיווך מסחרי<br />בבני ברק — נכון מהיסוד.</h1>
      <p class="max-w-[707px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg" data-field="commercial.hero.paragraph">חנויות, משרדים, מחסנים ושטחי מסחר — איתור, תמחור ומשא ומתן עד לחתימה, מתוך היכרות של מעל 15 שנה עם השוק המקומי ועם כל מטר רבוע בעיר.</p>
```

Likewise tag the listings heading (`commercial.listings.title`), its WhatsApp button (`commercial.listings.whatsappButton`), its intro paragraph (`commercial.listings.paragraph`), and the bottom CTA's 3 title fragments + button (`commercial.cta.*`).

- [ ] **Step 3: Replace the hardcoded `LISTINGS` block** — old (`site/preview/commercial.html:279-293`):

```javascript
const LISTINGS = [ /* ...hardcoded, duplicated from index.html... */ ];
const IMG = "../lovable/public/images/";
document.getElementById("listings-track").innerHTML = LISTINGS.map(p => ` ... `).join("");
```

New:
```javascript
async function boot() {
  let content, projects;
  try {
    [content, projects] = await Promise.all([DataStore.getContent(), DataStore.getProjects()]);
  } catch (err) {
    console.error("שגיאה בטעינת תוכן מ-data-store, נשאר על הטקסט המקורי בעמוד:", err);
    return;
  }
  document.querySelectorAll("[data-field]").forEach((el) => {
    const value = content[el.dataset.field];
    if (value != null) el.innerHTML = value;
  });
  const listings = projects.filter((p) => p.category === "commercial");
  document.getElementById("listings-track").innerHTML = listings.map((p) => `
    <article class="flex flex-col gap-4">
      <h3 class="font-display text-h6 font-bold leading-none text-ink-2">${p.title}</h3>
      <p class="text-[17px] leading-[1.6] text-ink-6 sm:text-lg">${p.description}</p>
      <div class="h-[240px] w-full overflow-hidden rounded-2xl sm:h-[320px] lg:h-[372px]">
        <img src="${DataStore.imageUrl(p.image)}" alt="${p.title}" class="h-full w-full object-cover" loading="lazy" />
      </div>
    </article>`).join("");
}
boot();
```

This also removes the previous duplication between `index.html`'s and `commercial.html`'s copies of these 3 projects — both pages now read the same `site/data/projects.json`.

- [ ] **Step 4: Manually verify** — open `http://localhost:5273/preview/commercial.html`, confirm hero + 3 listings + CTA render identically, no console errors.

- [ ] **Step 5: Commit**

```bash
git add site/preview/commercial.html
git commit -m "חיבור עמוד תיווך מסחרי ל-data-store.js"
```

---

## Task 9: Wire `site/preview/testimonials.html` to `data-store.js`

**Files:**
- Modify: `site/preview/testimonials.html`

**Interfaces:**
- Consumes: `DataStore.getContent/getTestimonials/getGoogleReviews/initialsFromName` (Task 4).

- [ ] **Step 1: Add the script tag** before the page's existing `<script>` block:

```html
<script src="../assets/data-store.js"></script>
```

- [ ] **Step 2: Tag static text nodes with `data-field`.** Old (header, lines ~124-127):

```html
      <h1 class="font-display text-d1 font-extrabold tracking-tight text-ink-2">ממליצים עלינו</h1>
      ...
    <p class="mx-auto mt-6 max-w-[700px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg">לקוחות ועסקים שליווינו לאורך השנים, בלשונם שלהם — וגם מה שכותבים עלינו בגוגל.</p>
```
New:
```html
      <h1 class="font-display text-d1 font-extrabold tracking-tight text-ink-2" data-field="testimonialsPage.title">ממליצים עלינו</h1>
      ...
    <p class="mx-auto mt-6 max-w-[700px] text-[17px] leading-[1.6] text-ink-6 sm:text-lg" data-field="testimonialsPage.paragraph">לקוחות ועסקים שליווינו לאורך השנים, בלשונם שלהם — וגם מה שכותבים עלינו בגוגל.</p>
```

Likewise tag the Google-reviews heading (`testimonialsPage.reviewsTitle`), the "23 ביקורות בגוגל" count (`testimonialsPage.reviewsCount`), the "לכל הביקורות בגוגל" link text (`testimonialsPage.reviewsLink`), and the bottom CTA's 3 title fragments + button (`testimonialsPage.cta.*`).

- [ ] **Step 3: Replace the hardcoded `TESTIS`/`GREVIEWS` blocks.** Old (`site/preview/testimonials.html:307-372`, the full business-testimonials + google-reviews rendering):

```javascript
const TESTIS = [ /* ...9 hardcoded... */ ];
document.getElementById("testi-grid").innerHTML = TESTIS.map(t => ` ... `).join("");
const GREVIEWS = [ /* ...hardcoded... */ ];
/* ...slider logic... */
```

New:
```javascript
async function boot() {
  let content, testimonials, googleReviews;
  try {
    [content, testimonials, googleReviews] = await Promise.all([
      DataStore.getContent(),
      DataStore.getTestimonials(),
      DataStore.getGoogleReviews(),
    ]);
  } catch (err) {
    console.error("שגיאה בטעינת תוכן מ-data-store, נשאר על הטקסט המקורי בעמוד:", err);
    return;
  }
  document.querySelectorAll("[data-field]").forEach((el) => {
    const value = content[el.dataset.field];
    if (value != null) el.innerHTML = value;
  });

  document.getElementById("testi-grid").innerHTML = testimonials.map((t) => `
    <figure class="flex flex-col gap-5 rounded-2xl border border-ink-10 bg-ink-13 p-6">
      <div class="flex items-center gap-3">
        <div aria-hidden class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand font-display text-base font-bold text-white">${DataStore.initialsFromName(t.name)}</div>
        <figcaption class="min-w-0">
          <span class="block truncate text-[15px] font-bold text-ink-4">${t.name}</span>
          ${t.role ? `<span class="block truncate text-[13px] text-ink-7">${t.role}</span>` : ""}
        </figcaption>
      </div>
      <blockquote class="text-[15px] leading-[1.6] text-ink-6">${t.quote}</blockquote>
    </figure>`).join("");

  const revTrack = document.getElementById("revTrack");
  const revDots = document.getElementById("revDots");
  revTrack.innerHTML = googleReviews.map((r) => `
    <figure class="w-full shrink-0 px-1">
      <div class="mx-auto flex max-w-[900px] flex-col gap-7 rounded-2xl border border-ink-10 bg-ink-12 p-7 sm:p-10">
        <div class="flex items-center gap-4">
          <div aria-hidden class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand font-display text-xl font-bold text-white">${r.initial}</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-base font-bold text-ink-4">${r.author}</p>
            <p class="text-sm text-ink-7">${r.when}</p>
          </div>
          ${G_SMALL}
        </div>
        <div class="flex items-center gap-[3px]" aria-label="5 מתוך 5">${STAR_LG.repeat(5)}</div>
        <blockquote class="font-display text-[19px] font-medium leading-[1.45] text-ink-4 sm:text-[22px] sm:leading-[1.4]">${r.text}</blockquote>
      </div>
    </figure>`).join("");

  let revIndex = 0, revPaused = false;
  function renderDots() {
    revDots.innerHTML = googleReviews.map((_, i) => `<button type="button" role="tab" aria-selected="${i === revIndex}" aria-label="ביקורת ${i + 1}" data-rev="${i}" class="h-2 rounded-full transition-all duration-300 ${i === revIndex ? "w-7 bg-brand" : "w-2 bg-ink-10 hover:bg-ink-7"}"></button>`).join("");
  }
  function revGo(next) {
    revIndex = ((next % googleReviews.length) + googleReviews.length) % googleReviews.length;
    revTrack.style.transform = `translateX(${revIndex * 100}%)`;
    renderDots();
  }
  revGo(0);
  revDots.addEventListener("click", (e) => { const b = e.target.closest("[data-rev]"); if (b) revGo(+b.dataset.rev); });
  document.getElementById("revNext").addEventListener("click", () => revGo(revIndex + 1));
  document.getElementById("revPrev").addEventListener("click", () => revGo(revIndex - 1));
  const revWrap = document.getElementById("revWrap");
  revWrap.addEventListener("mouseenter", () => { revPaused = true; });
  revWrap.addEventListener("mouseleave", () => { revPaused = false; });
  setInterval(() => { if (!revPaused) revGo(revIndex + 1); }, 7000);
}
boot();
```

Keep `STAR_MD`/`STAR_LG`/`G_SMALL` declarations exactly as they are today (defined earlier in the same script, unrelated to this task).

- [ ] **Step 4: Manually verify** — open `http://localhost:5273/preview/testimonials.html`, confirm all 9 testimonials + google reviews slider + CTA render identically, no console errors.

- [ ] **Step 5: Commit**

```bash
git add site/preview/testimonials.html
git commit -m "חיבור עמוד ההמלצות ל-data-store.js"
```

---

## Task 10: Admin shell — login + Texts tab

**Files:**
- Create: `site/admin/index.html`

**Interfaces:**
- Consumes: `DataStore.AUTH_KEY/getContent/saveContent` (Task 4), `RichEditor.mount` (Task 5).
- Produces: the admin page shell (login gate + tab navigation) that Tasks 11-12 add their tab panels into (same file, appended sections).

- [ ] **Step 1: Create `site/admin/index.html`**

```html
<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>פאנל ניהול — דורון בן ארבון</title>
<meta name="robots" content="noindex,nofollow" />
<style>
  body { margin:0; background:#0a0100; color:#F0F0F0; font-family:Assistant,system-ui,sans-serif; direction:rtl; }
  .hidden { display:none !important; }
  input[type=password], input[type=text] { background:#161514; border:1px solid #282726; color:#F0F0F0; border-radius:8px; padding:10px 12px; font:inherit; }
  button.primary { background:#0AB89D; color:#fff; border:0; border-radius:8px; padding:10px 18px; font:700 14px Assistant,system-ui,sans-serif; cursor:pointer; }
  button.secondary { background:#161514; color:#F0F0F0; border:1px solid #282726; border-radius:8px; padding:10px 18px; font:700 14px Assistant,system-ui,sans-serif; cursor:pointer; }
  #tabs button { background:none; border:0; border-bottom:2px solid transparent; color:#8D8D8C; padding:12px 16px; font:700 14px Assistant,system-ui,sans-serif; cursor:pointer; }
  #tabs button.active { color:#0AB89D; border-bottom-color:#0AB89D; }
  .field-row { border:1px solid #282726; border-radius:10px; padding:14px; margin-bottom:12px; }
  .field-label { color:#8D8D8C; font-size:12px; margin-bottom:6px; }
  .saved-badge { color:#0AB89D; font-size:12px; margin-inline-start:8px; }
</style>
</head>
<body>

<div id="login" style="max-width:360px;margin:15vh auto;padding:24px;">
  <h1 style="font-size:20px;font-weight:700;margin:0 0 16px">כניסה לפאנל הניהול</h1>
  <input id="passwordInput" type="password" placeholder="סיסמה" style="width:100%;box-sizing:border-box;margin-bottom:12px" />
  <button id="loginBtn" class="primary" style="width:100%">כניסה</button>
  <p id="loginError" class="hidden" style="color:#e5484d;font-size:13px;margin-top:10px">סיסמה שגויה</p>
</div>

<div id="app" class="hidden">
  <header style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;border-bottom:1px solid #282726">
    <h1 style="font-size:18px;font-weight:700;margin:0">פאנל ניהול — תיווך דורון</h1>
    <button id="logoutBtn" class="secondary">התנתקות</button>
  </header>
  <nav id="tabs" style="border-bottom:1px solid #282726;padding:0 24px">
    <button data-tab="texts" class="active">טקסטים</button>
    <button data-tab="testimonials">המלצות</button>
    <button data-tab="projects">פרויקטים</button>
  </nav>
  <main style="max-width:900px;margin:0 auto;padding:24px">
    <section id="panel-texts"></section>
    <section id="panel-testimonials" class="hidden"></section>
    <section id="panel-projects" class="hidden"></section>
  </main>
</div>

<script src="../assets/data-store.js"></script>
<script src="../assets/rich-editor.js"></script>
<script>
const PASSWORD = "12345";
const loginEl = document.getElementById("login");
const appEl = document.getElementById("app");

function showApp() {
  loginEl.classList.add("hidden");
  appEl.classList.remove("hidden");
  loadTextsTab();
}

if (localStorage.getItem(DataStore.AUTH_KEY) === "1") {
  showApp();
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const value = document.getElementById("passwordInput").value;
  if (value === PASSWORD) {
    localStorage.setItem(DataStore.AUTH_KEY, "1");
    document.getElementById("loginError").classList.add("hidden");
    showApp();
  } else {
    document.getElementById("loginError").classList.remove("hidden");
  }
});
document.getElementById("passwordInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("loginBtn").click();
});
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(DataStore.AUTH_KEY);
  location.reload();
});

document.getElementById("tabs").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-tab]");
  if (!btn) return;
  document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("active", b === btn));
  document.querySelectorAll("main > section").forEach((s) => s.classList.add("hidden"));
  document.getElementById(`panel-${btn.dataset.tab}`).classList.remove("hidden");
  if (btn.dataset.tab === "testimonials") loadTestimonialsTab();
  if (btn.dataset.tab === "projects") loadProjectsTab();
});

const FIELD_GROUPS = [
  { page: "בית", prefix: "home." },
  { page: "אודות", prefix: "about." },
  { page: "תיווך מסחרי", prefix: "commercial." },
  { page: "המלצות", prefix: "testimonialsPage." },
];

async function loadTextsTab() {
  const panel = document.getElementById("panel-texts");
  panel.innerHTML = "<p>טוען…</p>";
  const content = await DataStore.getContent();
  panel.innerHTML = "";
  for (const group of FIELD_GROUPS) {
    const heading = document.createElement("h2");
    heading.textContent = group.page;
    heading.style.cssText = "font-size:16px;margin:24px 0 12px";
    panel.appendChild(heading);
    for (const key of Object.keys(content).filter((k) => k.startsWith(group.prefix)).sort()) {
      const row = document.createElement("div");
      row.className = "field-row";
      const label = document.createElement("div");
      label.className = "field-label";
      label.textContent = key;
      row.appendChild(label);
      const box = document.createElement("div");
      row.appendChild(box);
      const savedBadge = document.createElement("span");
      savedBadge.className = "saved-badge hidden";
      savedBadge.textContent = "נשמר ✓";
      row.appendChild(savedBadge);

      let saveTimer = null;
      RichEditor.mount(box, {
        value: content[key],
        onChange: (html) => {
          clearTimeout(saveTimer);
          saveTimer = setTimeout(async () => {
            await DataStore.saveContent(key, html, PASSWORD);
            savedBadge.classList.remove("hidden");
            setTimeout(() => savedBadge.classList.add("hidden"), 1500);
          }, 600);
        },
      });
      panel.appendChild(row);
    }
  }
}
</script>
</body>
</html>
```

- [ ] **Step 2: Manually verify** — with `.claude/serve.mjs` running, open `http://localhost:5273/admin` in the Browser tool:
  - Confirm the login screen shows, wrong password shows the error text, correct password (`12345`) shows the app shell.
  - Confirm the Texts tab lists all `content.json` fields grouped under 4 page headings.
  - Edit one field's text via the toolbar (e.g. make a word bold), wait ~1s, confirm the "נשמר ✓" badge appears.
  - Reload `http://localhost:5273/admin` and confirm the edited field still shows the change (proves the save round-tripped through the server to `content.json`).
  - Reload the page without the login flag (clear `localStorage`) and confirm it re-shows the login screen; log in again and confirm it stays logged in across a normal reload.
  - Revert the test edit: `git checkout -- site/data/content.json`.

- [ ] **Step 3: Commit**

```bash
git add site/admin/index.html
git commit -m "הוספת פאנל ניהול: כניסה + טאב טקסטים"
```

---

## Task 11: Admin — Testimonials tab

**Files:**
- Modify: `site/admin/index.html`

**Interfaces:**
- Consumes: `DataStore.getTestimonials/saveTestimonial/deleteTestimonial` (Task 4), `RichEditor.mount` (Task 5).
- Produces: `loadTestimonialsTab()` (already referenced by the tab-click handler from Task 10).

- [ ] **Step 1: Add the testimonials tab logic** — insert this function into the `<script>` block (after `loadTextsTab`, before the closing `</script>`):

```javascript
async function loadTestimonialsTab() {
  const panel = document.getElementById("panel-testimonials");
  panel.innerHTML = "<p>טוען…</p>";
  const testimonials = await DataStore.getTestimonials();
  panel.innerHTML = "";

  const addBtn = document.createElement("button");
  addBtn.className = "primary";
  addBtn.textContent = "+ המלצה חדשה";
  addBtn.style.marginBottom = "16px";
  addBtn.addEventListener("click", () => renderTestimonialForm(panel, null));
  panel.appendChild(addBtn);

  const list = document.createElement("div");
  panel.appendChild(list);
  for (const t of testimonials) {
    const row = document.createElement("div");
    row.className = "field-row";
    row.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><strong>${t.name}</strong> ${t.role ? `<span style="color:#8D8D8C">— ${t.role}</span>` : ""} ${t.featured ? '<span class="saved-badge">מוצג בדף הבית</span>' : ""}</div>
      <div style="display:flex;gap:8px">
        <button class="secondary" data-edit="${t.id}">עריכה</button>
        <button class="secondary" data-delete="${t.id}">מחיקה</button>
        <button class="secondary" data-up="${t.id}">▲</button>
        <button class="secondary" data-down="${t.id}">▼</button>
      </div>
    </div>`;
    list.appendChild(row);
  }

  panel.addEventListener("click", async (e) => {
    const editId = e.target.closest("[data-edit]")?.dataset.edit;
    const deleteId = e.target.closest("[data-delete]")?.dataset.delete;
    const upId = e.target.closest("[data-up]")?.dataset.up;
    const downId = e.target.closest("[data-down]")?.dataset.down;
    if (editId) {
      const record = testimonials.find((t) => t.id === editId);
      renderTestimonialForm(panel, record);
    }
    if (deleteId && confirm("למחוק את ההמלצה הזו?")) {
      await DataStore.deleteTestimonial(deleteId, PASSWORD);
      loadTestimonialsTab();
    }
    if (upId || downId) {
      const id = upId || downId;
      const current = testimonials.find((t) => t.id === id);
      const neighborIndex = testimonials.findIndex((t) => t.id === id) + (upId ? -1 : 1);
      const neighbor = testimonials[neighborIndex];
      if (current && neighbor) {
        await DataStore.saveTestimonial({ ...current, order: neighbor.order }, PASSWORD);
        await DataStore.saveTestimonial({ ...neighbor, order: current.order }, PASSWORD);
        loadTestimonialsTab();
      }
    }
  }, { once: true });
}

function renderTestimonialForm(panel, record) {
  const isNew = !record;
  const form = document.createElement("div");
  form.className = "field-row";
  form.innerHTML = `
    <div class="field-label">שם</div>
    <input type="text" data-f="name" value="${record?.name ?? ""}" style="width:100%;box-sizing:border-box;margin-bottom:10px" />
    <div class="field-label">תפקיד / חברה (אופציונלי)</div>
    <input type="text" data-f="role" value="${record?.role ?? ""}" style="width:100%;box-sizing:border-box;margin-bottom:10px" />
    <div class="field-label">ציטוט</div>
    <div data-f="quote-box" style="margin-bottom:10px"></div>
    <label style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
      <input type="checkbox" data-f="featured" ${record?.featured ? "checked" : ""} /> להציג בדף הבית
    </label>
    <button class="primary" data-f="save">שמירה</button>
  `;
  panel.prepend(form);
  const quoteBox = form.querySelector('[data-f="quote-box"]');
  const quoteEditor = RichEditor.mount(quoteBox, { value: record?.quote ?? "" });

  form.querySelector('[data-f="save"]').addEventListener("click", async () => {
    const name = form.querySelector('[data-f="name"]').value.trim();
    if (!name) return alert("חובה למלא שם");
    const id = record?.id ?? name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9֐-׿-]/g, "");
    await DataStore.saveTestimonial({
      id,
      name,
      role: form.querySelector('[data-f="role"]').value.trim(),
      quote: quoteEditor.getValue(),
      featured: form.querySelector('[data-f="featured"]').checked,
      order: record?.order,
    }, PASSWORD);
    loadTestimonialsTab();
  });
}
```

- [ ] **Step 2: Manually verify** — open `http://localhost:5273/admin`, log in, click "המלצות":
  - Confirm all 9 seeded testimonials list, with the 3 `featured` ones marked.
  - Add a new testimonial (name + quote with some bold text), save, confirm it appears in the list.
  - Edit an existing testimonial's quote, save, confirm the change persists after switching tabs and back.
  - Use ▲/▼ to reorder two testimonials, confirm the list order changes and persists after a reload.
  - Delete the testimonial you added, confirm it disappears from the list.
  - Open `http://localhost:5273/preview/testimonials.html` and confirm it reflects the final state (no leftover test data).

- [ ] **Step 3: Commit**

```bash
git add site/admin/index.html
git commit -m "הוספת טאב ניהול המלצות לפאנל (הוספה/עריכה/מחיקה/סדר)"
```

---

## Task 12: Admin — Projects tab (with drag-and-drop image upload)

**Files:**
- Modify: `site/admin/index.html`

**Interfaces:**
- Consumes: `DataStore.getProjects/saveProject/deleteProject/uploadImage/imageUrl` (Task 4), `RichEditor.mount` (Task 5).
- Produces: `loadProjectsTab()` (already referenced by the tab-click handler from Task 10).

- [ ] **Step 1: Add the projects tab logic** — insert into the `<script>` block (after `loadTestimonialsTab`/`renderTestimonialForm`, before `</script>`):

```javascript
const PROJECT_CATEGORIES = [
  ["commercial", "תיווך מסחרי"],
  ["project-marketing", "שיווק פרויקטים"],
  ["plots", "מגרשים"],
];
let currentProjectCategory = "commercial";

async function loadProjectsTab() {
  const panel = document.getElementById("panel-projects");
  panel.innerHTML = "<p>טוען…</p>";
  const projects = await DataStore.getProjects();
  panel.innerHTML = "";

  const catBar = document.createElement("div");
  catBar.style.cssText = "display:flex;gap:8px;margin-bottom:16px";
  for (const [id, label] of PROJECT_CATEGORIES) {
    const btn = document.createElement("button");
    btn.className = id === currentProjectCategory ? "primary" : "secondary";
    btn.textContent = label;
    btn.addEventListener("click", () => { currentProjectCategory = id; loadProjectsTab(); });
    catBar.appendChild(btn);
  }
  panel.appendChild(catBar);

  const addBtn = document.createElement("button");
  addBtn.className = "primary";
  addBtn.textContent = "+ פרויקט חדש";
  addBtn.style.marginBottom = "16px";
  addBtn.style.display = "block";
  addBtn.addEventListener("click", () => renderProjectForm(panel, null));
  panel.appendChild(addBtn);

  const list = document.createElement("div");
  panel.appendChild(list);
  for (const p of projects.filter((p) => p.category === currentProjectCategory)) {
    const row = document.createElement("div");
    row.className = "field-row";
    row.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
      <img src="${DataStore.imageUrl(p.image)}" alt="${p.title}" style="width:64px;height:64px;object-fit:cover;border-radius:8px" />
      <div style="flex:1"><strong>${p.title}</strong><div style="color:#8D8D8C;font-size:13px">${p.location}</div></div>
      <div style="display:flex;gap:8px">
        <button class="secondary" data-edit="${p.id}">עריכה</button>
        <button class="secondary" data-delete="${p.id}">מחיקה</button>
      </div>
    </div>`;
    list.appendChild(row);
  }

  panel.addEventListener("click", async (e) => {
    const editId = e.target.closest("[data-edit]")?.dataset.edit;
    const deleteId = e.target.closest("[data-delete]")?.dataset.delete;
    if (editId) renderProjectForm(panel, projects.find((p) => p.id === editId));
    if (deleteId && confirm("למחוק את הפרויקט הזה?")) {
      await DataStore.deleteProject(deleteId, PASSWORD);
      loadProjectsTab();
    }
  }, { once: true });
}

function renderProjectForm(panel, record) {
  let pendingImage = record?.image ?? "";
  const form = document.createElement("div");
  form.className = "field-row";
  form.innerHTML = `
    <div class="field-label">כותרת</div>
    <input type="text" data-f="title" value="${record?.title ?? ""}" style="width:100%;box-sizing:border-box;margin-bottom:10px" />
    <div class="field-label">תיאור</div>
    <div data-f="description-box" style="margin-bottom:10px"></div>
    <div class="field-label">מיקום</div>
    <input type="text" data-f="location" value="${record?.location ?? ""}" style="width:100%;box-sizing:border-box;margin-bottom:10px" />
    <div class="field-label">תגיות (מופרדות בפסיק)</div>
    <input type="text" data-f="tags" value="${(record?.tags ?? []).join(", ")}" style="width:100%;box-sizing:border-box;margin-bottom:10px" />
    <div class="field-label">קטגוריה</div>
    <select data-f="category" style="margin-bottom:10px">
      ${PROJECT_CATEGORIES.map(([id, label]) => `<option value="${id}" ${record?.category === id || (!record && id === currentProjectCategory) ? "selected" : ""}>${label}</option>`).join("")}
    </select>
    <div class="field-label">תמונה (גררי לכאן קובץ)</div>
    <div data-f="dropzone" style="border:2px dashed #282726;border-radius:10px;padding:20px;text-align:center;margin-bottom:10px">
      <img data-f="preview" src="${record?.image ? DataStore.imageUrl(record.image) : ""}" style="max-width:160px;max-height:120px;display:${record?.image ? "block" : "none"};margin:0 auto 10px" />
      <span data-f="dropzone-label">גררי תמונה לכאן, או</span>
      <input type="file" data-f="file-input" accept="image/jpeg,image/png,image/webp" style="display:block;margin:8px auto 0" />
    </div>
    <button class="primary" data-f="save">שמירה</button>
  `;
  panel.prepend(form);

  const descriptionEditor = RichEditor.mount(form.querySelector('[data-f="description-box"]'), { value: record?.description ?? "" });
  const dropzone = form.querySelector('[data-f="dropzone"]');
  const preview = form.querySelector('[data-f="preview"]');
  const fileInput = form.querySelector('[data-f="file-input"]');

  async function handleFile(file) {
    if (!file) return;
    const result = await DataStore.uploadImage(file, PASSWORD);
    pendingImage = result.path;
    preview.src = DataStore.imageUrl(pendingImage);
    preview.style.display = "block";
  }
  fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));
  dropzone.addEventListener("dragover", (e) => { e.preventDefault(); dropzone.style.borderColor = "#0AB89D"; });
  dropzone.addEventListener("dragleave", () => { dropzone.style.borderColor = "#282726"; });
  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.style.borderColor = "#282726";
    handleFile(e.dataTransfer.files[0]);
  });

  form.querySelector('[data-f="save"]').addEventListener("click", async () => {
    const title = form.querySelector('[data-f="title"]').value.trim();
    if (!title) return alert("חובה למלא כותרת");
    if (!pendingImage) return alert("חובה להעלות תמונה");
    const id = record?.id ?? title.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9֐-׿-]/g, "");
    await DataStore.saveProject({
      id,
      title,
      description: descriptionEditor.getValue(),
      location: form.querySelector('[data-f="location"]').value.trim(),
      tags: form.querySelector('[data-f="tags"]').value.split(",").map((t) => t.trim()).filter(Boolean),
      category: form.querySelector('[data-f="category"]').value,
      image: pendingImage,
      order: record?.order,
    }, PASSWORD);
    loadProjectsTab();
  });
}
```

- [ ] **Step 2: Manually verify** — open `http://localhost:5273/admin`, log in, click "פרויקטים":
  - Confirm the 3 category tabs work and show the right projects (3 commercial, 3 project-marketing, 0 plots).
  - On the "מגרשים" (plots) tab, click "+ פרויקט חדש", fill title/description/location/tags, drag an image file onto the dropzone (or use the file input) and confirm a preview appears, save, and confirm the new project shows up in the list with its image thumbnail.
  - Confirm the uploaded file actually landed in `site/lovable/public/images/` (check via a directory listing).
  - Edit that project's title, save, confirm it updates.
  - Delete it, confirm it's gone from the list and the image file removal is NOT expected (per spec, deleting a project doesn't need to delete the underlying image file — acceptable to leave it orphaned, matches simplest correct behavior).
  - Open `http://localhost:5273/preview/index.html` and `commercial.html` and confirm no leftover test data appears (delete anything left over via the admin, and remove any orphaned test image files from `site/lovable/public/images/`).

- [ ] **Step 3: Commit**

```bash
git add site/admin/index.html
git commit -m "הוספת טאב ניהול פרויקטים לפאנל (כולל העלאת תמונה בגרירה)"
```

---

## Task 13: Documentation + final end-to-end verification

**Files:**
- Modify: `site/README.md`

**Interfaces:** none — this task only documents behavior already built in Tasks 1-12 and does a final integration pass.

- [ ] **Step 1: Add a new section to `site/README.md`**, right after the existing "## עריכת תוכן" section (which currently only describes editing `src/data/site.ts` for the Lovable/React copy), documenting the new workflow for the static preview:

```markdown
## פאנל ניהול (לתצוגה המקדימה הסטטית)

תוכן דף הבית, עמוד האודות, תיווך מסחרי ועמוד ההמלצות **בתצוגה המקדימה** (`site/preview/`)
נשלף בזמן ריצה מקבצי `site/data/*.json`, ולא כתוב בקוד ה-HTML.

לעריכה: להריץ את השרת המקומי (`node .claude/serve.mjs`) ולפתוח
`http://localhost:5273/admin` (סיסמה: `12345`). שלושה טאבים: טקסטים
(עם עורך עשיר), המלצות (הוספה/עריכה/מחיקה), פרויקטים (הוספה/עריכה/מחיקה,
כולל גרירת תמונה).

**חשוב:** הפאנל שומר את השינויים ישירות לקבצי ה-JSON ולתמונות במחשב המקומי —
הוא לא פעיל מול כתובת ה-GitHub Pages החיה (שם אין שרת, רק קבצים סטטיים).
כדי לפרסם שינוי בפועל: לערוך בפאנל, לבדוק בתצוגה המקומית, ואז git commit + push
כמו תמיד.

בעתיד, כשתתקבל החלטה על Supabase או MySQL עצמאי (הפרויקט עדיין לא מחובר),
רק `site/assets/data-store.js` ישתנה — לא הפאנל ולא העמודים הציבוריים.
ראו `docs/superpowers/specs/2026-09-06-admin-panel-design.md` לפרטים.
```

- [ ] **Step 2: Full end-to-end manual walkthrough** (Browser tool, server running via `node .claude/serve.mjs`):
  1. Visit `http://localhost:5273/preview/index.html`, `about.html`, `commercial.html`, `testimonials.html` — confirm all 4 render with no visual regressions and no console errors (compare against a `git stash` of the pre-change versions if anything looks off).
  2. Visit `http://localhost:5273/admin`, log in, make one small edit in each of the 3 tabs (a text field, a testimonial, a project), and confirm all 3 show up correctly on the relevant public page after reload.
  3. Revert those 3 test edits via the admin panel (or `git checkout -- site/data/`) so the committed data files stay clean.
  4. Run the full automated test suite once more: `node --test site/data/data-files.test.mjs .claude/admin-api.test.mjs site/assets/data-store.test.mjs` — confirm all pass.

- [ ] **Step 3: Commit**

```bash
git add site/README.md
git commit -m "תיעוד פאנל הניהול ב-README"
```
