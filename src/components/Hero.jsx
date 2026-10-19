import "../styles/hero.css";
import { useEffect, useRef, useState } from "react";
import { HiArrowUpRight } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";

// Mismo número que usa el formulario de Contacto
const WHATSAPP_URL = "https://wa.me/5493874477853";

function Hero({ t }) {
  const roles = [t.hero.role1, t.hero.role2, t.hero.role3, t.hero.role4];
  const [roleIndex, setRoleIndex] = useState(0);

  const innerRef = useRef(null);
  const sectionRef = useRef(null);

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

            {/* 2. TARJETA VERTICAL CON EL LOGO (solo escritorio) */}
            <div className="hero__top-right-card">
              <div className="hero__top-right-inner">
                <div className="hero__top-right-placeholder">
                  <img src="/logoAV.png" alt="Axel NaVi" className="hero__accent-img" />
                </div>
                <div className="hero__vertical-accent" aria-hidden="true">
                  <span>★</span>
                  <span>★</span>
                  <span>↑</span>
                </div>
              </div>
            </div>

            {/* 3. SELLO CIRCULAR */}
            <div className="hero__seal">
              <svg viewBox="0 0 200 200" className="hero__seal-ring" aria-hidden="true">
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
                  <h3 className="hero__notif-title">{t.hero.available}</h3>
                  <p className="hero__notif-text">{t.hero.brandTagline}</p>
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