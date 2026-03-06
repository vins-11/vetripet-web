import { useEffect, useMemo, useRef, useState } from "react";

type ContactStatus =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "sent"; message: string }
  | { type: "error"; message: string };

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as
  | string
  | undefined;

const APP_STORE_URL = import.meta.env.VITE_APP_STORE_URL as string | undefined;
const PLAY_STORE_URL = import.meta.env.VITE_PLAY_STORE_URL as string | undefined;

const MEDIA = {
  logo: "/media/vetripet-logo.jpg",
  hero: "/media/hero-pets.jpg",
  consult: "/media/feature-consult.jpg",
  ambulance: "/media/feature-ambulance.jpg",
} as const;

const CONTACT_EMAIL = "vetripet24@gmail.com";
const CONTACT_PHONE_DISPLAY = "+91 9549913064";
const CONTACT_PHONE_TEL = "+919549913064";

function DownloadButton({
  platform,
  href,
}: {
  platform: "ios" | "android";
  href?: string;
}) {
  const isIos = platform === "ios";
  const labelTop = isIos ? "Download on the" : "Get it on";
  const labelBottom = isIos ? "App Store" : "Google Play";

  const base =
    "group inline-flex w-full items-center justify-center gap-3 rounded-2xl px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto";

  const enabledStyles = isIos
    ? "bg-black text-white hover:bg-black/90"
    : "bg-brand-green text-white hover:bg-brand-greenDark";
  const disabledStyles =
    "cursor-not-allowed bg-black/10 text-black/40 hover:translate-y-0 hover:shadow-sm";

  const cls = cn(base, href ? enabledStyles : disabledStyles);
  const icon = isIos ? "" : "▶";

  const inner = (
    <>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl text-sm",
          href ? "bg-white/10" : "bg-black/5"
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className="flex flex-col leading-tight">
        <span
          className={cn(
            "text-[0.65rem] uppercase tracking-[0.14em]",
            href ? "text-white/70" : "text-black/40"
          )}
        >
          {labelTop}
        </span>
        <span className="text-sm font-semibold">{labelBottom}</span>
      </span>
      {!href ? (
        <span className="ml-2 rounded-full bg-black/5 px-2 py-1 text-[0.65rem] font-semibold text-black/50">
          Coming soon
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return (
      <div className={cls} aria-disabled="true">
        {inner}
      </div>
    );
  }

  return (
    <a className={cls} href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  );
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    el.classList.add("reveal");
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70 shadow-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs font-semibold tracking-widest text-brand-green/90">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-black md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-pretty text-sm leading-6 text-black/60 md:text-base">
        {description}
      </p>
    </div>
  );
}

function Card({
  title,
  body,
  icon,
}: {
  title: string;
  body: string;
  icon: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,.08)]">
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-green/10 blur-2xl transition group-hover:bg-brand-green/15" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/10 bg-white text-lg shadow-sm">
          <span aria-hidden>{icon}</span>
        </div>
        <div>
          <div className="text-lg font-semibold text-black">{title}</div>
          <p className="mt-1 text-sm leading-6 text-black/60">{body}</p>
        </div>
      </div>
    </div>
  );
}

function Button({
  as = "button",
  href,
  children,
  variant = "primary",
  className,
  type,
  onClick,
}: {
  as?: "a" | "button";
  href?: string;
  children: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white";
  const styles =
    variant === "primary"
      ? "bg-brand-green text-white hover:bg-brand-greenDark"
      : variant === "secondary"
        ? "bg-brand-orange/15 text-brand-green hover:bg-brand-orange/25"
        : "text-black/70 hover:text-black";

  const cls = cn(base, styles, className);

  if (as === "a") {
    return (
      <a className={cls} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={cls} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      className="rounded-lg px-3 py-2 text-sm font-medium text-black/70 hover:bg-black/5 hover:text-black"
      href={href}
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <a className="text-sm text-black/60 hover:text-black" href={href}>
      {children}
    </a>
  );
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<
    "idle" | "saved" | "invalid"
  >("idle");

  const [contactStatus, setContactStatus] = useState<ContactStatus>({
    type: "idle",
  });
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const features = useMemo(
    () => [
      {
        icon: "🩺",
        title: "Online vet consultation",
        body: "Chat or call with verified vets for quick guidance, follow-ups, and prescriptions — without the travel stress.",
      },
      {
        icon: "💊",
        title: "Medicine ordering",
        body: "Order pet medicines and essentials from your phone and get them delivered to your doorstep (service availability may vary by area).",
      },
      {
        icon: "🚑",
        title: "24/7 ambulance emergency",
        body: "When it’s urgent, request emergency pickup support for your pet — anytime, day or night.",
      },
      {
        icon: "📅",
        title: "Appointment booking",
        body: "Book clinic visits and schedule checkups in seconds. Receive reminders so you never miss a visit.",
      },
    ],
    []
  );

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setContactStatus({ type: "sending" });

    const name = contact.name.trim();
    const email = contact.email.trim();
    const phone = contact.phone.trim();
    const message = contact.message.trim();

    if (!name || !email || !message) {
      setContactStatus({
        type: "error",
        message: "Please fill name, email, and message.",
      });
      return;
    }
    if (!isValidEmail(email)) {
      setContactStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    const payload = {
      access_key: import.meta.env.VITE_WEB3FORM_KEY,
      name,
      email,
      phone: phone || undefined,
      message,
      subject: "New message from Vetript website",
      source: "vetript-website",
      ts: new Date().toISOString(),
      botcheck: "",
    };

    // If you configure an endpoint, we’ll send JSON to it.
    if (CONTACT_ENDPOINT) {
      try {
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        setContactStatus({
          type: "sent",
          message: "Thanks! We received your message and will get back to you.",
        });
        setContact({ name: "", email: "", phone: "", message: "" });
        return;
      } catch {
        setContactStatus({
          type: "error",
          message:
            "We couldn’t send your message right now. Please use email/phone below.",
        });
        return;
      }
    }

    // Otherwise fall back to opening the user’s email client.
    const subject = encodeURIComponent("Vetript — Website contact");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n\nMessage:\n${message}\n`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setContactStatus({
      type: "sent",
      message: "Opening your email app…",
    });
  }

  function joinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    const email = waitlistEmail.trim();
    if (!email || !isValidEmail(email)) {
      setWaitlistStatus("invalid");
      return;
    }
    try {
      const existingRaw = localStorage.getItem("vetript_waitlist");
      const existing = existingRaw ? (JSON.parse(existingRaw) as string[]) : [];
      const next = Array.from(new Set([...existing, email.toLowerCase()]));
      localStorage.setItem("vetript_waitlist", JSON.stringify(next));
      setWaitlistEmail("");
      setWaitlistStatus("saved");
      setTimeout(() => setWaitlistStatus("idle"), 2500);
    } catch {
      setWaitlistStatus("saved");
      setTimeout(() => setWaitlistStatus("idle"), 2500);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-[-10%] h-[560px] w-[560px] rounded-full bg-brand-green/10 blur-3xl floaty" />
        <div className="absolute top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-brand-orange/15 blur-3xl floaty" style={{ animationDelay: "1.2s" }} />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(2,6,23,.30)_1px,transparent_1px),linear-gradient(to_bottom,rgba(2,6,23,.30)_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <a href="#top" className="flex items-center gap-2">
            <img
              src={MEDIA.logo}
              alt="Vetripet 24/7"
              className="h-9 w-auto"
              loading="eager"
            />
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how">How it works</NavLink>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#coming-soon">App</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button as="a" href="#coming-soon" variant="secondary">
              Join waitlist
            </Button>
            <Button as="a" href="#contact">
              Talk to us
            </Button>
          </div>

          <button
            className="md:hidden rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/80 hover:bg-black/5"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            Menu
          </button>
        </div>

        {menuOpen ? (
          <div className="border-t border-black/10 md:hidden">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <div className="grid gap-1">
                <NavLink href="#features">Features</NavLink>
                <NavLink href="#how">How it works</NavLink>
                <NavLink href="#about">About</NavLink>
                <NavLink href="#coming-soon">App</NavLink>
                <NavLink href="#contact">Contact</NavLink>
              </div>
              <div className="mt-3 flex gap-2">
                <Button as="a" href="#coming-soon" variant="secondary">
                  Join waitlist
                </Button>
                <Button as="a" href="#contact">
                  Talk to us
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Hero */}
      <main id="top">
        <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 md:px-6 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <Badge>App coming soon</Badge>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-black md:text-5xl">
                Care for your pet,
                <span className="text-brand-green"> anytime.</span>
              </h1>
              <p className="mt-3 max-w-xl text-pretty text-base leading-7 text-black/60">
                One simple app to{" "}
                <span className="font-semibold text-black">
                  consult vets online
                </span>
                ,{" "}
                <span className="font-semibold text-black">
                  order medicines
                </span>
                ,{" "}
                <span className="font-semibold text-black">
                  book clinic appointments
                </span>{" "}
                and{" "}
                <span className="font-semibold text-black">
                  get 24/7 emergency support
                </span>
                — all built for busy pet parents.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button as="a" href="#coming-soon">
                  Get early access
                </Button>
                <Button as="a" href="#features" variant="secondary">
                  Explore features
                </Button>
                <Button as="a" href="#contact" variant="ghost">
                  Contact
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-xs text-black/60">
                <div className="rounded-xl border border-black/10 bg-white px-3 py-2">
                  <span className="font-semibold text-black/80">Fast</span>{" "}
                  consultations
                </div>
                <div className="rounded-xl border border-black/10 bg-white px-3 py-2">
                  <span className="font-semibold text-black/80">Trusted</span>{" "}
                  vets & partners
                </div>
                <div className="rounded-xl border border-black/10 bg-white px-3 py-2">
                  <span className="font-semibold text-black/80">24/7</span>{" "}
                  emergency support
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-brand-green/10 via-white to-brand-orange/10 blur-2xl" />
              <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(2,6,23,.10)]">
                <img
                  src={MEDIA.hero}
                  alt="Happy dog and cat at a vet clinic"
                  className="h-[420px] w-full object-cover md:h-[520px]"
                  loading="eager"
                />
              </div>
              <div className="pointer-events-none absolute -bottom-6 left-6 right-6 rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-black/60">
                  <span>
                    <span className="font-semibold text-black/80">
                      Consult
                    </span>{" "}
                    online vets
                  </span>
                  <span>
                    <span className="font-semibold text-black/80">Order</span>{" "}
                    medicines
                  </span>
                  <span>
                    <span className="font-semibold text-black/80">Book</span>{" "}
                    appointments
                  </span>
                  <span>
                    <span className="font-semibold text-black/80">
                      Emergency
                    </span>{" "}
                    24/7
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div ref={useReveal<HTMLDivElement>()}>
            <SectionTitle
            eyebrow="FEATURES"
            title="Everything you need for pet care — in one app"
            description="From quick vet guidance to emergency help, Vetript is designed to keep pet parents confident and supported."
          />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {features.map((f) => (
                <Card key={f.title} title={f.title} body={f.body} icon={f.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div ref={useReveal<HTMLDivElement>()}>
            <SectionTitle
              eyebrow="HOW IT WORKS"
              title="Simple flows that save time"
              description="A few taps to get help. Built for speed, clarity, and calm — especially when you’re worried."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Choose a service",
                  body: "Consult a vet, book an appointment, order medicines, or request emergency support.",
                },
                {
                  step: "02",
                  title: "Share symptoms & details",
                  body: "Provide your pet’s info so the vet/partner can respond quickly with the right context.",
                },
                {
                  step: "03",
                  title: "Get support & follow-up",
                  body: "Receive guidance, prescriptions (where applicable), updates, and reminders.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(2,6,23,.08)]"
                >
                  <div className="text-xs font-semibold tracking-widest text-brand-green/90">
                    STEP {s.step}
                  </div>
                  <div className="mt-2 text-lg font-semibold text-black">
                    {s.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-black/60">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency highlight */}
        <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
          <div
            ref={useReveal<HTMLDivElement>()}
            className="grid overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(2,6,23,.10)] md:grid-cols-2"
          >
            <div className="p-8 md:p-10">
              <div className="text-xs font-semibold tracking-widest text-brand-green/90">
                EMERGENCY • 24/7
              </div>
              <h3 className="mt-3 text-balance text-2xl font-semibold tracking-tight text-black md:text-3xl">
                When it’s urgent, help should be one tap away
              </h3>
              <p className="mt-3 text-sm leading-6 text-black/60 md:text-base">
                Request ambulance support any time. We’re building reliable
                coordination so pet parents can stay calm and act fast.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button as="a" href="#contact">
                  Partner with us
                </Button>
                <Button as="a" href="#coming-soon" variant="secondary">
                  Join waitlist
                </Button>
              </div>
              <div className="mt-5 text-xs text-black/50">
                Availability depends on location and partner coverage.
              </div>
            </div>
            <div className="relative">
              <img
                src={MEDIA.ambulance}
                alt="24/7 pet ambulance support"
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/30 md:to-white/0" />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div
            ref={useReveal<HTMLDivElement>()}
            className="grid gap-10 md:grid-cols-2 md:items-center"
          >
            <div>
              <div className="text-xs font-semibold tracking-widest text-brand-green/90">
                ABOUT
              </div>
              <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-black md:text-4xl">
                A brand built around trust, speed, and compassion
              </h2>
              <p className="mt-4 text-pretty text-sm leading-6 text-black/60 md:text-base">
                Vetript exists to help pet parents access the right care at the
                right time. We’re building a network of vets and partners to
                make online consultation, medicine ordering, appointment booking
                and emergency support feel seamless.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-black">Our mission</div>
                  <div className="mt-1 text-sm text-black/60">
                    Make reliable pet care accessible for every household.
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-black">Our promise</div>
                  <div className="mt-1 text-sm text-black/60">
                    Clear communication, quick response, and helpful follow-ups.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-brand-green/10 via-white to-brand-orange/10 blur-2xl" />
              <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(2,6,23,.10)]">
                <div className="text-sm font-semibold text-black">What we’re building</div>
                <div className="mt-4 grid gap-3">
                  {[
                    "Verified vet network",
                    "Medicine delivery partners",
                    "Ambulance support coordination",
                    "Clinic appointment scheduling",
                    "Notifications & reminders",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm"
                    >
                      <span aria-hidden className="text-brand-green">
                        ✓
                      </span>
                      <div className="text-sm text-black/70">{t}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-black/10 bg-brand-orange/10 p-4 text-xs text-black/60">
                  Note: Service availability, delivery times, and emergency
                  logistics depend on your location and partner coverage.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coming soon */}
        <section
          id="coming-soon"
          className="mx-auto max-w-6xl px-4 py-14 md:px-6"
        >
          <div
            ref={useReveal<HTMLDivElement>()}
            className="rounded-3xl border border-black/10 bg-white p-8 shadow-[0_18px_60px_rgba(2,6,23,.10)] md:p-10"
          >
            <div className="grid items-center gap-8">
              <div>
                <div className="text-xs font-semibold tracking-widest text-brand-green/90">
                  APP • COMING SOON
                </div>
                <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-black md:text-4xl">
                  Be the first to know when Vetript launches
                </h2>
                <p className="mt-3 text-pretty text-sm leading-6 text-black/60 md:text-base">
                  Join the waitlist to get early access updates, partner
                  announcements, and launch offers.
                </p>

                <form
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                  onSubmit={joinWaitlist}
                >
                  <label className="flex-1">
                    <span className="sr-only">Email</span>
                    <input
                      value={waitlistEmail}
                      onChange={(e) => {
                        setWaitlistEmail(e.target.value);
                        setWaitlistStatus("idle");
                      }}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/35 outline-none ring-0 focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/15"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                    />
                  </label>
                  <Button type="submit">Join waitlist</Button>
                </form>

                <div className="mt-3 text-xs text-black/60">
                  {waitlistStatus === "saved" ? (
                    <span className="text-brand-green">
                      You’re on the list. Thanks!
                    </span>
                  ) : waitlistStatus === "invalid" ? (
                    <span className="text-red-600">
                      Please enter a valid email.
                    </span>
                  ) : (
                    <span>
                      No spam. You can also contact us below for partnerships.
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 py-14 md:px-6">
          <div ref={useReveal<HTMLDivElement>()}>
            <SectionTitle
            eyebrow="CONTACT"
            title="Let’s talk"
            description="Questions, partnerships, clinics, or ambulance support coordination — message us and we’ll respond."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <form
              onSubmit={submitContact}
              className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(2,6,23,.10)]"
            >
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-black/85">
                    Name
                  </label>
                  <input
                    value={contact.name}
                    onChange={(e) =>
                      setContact((s) => ({ ...s, name: e.target.value }))
                    }
                    className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/35 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/15"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-black/85">
                      Email
                    </label>
                    <input
                      value={contact.email}
                      onChange={(e) =>
                        setContact((s) => ({ ...s, email: e.target.value }))
                      }
                      className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/35 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/15"
                      placeholder="you@example.com"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold text-black/85">
                      Phone (optional)
                    </label>
                    <input
                      value={contact.phone}
                      onChange={(e) =>
                        setContact((s) => ({ ...s, phone: e.target.value }))
                      }
                      className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/35 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/15"
                      placeholder="+91…"
                      inputMode="tel"
                      autoComplete="tel"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-black/85">
                    Message
                  </label>
                  <textarea
                    value={contact.message}
                    onChange={(e) =>
                      setContact((s) => ({ ...s, message: e.target.value }))
                    }
                    className="min-h-32 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-black placeholder:text-black/35 outline-none focus:border-brand-green/40 focus:ring-2 focus:ring-brand-green/15"
                    placeholder="Tell us what you need…"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit">
                    {contactStatus.type === "sending"
                      ? "Sending…"
                      : "Send message"}
                  </Button>
                  <div className="text-xs text-black/60">
                    {contactStatus.type === "sent" && (
                      <span className="text-brand-green">
                        {contactStatus.message}
                      </span>
                    )}

                    {contactStatus.type === "error" && (
                      <span className="text-red-600">
                        {contactStatus.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(2,6,23,.10)]">
              <div className="text-lg font-semibold text-black">Reach us</div>
              <p className="mt-2 text-sm leading-6 text-black/60">
                Replace these placeholders with your real phone/email and
                address when ready.
              </p>

              <div className="mt-5 overflow-hidden rounded-2xl border border-black/10">
                <img
                  src={MEDIA.consult}
                  alt="Vet consultation on phone"
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold tracking-widest text-black/50">
                    EMAIL
                  </div>
                  <div className="mt-1">
                    <a
                      className="text-sm font-semibold text-black hover:text-brand-green"
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold tracking-widest text-black/50">
                    PHONE
                  </div>
                  <div className="mt-1">
                    <a
                      className="text-sm font-semibold text-black hover:text-brand-green"
                      href={`tel:${CONTACT_PHONE_TEL}`}
                    >
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold tracking-widest text-black/50">
                    BUSINESS HOURS
                  </div>
                  <div className="mt-1 text-sm font-semibold text-black/85">
                    Support: 24/7 for emergencies
                  </div>
                  <div className="mt-1 text-sm text-black/60">
                    General queries: 9:00 AM – 6:00 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
          <div
            ref={useReveal<HTMLDivElement>()}
            className="overflow-hidden rounded-3xl border border-black/10 bg-white p-8 shadow-[0_18px_60px_rgba(2,6,23,.10)] md:p-10"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-sm">
                <div className="text-xs font-semibold tracking-widest text-brand-green/90">
                  HAPPY PET PARENTS
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-black md:text-3xl">
                  Loved by pets, trusted by parents
                </h2>
                <p className="mt-3 text-sm leading-6 text-black/60">
                  These are example stories. Replace them with your own reviews
                  once you start onboarding users and clinics.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-green/10 px-3 py-1 text-xs text-black/70">
                  <span className="text-base">★</span>
                  <span>
                    4.9 average rating •{" "}
                    <span className="font-semibold">1000+</span> pet parents
                    (goal)
                  </span>
                </div>
              </div>
              <div className="grid flex-1 gap-4 md:grid-cols-3">
                {[
                  {
                    name: "Simran & Bruno",
                    city: "Bengaluru",
                    quote:
                      "The emergency team helped us reach a vet clinic at midnight. Having one place to call made it so much less stressful.",
                  },
                  {
                    name: "Rahul & Miu",
                    city: "Mumbai",
                    quote:
                      "Online consult + medicine delivery meant I didn’t have to travel when my cat was anxious. Super smooth experience.",
                  },
                  {
                    name: "Aisha & Leo",
                    city: "Delhi NCR",
                    quote:
                      "Appointment reminders and clear explanations from vets made ongoing treatment easy to follow.",
                  },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="group flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,23,42,.16)]"
                  >
                    <p className="text-sm leading-6 text-black/70">
                      “{t.quote}”
                    </p>
                    <div className="mt-4 text-xs text-black/60">
                      <div className="font-semibold text-black">
                        {t.name}
                      </div>
                      <div>{t.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10">
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-3">
                <img src={MEDIA.logo} alt="Vetripet 24/7" className="h-8 w-auto" loading="lazy" />
              </div>
              <div className="mt-2 text-sm text-black/60">
                Online vet consult • Medicine order • 24/7 ambulance •
                Appointment booking
              </div>
              <div className="mt-4 text-xs text-black/45">
                © {new Date().getFullYear()} Vetript. All rights reserved.
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-3">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#about">About</FooterLink>
              <FooterLink href="#coming-soon">App</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

