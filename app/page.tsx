"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  cities,
  copy,
  providerPlans,
  type Locale,
  type Provider,
} from "./content";
import FiberBoxGuide from "./fiber-box-guide";
import WhatsAppIcon from "./whatsapp-icon";

const PHONE = "966547205593";
const privacyUrl =
  "https://fibernet-sa.online/%d8%b3%d9%8a%d8%a7%d8%b3%d8%a9-%d8%ae%d8%b5%d9%88%d8%b5%d9%8a%d8%a9-%d9%81%d8%a7%d9%8a%d8%a8%d8%b1-%d8%a7%d9%86%d8%aa%d8%b1%d9%86%d8%aa/";

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  if (name === "whatsapp") {
    return <WhatsAppIcon size={size} className={className} />;
  }
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    diagonal: (
      <>
        <path d="M5 19 19 5M5 5h14v14" />
      </>
    ),
    chevron: <path d="m6 9 6 6 6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    phone: (
      <path d="m7 3 3 5-3 3a15 15 0 0 0 6 6l3-3 5 3-1 4C10 23 1 14 3 4l4-1Z" />
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z" />
      </>
    ),
    wifi: (
      <>
        <path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0" />
        <circle cx="12" cy="20" r="1" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4" />
      </>
    ),
    upload: (
      <>
        <path d="M12 16V3M7 8l5-5 5 5M4 17v4h16v-4" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 16l10 5 10-5" />
      </>
    ),
    headphones: (
      <>
        <path d="M4 13v-2a8 8 0 0 1 16 0v7a4 4 0 0 1-4 4h-4" />
        <rect x="2" y="11" width="5" height="8" rx="2" />
        <rect x="17" y="11" width="5" height="8" rx="2" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    play: (
      <>
        <rect x="2" y="4" width="20" height="15" rx="3" />
        <path d="m10 8 5 3.5-5 3.5V8ZM8 22h8" />
      </>
    ),
    laptop: (
      <>
        <rect x="4" y="3" width="16" height="13" rx="2" />
        <path d="m4 16-3 5h22l-3-5M9 21h6" />
      </>
    ),
    game: (
      <>
        <path d="M7 7h10c3 0 6 11 4 13-2 2-5-3-6-3H9c-1 0-4 5-6 3C1 18 4 7 7 7Z" />
        <path d="M7 10v6M4 13h6M16 11h.01M19 14h.01" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-8 9 8v11h-6v-7H9v7H3V10Z" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m5 5 14 14M19 5 5 19" />,
  };
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.arrow}
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand ${light ? "brand-light" : ""}`}>
      <img
        className="brand-mark"
        src={
          light
            ? "/images/brand/fibernet-mark-light.svg"
            : "/images/brand/fibernet-mark.svg"
        }
        width="40"
        height="44"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-name">
        fiber<span>net</span>
        <small>FIBER INTERNET · KSA</small>
      </span>
    </span>
  );
}

function ProviderLogo({
  provider,
  muted = false,
}: {
  provider: string;
  muted?: boolean;
}) {
  return (
    <span
      className={`provider-logo provider-${provider} ${muted ? "muted" : ""}`}
      dir="ltr"
    >
      {provider === "salam" && (
        <>
          <svg
            width="23"
            height="29"
            viewBox="0 0 23 29"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 1C2 4-2 18 2 23c4 5 13 5 19 6C20 17 15 6 6 1Z"
              fill="currentColor"
            />
          </svg>
          <span>salam</span>
        </>
      )}
      {provider === "stc" && (
        <span>
          stc<span className="stc-dot">.</span>
        </span>
      )}
      {provider === "zain" && (
        <>
          <svg
            width="35"
            height="29"
            viewBox="0 0 35 29"
            fill="none"
            aria-hidden="true"
          >
            <ellipse
              cx="17"
              cy="14.5"
              rx="15"
              ry="12"
              transform="rotate(-23 17 14.5)"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M3 15C10 3 28 3 30 10 32 17 10 23 8 17 6 12 23 9 30 12M8 23c8 3 21-5 24-12"
              stroke="currentColor"
              strokeWidth="1.7"
            />
          </svg>
          <span>zain</span>
        </>
      )}
      {provider === "mobily" && (
        <>
          <span className="mobily-mark">▥</span>
          <span>mobily</span>
        </>
      )}
    </span>
  );
}

function SaudiMap({ locale }: { locale: Locale }) {
  return (
    <div className="saudi-map" aria-hidden="true">
      <svg viewBox="0 0 540 430" className="map-svg">
        <defs>
          <pattern
            id="map-dots"
            x="0"
            y="0"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.35" fill="#5e7cba" />
          </pattern>
          <radialGradient id="map-glow">
            <stop stopColor="#2462ff" stopOpacity=".18" />
            <stop offset="1" stopColor="#2462ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="275" cy="225" r="200" fill="url(#map-glow)" />
        <path
          d="M102 66 165 83 217 48 280 66 335 98 366 99 381 134 406 155 416 194 442 215 464 241 442 286 380 313 318 331 293 351 252 362 231 345 201 351 181 323 153 291 139 257 119 229 103 202 91 164 74 143 66 108 83 88Z"
          fill="url(#map-dots)"
          stroke="#547ad1"
          strokeOpacity=".2"
        />
        <path
          className="map-connection"
          d="M278 211 373 170M278 211 155 270M278 211 209 321M278 211 368 155M278 211 221 160"
          stroke="#547ad1"
          strokeWidth="1"
          fill="none"
          strokeDasharray="4 5"
          opacity=".55"
        />
        {[
          [278, 211],
          [373, 170],
          [155, 270],
          [209, 321],
          [368, 155],
          [221, 160],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={i === 0 ? 19 : 11}
              fill="#5189ff"
              opacity=".12"
            />
            <circle
              cx={x}
              cy={y}
              r={i === 0 ? 7 : 4}
              fill={i === 0 ? "#a9cbff" : "#649cff"}
            />
            <circle
              cx={x}
              cy={y}
              r={i === 0 ? 7 : 4}
              fill="none"
              stroke="#87b7ff"
            />
          </g>
        ))}
        <text x="292" y="211" className="map-city">
          {locale === "ar" ? "الرياض" : "Riyadh"}
        </text>
        <text x="382" y="184" className="map-city">
          {locale === "ar" ? "الدمام" : "Dammam"}
        </text>
        <text x="113" y="293" className="map-city">
          {locale === "ar" ? "جدة" : "Jeddah"}
        </text>
      </svg>
      <div className="map-caption">
        <span className="status-dot" />
        {copy[locale].mapLabel}
      </div>
    </div>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [provider, setProvider] = useState<Provider>("salam");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [errors, setErrors] = useState({ city: "", district: "" });
  const menuRef = useRef<HTMLButtonElement>(null);
  const t = copy[locale];
  const isAr = locale === "ar";
  const waLink = (message?: string) =>
    `https://wa.me/${PHONE}?text=${encodeURIComponent(message || (isAr ? "مرحباً فايبرنت، أود الاستفسار عن باقات الإنترنت المنزلي." : "Hello FiberNet, I’d like help choosing a home internet plan."))}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fibernet-language");
      if (saved === "ar" || saved === "en") setLocale(saved);
    } catch {}
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.title = isAr
      ? "فايبرنت | قارن باقات الفايبر المنزلي"
      : "FiberNet | Compare home fiber internet packages";
  }, [locale, isAr]);
  useEffect(() => {
    const sections = [
      "home",
      "plans",
      "why-fibernet",
      "coverage",
      "fiber-boxes",
      "faq",
    ]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    const header = document.querySelector<HTMLElement>(".header");
    let frame = 0;

    const updateActiveSection = () => {
      frame = 0;
      // Measure every section together: observer entries only describe changes
      // and can miss sections when a fast scroll skips their detection band.
      const marker = (header?.getBoundingClientRect().bottom ?? 0) + 24;
      let current = sections[0]?.id ?? "home";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      // The last section may never reach the header on a tall viewport.
      if (
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2
      ) {
        current = sections.at(-1)?.id ?? current;
      }
      setActiveSection((previous) => previous === current ? previous : current);
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);
    if (header) resizeObserver.observe(header);
    scheduleUpdate();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, []);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [menuOpen]);

  const toggleLocale = () => {
    const next = isAr ? "en" : "ar";
    setLocale(next);
    setMenuOpen(false);
    setErrors({ city: "", district: "" });
    try {
      localStorage.setItem("fibernet-language", next);
    } catch {}
  };

  function submitCoverage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = {
      city: city ? "" : t.cityError,
      district: district.trim() ? "" : t.districtError,
    };
    setErrors(validation);
    if (validation.city || validation.district) {
      document.getElementById(validation.city ? "city" : "district")?.focus();
      return;
    }
    const chosenCity = cities.find((c) => c.value === city)?.[locale] || city;
    const message = isAr
      ? `مرحباً فايبرنت، أود الاستفسار عن تغطية الفايبر.\nالمدينة: ${chosenCity}\nالحي: ${district.trim()}`
      : `Hello FiberNet, please help me check fiber availability.\nCity: ${chosenCity}\nNeighbourhood: ${district.trim()}`;
    window.open(waLink(message), "_blank", "noopener,noreferrer");
  }

  const navItems = [
    { href: "#home", label: t.home },
    { href: "#plans", label: t.plans },
    { href: "#why-fibernet", label: t.why },
    { href: "#coverage", label: t.coverage },
    { href: "#fiber-boxes", label: t.boxesNav },
    { href: "#faq", label: t.faq },
  ];

  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <div className="announcement">
        <div className="container announcement-inner">
          <span>
            <span className="status-dot" />
            {t.announcement}{" "}
            <a href="#plans">
              {t.announcementLink}
              <Icon name="arrow" size={13} />
            </a>
          </span>
          <a className="announcement-phone" href="tel:+966547205593">
            <Icon name="phone" size={13} />
            <bdi>054 720 5593</bdi>
          </a>
        </div>
      </div>
      <header className="header">
        <div className="container nav-wrap">
          <a
            href="#home"
            className="brand-link"
            aria-label={isAr ? "فايبرنت، الرئيسية" : "FiberNet home"}
          >
            <Brand />
          </a>
          <nav
            aria-label={isAr ? "القائمة الرئيسية" : "Main navigation"}
            className="desktop-nav"
          >
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={activeSection === n.href.slice(1) ? "active" : ""}
                aria-current={
                  activeSection === n.href.slice(1) ? "location" : undefined
                }
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <button
              onClick={toggleLocale}
              className="language-button"
              aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Icon name="globe" size={17} />
              <span lang={isAr ? "en" : "ar"}>{t.language}</span>
            </button>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-dark nav-contact"
            >
              {t.contact}
              <Icon name="diagonal" size={16} />
            </a>
            <button
              ref={menuRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="menu-button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t.close : t.menu}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label={isAr ? "قائمة الهاتف" : "Mobile navigation"}
          >
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setMenuOpen(false)}
                aria-current={
                  activeSection === n.href.slice(1) ? "location" : undefined
                }
              >
                {n.label}
                <Icon name="arrow" size={18} />
              </a>
            ))}
            <a
              className="mobile-nav-contact"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" />
              {t.contact}
            </a>
            <a
              className="mobile-nav-call"
              href="tel:+966547205593"
              aria-label={t.callLabel}
            >
              <Icon name="phone" />
              {t.callNow}
              <bdi>054 720 5593</bdi>
            </a>
          </nav>
        )}
      </header>

      <main id="main">
        <section className="hero-section" id="home">
          <div className="hero-photo">
            <img
              src="/images/fiber-photograph.jpg"
              width="1800"
              height="1146"
              className="hero-image"
              alt={
                isAr
                  ? "خيوط ألياف بصرية حقيقية مضاءة باللون الأزرق"
                  : "A real bundle of optical fibers carrying blue light"
              }
              fetchPriority="high"
            />
          </div>
          <div className="hero-grain" aria-hidden="true" />
          <div className="container hero">
            <div className="hero-content">
              <p className="eyebrow">
                <span className="short-line" />
                {t.eyebrow}
              </p>
              <h1>
                {t.heroLine1}
                <br />
                {t.heroLine2}
                <br />
                <span>{t.heroLine3}</span>
              </h1>
              <p className="hero-description">{t.heroDescription}</p>
              <div className="hero-buttons">
                <a className="button button-blue" href="#plans">
                  {t.explore}
                  <Icon name="arrow" size={19} />
                </a>
                <a className="button button-hero-outline" href="#coverage">
                  {t.checkCoverage}
                  <Icon name="pin" size={18} />
                </a>
              </div>
              <div className="hero-reassurance">
                <span>
                  <Icon name="check" size={15} />
                  {t.heroNote1}
                </span>
                <span>
                  <Icon name="check" size={15} />
                  {t.heroNote2}
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="fiber-label">
                <span className="status-dot" />
                {isAr ? "تقنية الألياف البصرية" : "POWERED BY FIBER OPTICS"}
              </div>
              <div className="hero-speed">
                <span>{t.speedUp}</span>
                <div>
                  <strong dir="ltr">
                    1<span>Gbps</span>
                  </strong>
                  <Icon name="diagonal" size={46} />
                </div>
                <p>
                  {isAr
                    ? "سرعات متاحة في باقات مختارة. حسب تغطية عنوانك."
                    : "Available on selected packages. Subject to coverage."}
                </p>
              </div>
            </div>
          </div>
          <div className="container hero-bottom">
            <p>
              <Icon name="headphones" size={16} />
              {isAr
                ? "مندوب مستقل. نساعدك تقارن وتقدم طلبك."
                : "Independent subscription assistance. One number to get started."}
            </p>
            <a href="tel:+966547205593">
              <bdi>054 720 5593</bdi>
              <Icon name="diagonal" size={15} />
            </a>
          </div>
        </section>

        <section className="providers container" aria-label={t.providerLabel}>
          <div className="providers-caption">
            <p className="eyebrow">{t.providerLabel}</p>
            <p>{t.providerSub}</p>
          </div>
          <div className="provider-row">
            {["salam", "stc", "zain"].map((p) => (
              <ProviderLogo key={p} provider={p} />
            ))}
          </div>
          <a className="providers-link" href="#plans">
            {isAr ? "شوف الباقات" : "See the packages"}
            <Icon name="arrow" size={18} />
          </a>
        </section>

        <section className="plans-section section-pad" id="plans">
          <div className="container">
            <div className="section-heading centered">
              <p className="eyebrow">{t.plansEyebrow}</p>
              <h2>{t.plansTitle}</h2>
              <p>{t.plansDescription}</p>
            </div>
            <div
              className="provider-tabs"
              role="tablist"
              aria-label={isAr ? "مزود الإنترنت" : "Internet provider"}
            >
              {(["salam", "stc", "zain"] as Provider[]).map((p) => (
                <button
                  id={`tab-${p}`}
                  key={p}
                  role="tab"
                  aria-selected={provider === p}
                  aria-controls="plans-panel"
                  tabIndex={provider === p ? 0 : -1}
                  className={provider === p ? "selected" : ""}
                  onClick={() => setProvider(p)}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const opts: Provider[] = ["salam", "stc", "zain"];
                      const direction =
                        (e.key === "ArrowRight" ? 1 : -1) * (isAr ? -1 : 1);
                      const next =
                        e.key === "Home"
                          ? opts[0]
                          : e.key === "End"
                            ? opts[2]
                            : opts[(opts.indexOf(p) + direction + 3) % 3];
                      setProvider(next);
                      document.getElementById(`tab-${next}`)?.focus();
                    }
                  }}
                >
                  <ProviderLogo provider={p} />
                </button>
              ))}
            </div>
            <div
              className="plan-grid"
              id="plans-panel"
              role="tabpanel"
              aria-labelledby={`tab-${provider}`}
              tabIndex={0}
            >
              {providerPlans[provider].map((plan, i) => {
                const descriptors = [t.basic, t.plus, t.max];
                const descriptions = [t.basicDesc, t.plusDesc, t.maxDesc];
                const message = isAr
                  ? `مرحباً، أود الاستفسار عن باقة ${plan.arName} بسعر ${plan.price} ر.س شهرياً. يرجى تأكيد العرض والتغطية وشروط الاشتراك.`
                  : `Hello, I’m interested in ${plan.name} listed at SAR ${plan.price}/month. Please confirm the current offer, coverage and contract terms.`;
                return (
                  <article
                    key={`${provider}-${i}`}
                    className={`plan-card ${i === 1 ? "featured" : ""}`}
                  >
                    {i === 1 && (
                      <div className="recommended">
                        <Icon name="check" size={14} />
                        {t.recommended}
                      </div>
                    )}
                    <div className="plan-topline">
                      <span className="plan-provider-name">
                        {isAr ? plan.arName : plan.name}
                      </span>
                      <Icon
                        name={i === 0 ? "home" : i === 1 ? "layers" : "wifi"}
                        size={22}
                      />
                    </div>
                    <h3>{descriptors[i]}</h3>
                    <p className="plan-description">{descriptions[i]}</p>
                    <div className="plan-speed">
                      <strong dir="ltr">
                        {plan.download.toLocaleString("en-US")}
                      </strong>
                      <span>
                        {t.speedUnit}
                        <small>
                          {t.upTo} {t.download.toLowerCase()}
                        </small>
                      </span>
                    </div>
                    <div className="plan-price">
                      <span className="currency">{t.sar}</span>
                      <strong>{plan.price.toLocaleString("en-US")}</strong>
                      <span>{t.monthly}</span>
                    </div>
                    <div className="plan-promo-label">
                      {plan.promo ? (
                        <>
                          <span className="status-dot" />
                          {t.promo}
                        </>
                      ) : (
                        <span>
                          {isAr ? "باقة فايبر منزلي" : "HOME FIBER PLAN"}
                        </span>
                      )}
                    </div>
                    <div className="plan-divider" />
                    <ul className="plan-benefits">
                      <li>
                        <Icon name="check" size={15} />
                        <span>
                          {t.upTo} <bdi>{plan.upload}</bdi> {t.speedUnit}{" "}
                          {t.upload.toLowerCase()}
                        </span>
                      </li>
                      {plan.benefits.map((benefit) => (
                        <li key={benefit}>
                          <Icon name="check" size={15} />
                          <span>{t[benefit as keyof typeof t] as string}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="plan-terms">
                      {t[plan.note as keyof typeof t] as string}
                    </p>
                    <a
                      href={waLink(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`button ${i === 1 ? "button-primary" : "button-outline"}`}
                    >
                      {t.choose}
                      <Icon name="arrow" size={17} />
                    </a>
                  </article>
                );
              })}
            </div>
            <p className="price-note">{t.priceNote}</p>
            <div className="plan-help">
              <span>{t.helpPlan}</span>
              <a
                className="text-link"
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.helpLink}
                <Icon name="arrow" size={17} />
              </a>
            </div>
          </div>
        </section>

        <section
          className="why-section section-pad container"
          id="why-fibernet"
        >
          <div className="why-intro">
            <p className="eyebrow">
              <span className="short-line" />
              {t.whyEyebrow}
            </p>
            <h2 className="preserve-lines">{t.whyTitle}</h2>
            <p>{t.whyDescription}</p>
            <a
              href={waLink()}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {isAr ? "اسأل مندوب المبيعات" : "Ask a sales representative"}
              <Icon name="arrow" size={18} />
            </a>
            <div className="representative-number">
              <Icon name="phone" size={20} />
              <div>
                <span>
                  {isAr ? "تواصل معنا مباشرة" : "Speak to us directly"}
                </span>
                <a href="tel:+966547205593" dir="ltr">
                  054 720 5593
                </a>
              </div>
            </div>
          </div>
          <div className="why-items">
            {t.whyItems.map((item, i) => (
              <article key={item.icon} className="why-item">
                <span className="feature-icon">0{i + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="steps-band">
          <div className="steps-section section-pad container">
            <div className="section-heading centered">
              <p className="eyebrow">{t.stepEyebrow}</p>
              <h2>{t.stepTitle}</h2>
            </div>
            <div className="step-grid">
              {t.steps.map((step, i) => (
                <article key={step.title} className="step">
                  <div className="step-top">
                    <span>0{i + 1}</span>
                    <Icon name={["pin", "layers", "wifi"][i]} size={25} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="coverage-section" id="coverage">
          <div className="container coverage-layout">
            <div className="coverage-content">
              <p className="eyebrow">
                <span className="status-dot" />
                {t.coverageEyebrow}
              </p>
              <h2 className="preserve-lines">{t.coverageTitle}</h2>
              <p>{t.coverageDescription}</p>
              <form
                onSubmit={submitCoverage}
                noValidate
                className="coverage-form"
              >
                <div className="coverage-fields">
                  <div className="form-field">
                    <label htmlFor="city">{t.cityLabel}</label>
                    <div className="select-wrap">
                      <Icon name="pin" size={17} />
                      <select
                        id="city"
                        name="city"
                        value={city}
                        required
                        aria-invalid={!!errors.city}
                        aria-describedby={
                          errors.city ? "city-error" : undefined
                        }
                        onChange={(e) => {
                          setCity(e.target.value);
                          setErrors({ ...errors, city: "" });
                        }}
                      >
                        <option value="">{t.cityPlaceholder}</option>
                        {cities.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c[locale]}
                          </option>
                        ))}
                      </select>
                      <Icon name="chevron" size={15} />
                    </div>
                    {errors.city && (
                      <span
                        className="field-error"
                        id="city-error"
                        role="alert"
                      >
                        {errors.city}
                      </span>
                    )}
                  </div>
                  <div className="form-field">
                    <label htmlFor="district">{t.districtLabel}</label>
                    <input
                      id="district"
                      name="district"
                      value={district}
                      required
                      maxLength={100}
                      placeholder={t.districtPlaceholder}
                      autoComplete="address-level3"
                      aria-invalid={!!errors.district}
                      aria-describedby={
                        errors.district ? "district-error" : undefined
                      }
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setErrors({ ...errors, district: "" });
                      }}
                    />
                    {errors.district && (
                      <span
                        className="field-error"
                        id="district-error"
                        role="alert"
                      >
                        {errors.district}
                      </span>
                    )}
                  </div>
                </div>
                <button className="button button-primary" type="submit">
                  {t.coverageButton}
                  <Icon name="whatsapp" size={20} />
                </button>
                <small>{t.coverageNote}</small>
              </form>
            </div>
            <div className="coverage-map">
              <div className="map-heading">
                <span>
                  {isAr
                    ? "السعودية / مناطق الاستفسار"
                    : "SAUDI ARABIA / SERVICE ENQUIRIES"}
                </span>
                <Icon name="pin" size={17} />
              </div>
              <SaudiMap locale={locale} />
              <div className="city-tags">
                {cities.slice(0, 6).map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      setCity(c.value);
                      document.getElementById("district")?.focus();
                    }}
                    className={city === c.value ? "selected" : ""}
                  >
                    {c[locale]}
                  </button>
                ))}
                <span>{t.cityMore}</span>
              </div>
            </div>
          </div>
        </section>

        <aside
          className="connection-options container"
          aria-label={t.alternativeTitle}
        >
          <span className="connection-options-icon">
            <Icon name="wifi" size={27} />
          </span>
          <div>
            <h3>{t.alternativeTitle}</h3>
            <p>{t.alternativeDescription}</p>
          </div>
          <a
            className="text-link"
            href={waLink(t.alternativeMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.alternativeButton}
            <Icon name="arrow" size={18} />
          </a>
        </aside>

        <FiberBoxGuide locale={locale} />

        <section className="faq-section section-pad container" id="faq">
          <div className="faq-intro">
            <p className="eyebrow">{t.faqEyebrow}</p>
            <h2>{t.faqTitle}</h2>
            <p>{t.faqDescription}</p>
            <a
              href={waLink()}
              className="text-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.contact}
              <Icon name="arrow" size={17} />
            </a>
          </div>
          <div className="faq-list">
            {t.faqs.map((item, i) => (
              <div
                className={`faq-item ${openFaq === i ? "open" : ""}`}
                key={i}
              >
                <h3>
                  <button
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {item.question}
                    <span className="faq-toggle">
                      <Icon name="plus" size={18} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  hidden={openFaq !== i}
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section container">
          <svg
            className="cta-fiber-mark"
            viewBox="0 0 300 300"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 290C10 140 95 25 240 20M10 290C70 140 160 85 275 90M10 290C110 190 200 160 275 170M10 290C140 240 210 235 245 240"
              stroke="currentColor"
              strokeWidth="2"
            />
            <g fill="currentColor">
              <circle cx="240" cy="20" r="6" />
              <circle cx="275" cy="90" r="6" />
              <circle cx="275" cy="170" r="6" />
              <circle cx="245" cy="240" r="6" />
            </g>
          </svg>
          <div className="cta-copy">
            <p className="eyebrow">
              <Icon name="whatsapp" size={19} />
              {isAr ? "تواصل مع فايبرنت" : "CONTACT FIBERNET"}
            </p>
            <h2 className="preserve-lines">{t.ctaTitle}</h2>
            <p>{t.ctaDescription}</p>
          </div>
          <div className="cta-actions">
            <a
              href={waLink()}
              className="button button-dark"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="whatsapp" size={20} />
              {t.ctaButton}
              <Icon name="diagonal" size={17} />
            </a>
            <a
              href="tel:+966547205593"
              className="button cta-call-button"
              aria-label={t.callLabel}
            >
              <Icon name="phone" size={19} />
              <span>
                {t.callNow}
                <strong dir="ltr">054 720 5593</strong>
              </span>
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a
                href="#home"
                className="brand-link"
                aria-label={isAr ? "فايبرنت، الرئيسية" : "FiberNet home"}
              >
                <Brand light />
              </a>
              <p>{t.footerDescription}</p>
              <span className="footer-location">
                <Icon name="pin" size={15} />
                {t.footerLocation}
              </span>
            </div>
            <div className="footer-link-column">
              <h3>{t.footerExplore}</h3>
              <a href="#plans">{t.plans}</a>
              <a href="#why-fibernet">{t.why}</a>
              <a href="#coverage">{t.coverage}</a>
              <a href="#fiber-boxes">{t.boxesNav}</a>
            </div>
            <div className="footer-link-column">
              <h3>{t.footerSupport}</h3>
              <a href="#faq">{t.faq}</a>
              <a href={waLink()} target="_blank" rel="noopener noreferrer">
                {t.whatsapp}
                <Icon name="diagonal" size={12} />
              </a>
              <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
                {t.privacy}
                <Icon name="diagonal" size={12} />
              </a>
            </div>
            <div className="footer-contact">
              <p>{t.contact}</p>
              <a href="tel:+966547205593" dir="ltr">
                054 720 5593
                <Icon name="diagonal" size={21} />
              </a>
              <button className="language-button" onClick={toggleLocale}>
                <Icon name="globe" size={17} />
                <span lang={isAr ? "en" : "ar"}>{t.language}</span>
              </button>
            </div>
          </div>
          <p className="independent-note">{t.footerIndependent}</p>
          <div className="footer-bottom">
            <span>{t.copyright}</span>
            <a
              className="photo-credit"
              href="https://unsplash.com/photos/INNsF0Zz_kQ"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photo: Compare Fibre / Unsplash
            </a>
            <a href="#home">
              {t.backTop}
              <Icon name="arrow" size={16} />
            </a>
          </div>
        </div>
      </footer>
      <div
        className="contact-dock"
        role="group"
        aria-label={isAr ? "تواصل مع فايبرنت" : "Contact FiberNet"}
      >
        <a
          href="tel:+966547205593"
          className="dock-call"
          aria-label={t.callLabel}
        >
          <Icon name="phone" size={20} />
          <span>
            {t.callNow}
            <small dir="ltr">054 720 5593</small>
          </span>
        </a>
        <a
          href={waLink()}
          className="dock-whatsapp"
          aria-label={t.whatsappLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="whatsapp" size={23} />
          <span>
            {t.whatsapp}
            <small>{isAr ? "أرسل رسالة" : "Send a message"}</small>
          </span>
        </a>
      </div>
    </>
  );
}
