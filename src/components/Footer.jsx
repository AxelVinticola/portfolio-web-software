import "../styles/footer.css";
import { useEffect, useRef, useState } from "react";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import { HiOutlineDocumentArrowDown, HiOutlineArrowUp } from "react-icons/hi2";

const WHATSAPP_NUMBER = "5493874477853";
const BRAND = "Axel NaVi";

function Footer({ t }) {

  const year = new Date().getFullYear();

  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Dispara las animaciones de entrada cuando el Footer aparece en pantalla
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (footerRef.current) observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navLinks = [
    { id: "about", label: t.navbar.about },
    { id: "skills", label: t.navbar.skills },
    { id: "projects", label: t.navbar.projects },
    { id: "testimonials", label: t.navbar.testimonials },
    { id: "contact", label: t.navbar.contact },
  ];

  return (
    <footer
      className={`footer ${isVisible ? "is-visible" : ""}`}
      ref={footerRef}
    >

      <div className="footer__inner">

        {/* MARCA GIGANTE + ESTADO */}

        <div className="footer__top">

          <a href="#hero" className="footer__wordmark" aria-label={BRAND}>
            <img src="/logoAV.png" alt="" className="footer__mark" />

            <span className="footer__letters" aria-hidden="true">
              {BRAND.split("").map((char, i) =>
                char === " " ? (
                  <span key={i} className="footer__letter footer__letter--space" />
                ) : (
                  <span key={i} className="footer__letter" style={{ "--i": i }}>
                    {char}
                  </span>
                )
              )}
            </span>
          </a>

          <div className="footer__intro">

            <p className="footer__tagline">{t.hero.brandTagline}</p>

            <span className="footer__status">
              <span className="footer__dot" aria-hidden="true" />
              {t.hero.available}
            </span>

          </div>

        </div>

        {/* COLUMNAS */}

        <div className="footer__cols">

          <nav className="footer__col" style={{ "--c": 0 }} aria-label={t.footer.navTitle}>

            <h3>{t.footer.navTitle}</h3>

            <ul>
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a href={`#${link.id}`}>{link.label}</a>
                </li>
              ))}
            </ul>

          </nav>

          <div className="footer__col" style={{ "--c": 1 }}>

            <h3>{t.footer.contactTitle}</h3>

            <a href="mailto:axelvinticola@gmail.com" className="footer__mail">
              axelvinticola@gmail.com
            </a>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__wa"
            >
              <FaWhatsapp aria-hidden="true" />
              WhatsApp
            </a>

            <a
              href="/CV_Vinticola_Axel_2026.pdf"
              download="CV_Vinticola_Axel_2026.pdf"
              className="footer__cv"
            >
              <HiOutlineDocumentArrowDown aria-hidden="true" />
              {t.hero.downloadCV}
            </a>

          </div>

          <div className="footer__col" style={{ "--c": 2 }}>

            <h3>{t.contact?.socialTitle || "Redes"}</h3>

            <div className="footer__socials">

              <a href="https://github.com/AxelVinticola" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>

              <a href="https://linkedin.com/in/axel-vinticola-2b7245208" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>

              <a href="https://www.instagram.com/axel_na.vi/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>

              <a href="https://www.tiktok.com/@axel.navi" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok />
              </a>

            </div>

          </div>

        </div>

        {/* BARRA INFERIOR */}

        <div className="footer__bottom">

          <p className="footer__copy">© {year} {BRAND} — Axel Vintícola</p>

          <p className="footer__made">{t.footer.madeIn}</p>

          <button
            type="button"
            className="footer__to-top"
            onClick={scrollToTop}
            aria-label={t.footer.backToTop}
          >
            <HiOutlineArrowUp aria-hidden="true" />
          </button>

        </div>

      </div>

    </footer>
  );
}

export default Footer;