import "../styles/hero.css";
import { Fragment, useEffect, useRef, useState } from "react";
import { HiArrowUpRight } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

// Mismo número que usa el formulario de Contacto
const WHATSAPP_URL = "https://wa.me/5493874477853";

// Capturas livianas (WebP) para el teaser de la tarjeta alta. Las originales
// de la sección Proyectos no se tocan: acá se usan versiones reducidas.
const TEASER = [
  { id: "erp", src: "/hero/teaser-erp.webp" },
  { id: "salon", src: "/hero/teaser-salon.webp" },
];

// Se crea una sola vez; formatea la hora de Argentina (24 h, con ceros)
const clockFormat = new Intl.DateTimeFormat("es-AR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
  timeZone: "America/Argentina/Buenos_Aires",
});

// Reloj en vivo. Tiene su propio estado para que solo se vuelva a dibujar
// este pedacito cada segundo, y no todo el Hero.
function LiveClock({ place }) {
  const [time, setTime] = useState(() => clockFormat.format(new Date()));

  // Cada tic se programa justo para el próximo cambio de segundo, así el reloj
  // no se atrasa respecto de la hora real
  useEffect(() => {
    let timer;

    const tick = () => {
      setTime(clockFormat.format(new Date()));
      timer = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };

    tick();

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {place} · <span className="hero__clock">{time}</span>
    </>
  );
}

// Teaser de proyectos: alterna capturas que se desplazan despacio, con un
// chip con el nombre. Se pausa al pasar el mouse y lleva a Proyectos.
function ProjectTeaser({ t }) {
  const [index, setIndex] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => (i + 1) % TEASER.length);
    }, 4200);

    return () => clearInterval(id);
  }, []);

  const current = TEASER[index];
  const name = t.projects?.[current.id]?.title || current.id;

  return (
    <a
      href="#projects"
      className="hero__teaser"
      aria-label={t.hero.ctaSecondary}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
    >
      {TEASER.map((slide, i) => (
        <div
          key={slide.id}
          className={`hero__teaser-slide ${i === index ? "is-active" : ""}`}
        >
          <div className="hero__teaser-pan">
            <img src={slide.src} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
      ))}

      <span className="hero__teaser-chip">
        <span key={current.id}>{name}</span>
      </span>

      <span className="hero__teaser-glare" aria-hidden="true" />
    </a>
  );
}

function Hero({ t }) {
  const roles = [t.hero.role1, t.hero.role2, t.hero.role3, t.hero.role4];
  const [roleIndex, setRoleIndex] = useState(0);

  const innerRef = useRef(null);
  const sectionRef = useRef(null);
  const sealRingRef = useRef(null);
  const sealHover = useRef(false);
  const cardRef = useRef(null);

  // Rotación automática de roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [roles.length]);

  // Manejo de scroll sticky (sin cambios)
  useEffect(() => {
    let aboutOffset = window.innerHeight;

    const updateOffset = () => {
      const aboutEl = document.getElementById("about");
      aboutOffset = aboutEl ? aboutEl.offsetTop : window.innerHeight;
    };

    updateOffset();
    window.addEventListener("resize", updateOffset);

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const progress = Math.min(Math.max(window.scrollY / aboutOffset, 0), 1);

        // CÓDIGO NUEVO
if (innerRef.current) {
  // La escala se mantiene solo en el contenedor interno para el efecto de encogimiento
  innerRef.current.style.transform = `scale(${1 - progress * 0.06})`;
}

if (sectionRef.current) {
  // Aplicamos el oscurecimiento y la opacidad a TODA la sección Hero
  sectionRef.current.style.filter = `brightness(${1 - progress * 0.2})`;
  sectionRef.current.style.opacity = `${1 - progress * 0.35}`;
  sectionRef.current.style.visibility = progress >= 1 ? "hidden" : "visible"; //[cite: 1]
}

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateOffset);
    };
  }, []);

  // Inclinación 3D de la tarjeta alta siguiendo el mouse. Solo con mouse y
  // sin "reducir movimiento".
  const handleTilt = (e) => {
    const el = cardRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;

    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const resetTilt = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  // Giro del sello: lento en reposo y más rápido al pasar el mouse (o al enfocar
  // con teclado). La velocidad cambia de forma gradual, sin saltos. Con
  // "reducir movimiento" activado en el sistema, el sello queda quieto.
  useEffect(() => {
    const ring = sealRingRef.current;
    if (!ring) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const BASE = 360 / 16; // grados por segundo en reposo (una vuelta cada 16 s)
    const FAST = 360 / 2.4; // grados por segundo con el mouse encima

    let angle = 0;
    let speed = BASE;
    let last = performance.now();
    let frame;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const target = sealHover.current ? FAST : BASE;
      speed += (target - speed) * Math.min(dt * 4, 1);
      angle = (angle + speed * dt) % 360;

      ring.style.transform = `rotate(${angle}deg)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section id="hero" className="hero" ref={sectionRef}>
      <div className="hero__inner" ref={innerRef}>
        <div className="hero__frame">

          {/* Muesca superior: solo forma, sin texto (el navbar ya tiene la marca) */}
          <div className="hero__notch-header" aria-hidden="true" />

          <div className="hero__grid">

            {/* 1. TÍTULO (en celular, arriba va el chip "Disponible") */}
            <div className="hero__title-area">
              <span className="hero__chip">
                <span className="hero__chip-dot" />
                {t.hero.available}
              </span>

              <h1 className="hero__title">
                {t.hero.roleLead}{" "}
                <span className="hero__role-wrapper">
                  <span key={roleIndex} className="hero__role">
                    {roles[roleIndex]}
                  </span>
                </span>{" "}
                <br />
                {t.hero.roleTrail}
              </h1>
            </div>

            {/* 2. TARJETA VERTICAL: teaser de proyectos + cinta vertical (solo escritorio) */}
            <div
              className="hero__top-right-card"
              ref={cardRef}
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <div className="hero__top-right-inner">
                <ProjectTeaser t={t} />

                <div className="hero__vertical-accent" aria-hidden="true">
                  <div className="hero__vt">
                    <div className="hero__vt-track">
                      {[0, 1].map((half) => (
                        <div className="hero__vt-half" key={half}>
                          {[0, 1].map((rep) => (
                            <Fragment key={rep}>
                              {roles.map((role) => (
                                <Fragment key={role}>
                                  <span className="hero__vt-item">{role}</span>
                                  <i className="hero__vt-dot" />
                                </Fragment>
                              ))}
                            </Fragment>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. SELLO CIRCULAR */}
            <div
              className="hero__seal"
              onPointerEnter={() => { sealHover.current = true; }}
              onPointerLeave={() => { sealHover.current = false; }}
              onFocus={() => { sealHover.current = true; }}
              onBlur={() => { sealHover.current = false; }}
            >
              <svg ref={sealRingRef} viewBox="0 0 200 200" className="hero__seal-ring" aria-hidden="true">
                <defs>
                  <path
                    id="sealCircle"
                    d="M 100,100 m -82,0 a 82,82 0 1,1 164,0 a 82,82 0 1,1 -164,0"
                  />
                </defs>
                <text fontSize="13" letterSpacing="1.6">
                  <textPath href="#sealCircle" startOffset="0%" textLength="508" lengthAdjust="spacing">
                    AXEL NAVI • ESTUDIO DIGITAL • DISPONIBLE AHORA •
                  </textPath>
                </text>
              </svg>

              <a href="#about" className="hero__seal-center" aria-label="Ver servicios">
                <span className="hero__seal-logo" aria-hidden="true" />
                <span className="hero__seal-label">VER<br />SERVICIOS</span>
              </a>
            </div>

            {/* 4. TARJETA NEGRA: descripción + botones (el CTA principal) */}
            <div className="hero__bottom-left-card">
              <div className="hero__bottom-left-content">
                <p className="hero__card-description">{t.hero.description}</p>
                <div className="hero__buttons">
                  <a href="#contact" className="hero__btn hero__btn--primary">
                    {t.hero.ctaPrimary}
                  </a>
                  <a href="#projects" className="hero__btn hero__btn--secondary">
                    {t.hero.ctaSecondary}
                  </a>
                </div>
              </div>
            </div>

            {/* 5. TARJETA DE NOTIFICACIÓN (solo escritorio): estado + WhatsApp */}
            <div className="hero__bottom-right-card">
              <div className="hero__notif-surface">
                <div className="hero__notif-header">
                  <div className="hero__notif-notch">
                    <span className="hero__notif-dots">• • •</span>
                  </div>
                </div>
                <div className="hero__notif-body">
                  <h3 className="hero__notif-title">
                    <span className="hero__notif-dot" aria-hidden="true" />
                    {t.hero.available}
                  </h3>
                  <p className="hero__notif-text">
                    <LiveClock place={t.contact?.location || "Argentina"} />
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero__notif-btn"
                  >
                    <span><FaWhatsapp /> WhatsApp</span>
                    <span className="hero__notif-arrow"><HiArrowUpRight /></span>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;