/**
 * כל תוכן דף הבית במקום אחד.
 * מבוסס על "מסמך איפיון תוכן — אתר דורון בן ארבון, תיווך מסחרי"
 * ועל הפרוספקט הרשמי. שינוי טקסט באתר = שינוי כאן בלבד.
 */

export const site = {
  name: "דורון בן ארבון",
  shortName: "תיווך דורון",
  business: "תיווך מסחרי",
  tagline: "מתווך בין נכסים לאנשים",
  phone: "054-4980159",
  phoneHref: "tel:+972544980159",
  // כרגע פותח וואטסאפ עם הודעה מוכנה
  whatsapp:
    "https://wa.me/972544980159?text=" +
    encodeURIComponent("היי דורון, הגעתי מהאתר ואשמח לדבר על נכס"),
  // TODO: לאמת מול דורון איזו כתובת פעילה — יש גם bayazamut@gmail.com
  email: "doron@ba-yazamut.co.il",
  address: "רבי עקיבא 101, בני ברק",
} as const;

export const navLinks = [
  { label: "דף בית", href: "/" },
  { label: "תיווך מסחרי", href: "/commercial" },
  { label: "שיווק פרויקטים", href: "/project-marketing" },
  { label: "מגרשים", href: "/plots" },
  { label: "אודות", href: "/about" },
  { label: "המלצות", href: "/testimonials" },
  { label: "צור קשר", href: "/contact" },
] as const;

export const hero = {
  // הכותרת בנויה משלושה חלקים כדי שאפשר יהיה להדגיש "בני ברק" בטורקיז
  titleStart: "מחפשים משרד או חנות ב",
  titleHighlight: "בני ברק",
  titleEnd: "?",
  subtitle: "העסק שלך צריך את הנכס הנכון והליווי שידאג לעסקה הנכונה.",
  paragraph:
    "דורון בן ארבון מלווה בעלי עסקים כבר למעלה מ־15 שנה בשוק הנדל״ן המסחרי בבני ברק — מאיתור הנכס הנכון, דרך המשא ומתן ועד לסגירת העסקה בתנאים הטובים ביותר.",
  primaryCta: { label: "התקשרו עכשיו", href: site.phoneHref },
  secondaryCta: { label: "וואטסאפ", href: site.whatsapp },
  reviews: [
    {
      quote: "100% אמינות, ליווי אישי ומקצועי",
      author: "יוסף בן פז",
      role: "מנכ״ל יגאל נכסים",
      initials: "יב",
      stars: 5,
    },
    {
      quote: "הייתי פונה אליו לכל פרויקט בבני ברק",
      author: "שי פסל",
      role: "גרסטנפלד הנדסה ובניין",
      initials: "שפ",
      stars: 5,
    },
  ],
} as const;

export const about = {
  titleStart: "נכס נכון",
  titleEnd: "שקט אמיתי",
  titleSecondLine: "גם אחרי החתימה.",
  paragraph:
    "במקום לרוץ בין נכסים, להתלבט אם המחיר נכון ולחשוש ממה שלא ידעתם לבדוק — אתם מקבלים ליווי מקצועי ממי שחי את השוק כבר מעל 15 שנה, מכיר את המחירים, את האזורים ואת העסקאות, ודואג שתוכלו להיכנס לעסקה בראש שקט.",
  cta: { label: "עוד עלינו ←", href: "/about" },
  stats: [
    { value: "+15", label: "שנות ניסיון בנדל״ן מסחרי" },
    { value: "1:1", label: "ליווי אישי לאורך כל העסקה" },
    { value: "+125", label: "חנויות ומשרדים שהושכרו בבני ברק" },
  ],
  // תצלומים אמיתיים מהפרוספקט: דורון במשרד, ומשרד התיווך
  images: [
    { src: "/images/about-1.jpg", alt: "דורון בן ארבון במשרד התיווך בבני ברק" },
    { src: "/images/about-2.jpg", alt: "משרד התיווך של דורון בן ארבון" },
  ],
} as const;

/**
 * עמוד אודות — לפי מסמך האיפיון (סעיף "עמוד: אודות") ותבנית ה-Figma.
 * הביו והערכים מבוססים על הפרוספקט הרשמי; מספרי הניסיון הותאמו לאלה
 * שכבר מוצגים בדף הבית (site.ts → about.stats) כדי לא לסתור את עצמנו.
 */
export const aboutPage = {
  hero: {
    titleLine1: "מתווך בין",
    titleLine2: "נכסים לאנשים.",
    images: [
      { src: "/images/about-hero-office.jpg", alt: "משרד התיווך של דורון בן ארבון בבני ברק" },
      { src: "/images/about-hero-doron.jpg", alt: "דורון בן ארבון במשרד התיווך" },
    ],
  },
  story: {
    titleLine1: "הסיפור",
    titleLine2: "והערכים שלי",
    bio: "שמי דורון בן ארבון. אני מלווה בעלי עסקים ויזמים בבני ברק כבר למעלה מ־15 שנה — בתחומי התיווך המסחרי, שיווק פרויקטים ומגרשים. בס״ד ליוויתי עשרות עסקאות של מכירה, השכרה ותיווך עסקים, מהחנות הקטנה ברחוב ועד לבניינים שלמים.",
    // ציטוט אמיתי מתוך ביקורת גוגל מאומתת (googleReviews → "glory-office"), מקוצר לשורה החזקה
    quote: {
      text: "איש מדהים ויקר שמלווה אותך עד לחתימה ודואג ללקוח הכי הרבה. נאמן, אמין, דיסקרטי וישר.",
      author: "Glory office",
      source: "ביקורת בגוגל",
      initials: "G",
    },
    valuesIntro: "אלה הערכים שמובילים אותי בכל עסקה:",
    values: [
      {
        title: "בקיאות חסרת פשרות",
        text: "הכרות מעמיקה של כל מטר רבוע בבני ברק, לצורך קידום השכרה ומכירה מדויקים ומהירים.",
      },
      {
        title: "יושר ואמינות לפני הכל",
        text: "מבטלים עסקה בכל שלב אם משהו לא מרגיש נכון או מתאים ללקוח.",
      },
      {
        title: "ליווי מלא ואישי",
        text: "ייעוץ בתמחור ומימון, חיבור לאנשי מקצוע (עו״ד, אדריכלית), עד לקבלת המפתח.",
      },
    ],
  },
  achievements: {
    title: "בקצרה, במספרים",
    paragraph: "כל מספר כאן מייצג עסקה אמיתית, לקוח מרוצה ועבודה משותפת לאורך זמן.",
  },
  testimonials: {
    title: "מה אומרים עלינו",
  },
} as const;

/**
 * עמוד תיווך מסחרי — לפי מסמך האיפיון (סעיף "עמוד: תיווך מסחרי") ותבנית ה-Figma
 * (סקשן "Service"). התוכן: הסבר קצר על התחום + הפרויקטים שכבר מוגדרים למטה
 * בקטגוריה commercial — אין כאן תוכן פרויקטים חדש, רק כותרות ופסקאות.
 */
export const commercialPage = {
  hero: {
    titleLine1: "תיווך מסחרי",
    titleLine2: "בבני ברק — נכון מהיסוד.",
    paragraph:
      "חנויות, משרדים, מחסנים ושטחי מסחר — איתור, תמחור ומשא ומתן עד לחתימה, מתוך היכרות של מעל 15 שנה עם השוק המקומי ועם כל מטר רבוע בעיר.",
    image: "/images/svc-commercial.jpg",
  },
  listings: {
    titleLine1: "תיווך",
    titleLine2: "מסחרי",
    paragraph:
      "חלק מהעסקאות שליווינו בתחום: חנויות, מחסנים ומשרדים שהושכרו ונמכרו לבעלי עסקים ויזמים ברחבי בני ברק. לכל עסקה יש את הסיפור שלה, ולכל עסק את ההתאמה הנכונה עבורו.",
    cta: { label: "דברו איתי בוואטסאפ", href: site.whatsapp },
  },
} as const;

/**
 * עמוד שיווק פרויקטים — לפי מסמך האיפיון (סעיף "עמוד: שיווק פרויקטים") ותבנית
 * ה-Figma (סקשן "Service"), באותו מבנה בדיוק כמו עמוד תיווך מסחרי.
 */
export const projectMarketingPage = {
  hero: {
    titleLine1: "שיווק פרויקטים",
    titleLine2: "בבני ברק — מהתכנון ועד לאכלוס.",
    paragraph:
      "ליווי ושיווק פרויקטים חדשים — בניינים ומתחמים עבור יזמים, מוסדות ורשויות, מהשיווק הראשוני ועד לאכלוס מלא, מתוך הכרות עמוקה עם השוק המקומי בבני ברק.",
    image: "/images/svc-projects.jpg",
  },
  listings: {
    titleLine1: "שיווק",
    titleLine2: "פרויקטים",
    paragraph:
      "חלק מהפרויקטים ששיווקנו: בניינים, מתחמי מגורים ומסחר ומבנים ציבוריים ברחבי בני ברק. מהתכנון הראשוני ועד לאכלוס מלא, בליווי צמוד לאורך כל הדרך.",
    cta: { label: "דברו איתי בוואטסאפ", href: site.whatsapp },
  },
} as const;

/**
 * עמוד מגרשים — לפי מסמך האיפיון (סעיף "עמוד: מגרשים"), באותו מבנה כמו שני
 * העמודים למעלה. אין עדיין עסקת מגרש אמיתית (ראו README, "פערים פתוחים") —
 * listings.placeholder הם תוכן דמה זמני, ויוחלפו בעסקאות אמיתיות מדורון.
 */
export const plotsPage = {
  hero: {
    titleLine1: "מגרשים",
    titleLine2: "לבנייה ולהשקעה בבני ברק.",
    paragraph:
      "איתור ותיווך מגרשים לבנייה ולהשקעה, עם היכרות מלאה עם השטח והזדמנויות שלא מגיעות למודעות. (טקסט לדוגמה — יעודכן מול דורון.)",
    image: "/images/svc-plots.jpg",
  },
  listings: {
    titleLine1: "מגרשים",
    titleLine2: "להשקעה",
    paragraph:
      "עדיין לא עלו לכאן עסקאות מגרשים אמיתיות. שלושת הבלוקים למטה הם תוכן דמה זמני להדגמת המבנה, ויוחלפו בעסקאות אמיתיות ברגע שיתקבלו מדורון.",
    cta: { label: "דברו איתי בוואטסאפ", href: site.whatsapp },
    placeholder: [
      {
        id: "plot-placeholder-1",
        title: "מגרש לדוגמה — שם ומיקום",
        description:
          "טקסט תיאור לדוגמה: גודל המגרש, ייעוד (מגורים / מסחר / תעשייה) ומצב תכנוני. יוחלף בפרטי עסקה אמיתית.",
      },
      {
        id: "plot-placeholder-2",
        title: "מגרש לדוגמה — שם ומיקום",
        description:
          "טקסט תיאור לדוגמה: גודל המגרש, ייעוד (מגורים / מסחר / תעשייה) ומצב תכנוני. יוחלף בפרטי עסקה אמיתית.",
      },
      {
        id: "plot-placeholder-3",
        title: "מגרש לדוגמה — שם ומיקום",
        description:
          "טקסט תיאור לדוגמה: גודל המגרש, ייעוד (מגורים / מסחר / תעשייה) ומצב תכנוני. יוחלף בפרטי עסקה אמיתית.",
      },
    ],
  },
} as const;

export type ProjectCategory = "commercial" | "project-marketing" | "plots";

export const projectFilters: { id: ProjectCategory | "all"; label: string }[] = [
  { id: "all", label: "הכל" },
  { id: "commercial", label: "תיווך מסחרי" },
  { id: "project-marketing", label: "שיווק פרויקטים" },
  { id: "plots", label: "מגרשים" },
];

export const projects = [
  {
    id: "hadad",
    category: "commercial" as ProjectCategory,
    title: "האחים חדד – כלי כסף",
    description:
      "השכרת שטח מסחרי גדול לרשת כלי כסף מובילה, כולל התאמת השטח לצורכי התצוגה והמכירה.",
    location: "רח׳ הקישון, בני ברק",
    tags: ["550 מ״ר", "שטח מסחרי"],
    // TODO placeholder — אין תצלום של העסקה הזו בפרוספקט
    image: "/images/proj-hadad.jpg",
    gallery: [] as string[],
  },
  {
    id: "glory",
    category: "commercial" as ProjectCategory,
    title: "יבואן גלורי",
    description:
      "מחסנים ומשרדים ליבואן פעיל — שילוב של שטח אחסון נוח וקומת משרדים צמודה.",
    location: "רח׳ הקישון, בני ברק",
    tags: ["300 מ״ר", "מחסנים ומשרדים"],
    // תצלומים אמיתיים שסיפק דורון (site/תמונות/glory1-3)
    image: "/images/proj-glory.jpg",
    gallery: ["/images/proj-glory-2.jpg", "/images/proj-glory-3.jpg"],
  },
  {
    id: "mishkan",
    category: "commercial" as ProjectCategory,
    title: "משכן התכלת",
    description:
      "השכרת ארבע חנויות ברחבי בני ברק לרשת אחת, בהתאמה מדויקת של מיקום וקהל לכל סניף.",
    location: "ברחבי בני ברק",
    tags: ["4 חנויות", "רשת קמעונאית"],
    // תצלומים אמיתיים שסיפק דורון (site/תמונות/mishkan1-3) — מחליפים את התצלום הבודד הקודם
    image: "/images/proj-mishkan.jpg",
    gallery: ["/images/proj-mishkan-2.jpg", "/images/proj-mishkan-3.jpg"],
  },
  {
    id: "akiva-101",
    category: "project-marketing" as ProjectCategory,
    title: "רבי עקיבא 101",
    description:
      "שיווק ואכלוס בניין מגורים וחנויות חדש בלב הפועם של בני ברק, על ציר רבי עקיבא–סוקולוב. שווק בהצלחה.",
    location: "רבי עקיבא 101, בני ברק",
    tags: ["מגורים ומסחר", "אוכלס במלואו"],
    // תצלום אמיתי מהפרוספקט — הבניין בפינת רבי עקיבא–סוקולוב
    image: "/images/proj-akiva101.jpg",
    gallery: [] as string[],
  },
  {
    id: "akiva-34",
    category: "project-marketing" as ProjectCategory,
    title: "רבי עקיבא 34",
    description:
      "שיווק כ־2,000 מ״ר שטחי מסחר ומשרדים. הפרויקט שווק לעיריית בני ברק, ובאזור שווקו משרדים גם לחברות מובילות.",
    location: "רבי עקיבא 34, בני ברק",
    tags: ["2,000 מ״ר", "מסחר ומשרדים"],
    // TODO placeholder — אין תצלום של העסקה הזו בפרוספקט
    image: "/images/proj-akiva34.jpg",
    gallery: [] as string[],
  },
  {
    id: "hazon-ish-12",
    category: "project-marketing" as ProjectCategory,
    title: "חזון איש 12",
    description:
      "שיווק מבנה של כ־900 מ״ר ששימש בעבר כבית אבות, והותאם לבית ספר לחינוך מיוחד.",
    location: "חזון איש 12, בני ברק",
    tags: ["900 מ״ר", "מבנה ציבור"],
    // תצלום אמיתי מהפרוספקט — הבניין עם שילוט בית הספר 'מעלות'
    image: "/images/proj-hazon12.jpg",
    gallery: [] as string[],
  },
];

export const projectsSection = {
  title: "פרויקטים נבחרים",
  paragraph:
    "חלק מהעסקאות שליווינו: חנויות, מחסנים, משרדים ובניינים שלמים. לכל נכס יש את הסיפור שלו, ולכל לקוח את ההתאמה הנכונה עבורו.",
  cta: { label: "לכל הפרויקטים", href: "/projects" },
  cardCta: "דברו איתי על נכס דומה",
  emptyState:
    "עדיין לא העלינו לכאן עסקאות מקטגוריה זו. יש לנו מה לספר — דברו איתי ואשמח לעדכן במה שרלוונטי עבורכם.",
};

export const servicesSection = {
  title: "תיווך מסחרי - חשיבה יזמית",
  paragraph:
    "אנחנו מלווים בעלי עסקים ויזמים בדרך לנכס הנכון, מתוך אחריות אמיתית לתוצאה. בוחנים התאמה, שומרים על האינטרסים שלכם ומנהלים את התהליך מתוך הבנה מסחרית עמוקה וניסיון של שנים.",
  items: [
    {
      id: "commercial",
      title: "תיווך מסחרי",
      description:
        "חנויות, משרדים, מחסנים ושטחי מסחר בבני ברק - איתור, תמחור והשכרה או מכירה מדויקת ומהירה.",
      image: "/images/svc-commercial.jpg",
      href: "/commercial",
    },
    {
      id: "project-marketing",
      title: "שיווק פרויקטים",
      description:
        "ליווי ושיווק פרויקטים חדשים בניינים ומתחמים עבור יזמים, מוסדות ורשויות, עד לאכלוס מלא.",
      image: "/images/svc-projects.jpg",
      href: "/project-marketing",
    },
    {
      id: "plots",
      title: "מגרשים",
      description:
        "איתור ותיווך מגרשים לבנייה ולהשקעה, עם היכרות מלאה עם השטח והזדמנויות שלא מגיעות למודעות.",
      image: "/images/svc-plots.jpg",
      href: "/plots",
    },
  ],
  linkLabel: "קראו עוד…",
};

/* ------------------------------------------------------------------
   ביקורות גוגל — נשלפו מהכרטיס העסקי האמיתי ב-Google Maps
   (CID 1215550842583894295, נבדק 27.8.2026: דירוג 5.0 מתוך 23 ביקורות).
   הטקסטים ורבטים; תוקנו רק רווחים וסימני פיסוק.
   כדי למשוך את כל 23 הביקורות בזמן אמת — ראו README, סעיף "ביקורות חיות".
   ------------------------------------------------------------------ */

export const googleBusiness = {
  name: "תיווך דורון ויזמות — בני ברק",
  rating: 5.0,
  reviewCount: 23,
  /** מזהה המקום ב-Google Maps */
  cid: "1215550842583894295",
  /** feature id — לשימוש בקריאת Find Place כדי לקבל place_id בפורמט ChIJ… */
  fid: "0x151d4baee1c8e531:0x10de810d12a3c917",
  mapsUrl: "https://www.google.com/maps?cid=1215550842583894295",
  /** קו נייח של המשרד, מהכרטיס בגוגל */
  officePhone: "03-613-8886",
} as const;

export type GoogleReview = {
  id: string;
  author: string;
  initials: string;
  when: string;
  rating: number;
  text: string;
};

export const googleReviews: GoogleReview[] = [
  {
    id: "glory-office",
    author: "Glory office",
    initials: "G",
    when: "לפני חודש",
    rating: 5,
    text: "איש מדהים ויקר שמלווה אותך עד לחתימה ודואג ללקוח הכי הרבה. נאמן, אמין, דיסקרטי וישר. התיווך הכי טוב מכל הסיבות שבעולם — דורון מתווך מושלם.",
  },
  {
    id: "meitavel-simhi",
    author: "Meitavel Simhi",
    initials: "M",
    when: "לפני 6 חודשים",
    rating: 5,
    text: "המתווך הכי טוב ומקצועי שתמצאו. דורון איש מדהים, מגדיל ראש, אפשר לסמוך עליו גם בדברים קטנים — במיוחד אם אתה לא נמצא בעיר.",
  },
  {
    id: "yoel-rosner",
    author: "yoel rosner",
    initials: "Y",
    when: "לפני שנה",
    rating: 5,
    text: "תיווך דורון הציע לי נכס ולא ראיתי כזה מתווך בחיים. עם כזאת הוגנות ויושר ורצון שיהיה ללקוח הכי טוב שאפשר, ולא דוחף אותך לעסקה עד שבדקת שהכל טוב לך, ומלווה אותך לאורך כל הדרך. בפעם הבאה אני פונה רק לדורון.",
  },
];

export const googleReviewsSection = {
  title: "ממליצים עלינו בגוגל",
  allReviewsLabel: "לכל הביקורות בגוגל",
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  initials: string;
};

export const testimonialsSection: { items: Testimonial[] } = {
  items: [
    {
      id: "greenblatt",
      quote:
        "״לאורך כל התהליך תמיד היית זמין לענות לשיחות ולמיילים באופן מיידי, ועדכנת אותי בכל שלב. הידע שלך על שוק הנדל״ן המקומי וכישורי המשא ומתן שלך היו יקרי ערך — עלית על הציפיות שלי מכל הבחינות.״",
      author: "אברהם גרינבלט",
      role: "מנהל, ח.מ.ג מהנדסים",
      initials: "אג",
    },
    {
      id: "pesel",
      quote:
        "״דורון תרם רבות להצלחתו של הפרויקט. היחס המיוחד שלו והליווי גם לאחר חתימת החוזה יוצאים מגדר הרגיל — ללא צל של ספק הייתי פונה אליו לכל פרויקט בבני ברק.״",
      author: "שי פסל",
      role: "גרסטנפלד הנדסה ובניין בע״מ",
      initials: "שפ",
    },
    {
      id: "benpaz",
      quote:
        "״אחד המשרדים החזקים והמומלצים בבני ברק. 100% אמינות, ליווי אישי ומקצועי, התמצאות במחירי השוק וליווי עד לחתימת החוזה. אנחנו מרוצים מאוד מהעבודה איתו.״",
      author: "יוסף בן פז",
      role: "מנכ״ל, יגאל נכסים",
      initials: "יב",
    },
  ],
};

/**
 * המלצות נוספות מהאתר הישן (לא מהפרוספקט הרשמי) — לשימוש בעמוד /testimonials
 * המלא, לצד שלוש המלצות הפרוספקט שכבר מוצגות גם בדף הבית. תוקנו רק רווחים
 * ופיסוק, בלי לשנות תוכן — כמו הביקורות בגוגל למעלה.
 */
export const additionalTestimonials: Testimonial[] = [
  {
    id: "gvirtz",
    quote:
      "אמינות והגינות שטרם נתקלנו בהם, ובמיוחד דורון נעים ההליכות שליווה אותנו לכל אורך הדרך והפך עולמות בשבילנו. הלוואי שירבו עוד עסקים טובים וישרים כמו אלו.",
    author: "שמעון גבירץ",
    initials: "שג",
  },
  {
    id: "brecher",
    // הטקסט הזה הופיע חלקי/לא ברור גם באתר הישן — הושאר כפי שהוא, בלי להשלים מילים.
    quote:
      "בתור מעצבת פנים יצא לי להכיר את דורון, אחד האנשים, ביקש ממני לכמה עזרה לקוחות שלו..",
    author: "אסתי ברכר",
    initials: "אב",
  },
  {
    id: "kleinman",
    quote:
      "מתווך הכי אמין וישר שאני מכיר, שולט חזק בתחום הנדל״ן, חניות ועסקי, מומלץ מאד גם לבעלי עסקים.",
    author: "עוזיאל קליינמן",
    initials: "עק",
  },
  {
    id: "nechemad",
    quote:
      "לדעתי משרד תיווך מהמובילים בבני ברק, שירות ברמה גבוהה, ובמיוחד ביותר מומלץ עם אדם כמו דורון מנהל המשרד שהוא נותן שירות מכל הלב ובצורה מקצועית מאד עם ליווי עד לסיום העסקה.",
    author: "יצחק נחמד",
    initials: "ין",
  },
  {
    id: "schwartz",
    quote: "יש לציין שקיבלנו שרות מעולה, אדיב אמין ומהיר, ממליץ בחום.",
    author: "יצחק שוורץ",
    initials: "יש",
  },
  {
    id: "bukris",
    quote:
      "שירות ברמה גבוהה ללקוח, ענה על הציפיות, רואים שהמקום עתיר נסיון, אדיבות, הבנת צרכי הלקוח, פתרון אישי ותואם. תודה רבה לכם.",
    author: "עדן בוכריס",
    initials: "עב",
  },
];

export const testimonialsPage = {
  title: "ממליצים עלינו",
  paragraph: "לקוחות ועסקים שליווינו לאורך השנים, בלשונם שלהם — וגם מה שכותבים עלינו בגוגל.",
};

/**
 * עמוד צור קשר — לפי מסמך האיפיון (סעיף "עמוד: צור קשר": טלפון, וואטסאפ,
 * מייל, כתובת — כל אלה כבר מוצגים ב-Footer בכל עמוד), ובנוסף טופס השארת
 * פרטים לבקשת הלקוחה. אין backend מחובר (Supabase לא מופעל בפרויקט הזה),
 * אז "שליחה" פותחת וואטסאפ עם כל הפרטים שמולאו בהודעה מוכנה לדורון —
 * בדיוק כמו שאר כפתורי הוואטסאפ באתר. אם ירצו שמירה אמיתית של פניות
 * (מייל / דאטהבייס), צריך להפעיל Supabase ב-Lovable ולחבר edge function.
 */
export const contactPage = {
  title: "יצירת קשר",
  paragraph: "טלפון, וואטסאפ, מייל או הטופס למטה — מה שנוח לכם. נחזור אליכם בהקדם.",
  form: {
    title: "השאירו פרטים ונחזור אליכם",
    namePlaceholder: "שם מלא",
    phonePlaceholder: "טלפון",
    emailPlaceholder: "אימייל (לא חובה)",
    messagePlaceholder: "ספרו לנו קצת על מה שאתם מחפשים",
    interestLabel: "תחום עניין",
    interestOptions: [
      { value: "commercial", label: "תיווך מסחרי" },
      { value: "project-marketing", label: "שיווק פרויקטים" },
      { value: "plots", label: "מגרשים" },
      { value: "other", label: "אחר" },
    ],
    submitLabel: "שליחה בוואטסאפ",
  },
} as const;

export const ctaSection = {
  titleStart: "בואו נמצא",
  titleEnd: "את הנכס",
  titleSecondLine: "הבא שלכם",
  cta: { label: "דברו איתי בוואטסאפ", href: site.whatsapp },
};

export const footer = {
  blurb: "תיווך מסחרי, שיווק פרויקטים ומגרשים בבני ברק. ליווי אישי עד קבלת המפתח.",
  columns: [
    {
      title: "ניווט",
      links: [
        { label: "דף בית", href: "/" },
        { label: "אודות", href: "/about" },
        { label: "פרויקטים", href: "/projects" },
        { label: "המלצות", href: "/testimonials" },
        { label: "צור קשר", href: "/contact" },
      ],
    },
    {
      title: "תחומי פעילות",
      links: [
        { label: "תיווך מסחרי", href: "/commercial" },
        { label: "שיווק פרויקטים", href: "/project-marketing" },
        { label: "מגרשים", href: "/plots" },
      ],
    },
  ],
  contactTitle: "יצירת קשר",
  rights: `© ${new Date().getFullYear()} דורון בן ארבון — תיווך מסחרי. כל הזכויות שמורות.`,
};
