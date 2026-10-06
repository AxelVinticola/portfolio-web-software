import "../styles/footer.css";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

import { HiOutlineDocumentArrowDown, HiOutlineArrowUp } from "react-icons/hi2";

const WHATSAPP_NUMBER = "5493874477853";

function Footer({ t }) {

  const year = new Date().getFullYear();

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
    <footer className="footer">

      <div className="footer__top">

        {/* MARCA */}

        <div className="footer__brand">

          <a href="#hero" className="footer__logo">
            <img src="/logoAV.png" alt="Axel NaVi" />
            <span>Axel NaVi</span>
          </a>

          <p>{t.hero.brandTagline}</p>

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

        {/* NAVEGACIÓN RÁPIDA */}

        <div className="footer__nav">

          <h4>{t.footer.navTitle}</h4>

          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>

        </div>

        {/* CONTACTO */}

        <div className="footer__contact">

          <h4>{t.footer.contactTitle}</h4>

          <a href="mailto:axelvinticola@gmail.com" className="footer__contact-link">
            axelvinticola@gmail.com
          </a>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer__contact-link"
          >
            <FaWhatsapp />
            WhatsApp
          </a>

          <a
            href="/CV_Vinticola_Axel_2026.pdf"
            download="CV_Vinticola_Axel_2026.pdf"
            className="footer__cv"
          >
            <HiOutlineDocumentArrowDown />
            {t.hero.downloadCV}
          </a>

        </div>

      </div>

      <div className="footer__divider" />

      <div className="footer__bottom">

        <p>© {year} Axel NaVi — Axel Vintícola</p>

        <p className="footer__made">{t.footer.madeIn}</p>

        <button
          className="footer__to-top"
          onClick={scrollToTop}
          aria-label={t.footer.backToTop}
        >
          <HiOutlineArrowUp />
        </button>

      </div>

    </footer>
  );
}

export default Footer;