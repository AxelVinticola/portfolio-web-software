import "../styles/hero.css";
import { useEffect, useRef, useState } from "react";

function Hero({ t }) {

  const roles = [t.hero.role1, t.hero.role2, t.hero.role3, t.hero.role4];
  const [roleIndex, setRoleIndex] = useState(0);

  const logoRef = useRef(null);
  const constellationRef = useRef(null);

  // Rotación automática de roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [roles.length]);

  // Tilt + flotación del logo hacia el cursor (sutil, el logo no tiene marco)
  const handleLogoMove = (e) => {
    const el = logoRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };

  const handleLogoLeave = () => {
    if (logoRef.current) {
      logoRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  };

  // Paralaje de las etiquetas orbitando: cada una se mueve a distinta profundidad
  const handleConstellationMove = (e) => {
    const el = constellationRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const chips = el.querySelectorAll("[data-depth]");

    chips.forEach((chip) => {
      const depth = parseFloat(chip.dataset.depth);
      chip.style.setProperty("--parallax-x", `${x * depth}px`);
      chip.style.setProperty("--parallax-y", `${y * depth}px`);
    });
  };

  const handleConstellationLeave = () => {
    const el = constellationRef.current;
    if (!el) return;

    el.querySelectorAll("[data-depth]").forEach((chip) => {
      chip.style.setProperty("--parallax-x", "0px");
      chip.style.setProperty("--parallax-y", "0px");
    });
  };

  const stats = [
    { value: t.hero.stat1Value, label: t.hero.stat1Label },
    { value: t.hero.stat2Value, label: t.hero.stat2Label },
    { value: t.hero.stat3Value, label: t.hero.stat3Label },
  ];

  return (
    <section id="hero" className="hero">

      <div className="hero__corner-glow" />

      <div className="hero__content">

        <div className="hero__eyebrow">
          <span className="hero__eyebrow-brand">Axel NaVi</span>
          <span className="hero__eyebrow-dot" />
          <span className="hero__eyebrow-tagline">{t.hero.brandTagline}</span>
        </div>

        <div className="hero__available">
          <span className="hero__available-dot" />
          {t.hero.available}
        </div>

        <h1 className="hero__title">
          {t.hero.roleLead}{" "}
          <span className="hero__role-wrapper">
            <span key={roleIndex} className="hero__role">
              {roles[roleIndex]}
            </span>
          </span>{" "}
          {t.hero.roleTrail}
        </h1>

        <p className="hero__meta">
          Por Axel Vintícola — {t.hero.subtitle}
        </p>

        <p className="hero__description">
          {t.hero.description}
        </p>

        <div className="hero__buttons">

          <a href="#contact" className="hero__btn hero__btn--primary">
            {t.hero.ctaPrimary}
          </a>

          <a href="#projects" className="hero__btn hero__btn--secondary">
            {t.hero.ctaSecondary}
          </a>

          <a
            href="/CV_Vinticola_Axel_2026.pdf"
            download="CV_Vinticola_Axel_2026.pdf"
            className="hero__cv-link"
          >
            {t.hero.downloadCV}
          </a>

        </div>

        <div className="hero__stats">

          {stats.map((stat, index) => (
            <div className="hero__stat" key={index}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}

        </div>

      </div>

      <div className="hero__divider" aria-hidden="true" />

      <div
        className="hero__constellation"
        ref={constellationRef}
        onMouseMove={handleConstellationMove}
        onMouseLeave={handleConstellationLeave}
      >

        <div className="hero__logo-glow" />
        <div className="hero__logo-shadow" />

        <div className="hero__logo-wrap">
          <div
            className="hero__logo"
            ref={logoRef}
            onMouseMove={handleLogoMove}
            onMouseLeave={handleLogoLeave}
          >
            <img src="/logoAV.png" alt="Axel NaVi" />
          </div>
        </div>

        <span className="hero__chip hero__chip--1" data-depth="0.05">
          {t.hero.role1}
        </span>

        <span className="hero__chip hero__chip--2" data-depth="-0.07">
          {t.hero.role2}
        </span>

        <span className="hero__chip hero__chip--3" data-depth="0.06">
          {t.hero.role3}
        </span>

        <span className="hero__chip hero__chip--4" data-depth="-0.04">
          {t.hero.role4}
        </span>

      </div>

      <a href="#about" className="hero__scroll-cue" aria-label={t.hero.scrollCue}>
        <span className="hero__scroll-cue-mouse">
          <span className="hero__scroll-cue-dot" />
        </span>
        <span className="hero__scroll-cue-label">{t.hero.scrollCue}</span>
      </a>

    </section>
  );
}

export default Hero;