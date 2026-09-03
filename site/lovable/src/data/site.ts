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
  },
  {
    id: "glory",
    category: "commercial" as ProjectCategory,
    title: "יבואן גלורי",
    description:
      "מחסנים ומשרדים ליבואן פעיל — שילוב של שטח אחסון נוח וקומת משרדים צמודה.",
    location: "רח׳ הקישון, בני ברק",
    tags: ["300 מ״ר", "מחסנים ומשרדים"],
    // TODO placeholder — אין תצלום של העסקה הזו בפרוספקט
    image: "/images/proj-glory.jpg",
  },
  {
    id: "mishkan",
    category: "commercial" as ProjectCategory,
    title: "משכן התכלת",
    description:
      "השכרת ארבע חנויות ברחבי בני ברק לרשת אחת, בהתאמה מדויקת של מיקום וקהל לכל סניף.",
    location: "ברחבי בני ברק",
    tags: ["4 חנויות", "רשת קמעונאית"],
    // תצלום אמיתי מהפרוספקט — חזית הסניף
    image: "/images/proj-mishkan.jpg",
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

export const testimonialsSection = {
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
