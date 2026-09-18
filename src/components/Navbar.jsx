import "../styles/navbar.css";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineDocumentArrowDown, HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";

const SECTIONS = ["about", "skills", "projects", "education", "contact"];

function Navbar({ language, setLanguage, t }) {

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

  const menuRef = useRef(null);
  const linkRefs = useRef({});

  // Scroll: fondo de la navbar + barra de progreso
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detecta qué sección está visible para animar el indicador
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Mueve la píldora indicadora debajo del link activo
  useEffect(() => {
    const activeEl = linkRefs.current[activeSection];

    if (activeEl && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const linkRect = activeEl.getBoundingClientRect();

      setIndicator({
        left: linkRect.left - menuRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    } else {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection, menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItems = [
    { id: "about", label: t.navbar.about },
    { id: "skills", label: t.navbar.skills },
    { id: "projects", label: t.navbar.projects },
    { id: "education", label: t.navbar.education },
    { id: "contact", label: t.navbar.contact },
  ];

  return (
    <>
      <div className="navbar__progress" style={{ width: `${scrollProgress}%` }} />

      <nav className={scrolled ? "navbar navbar--scrolled" : "navbar"}>

        {/* LOGO */}

        <div className="navbar__logo">
          <a href="#hero" onClick={closeMenu}>
            <img src="/logoAV.png" alt="Axel Vintícola" />
          </a>
        </div>

        {/* MENÚ */}

        <ul
          ref={menuRef}
          className={`navbar__menu ${menuOpen ? "navbar__menu--open" : ""}`}
        >

          <span
            className="navbar__indicator"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: `${indicator.width}px`,
              opacity: indicator.opacity,
            }}
          />

          {navItems.map((item, index) => (
            <li
              key={item.id}
              style={{ "--stagger-index": index }}
            >
              <a
                ref={(el) => (linkRefs.current[item.id] = el)}
                href={`#${item.id}`}
                className={activeSection === item.id ? "is-active" : ""}
                onClick={closeMenu}
              >
                {item.label}
              </a>
            </li>
          ))}

        </ul>

        {/* ICONOS */}

        <div className="navbar__actions">

          <button
            id="lang-toggle"
            className="navbar__language"
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
          >
            {language === "es" ? "🇺🇸 EN" : "🇪🇸 ES"}
          </button>

          <a
            href="https://github.com/AxelVinticola"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub />
          </a>

          <a
            href="https://linkedin.com/in/axel-vintícola-2b7245208"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>

          <a
            href="/CV_Vinticola_Axel_2026.pdf"
            download="CV_Vinticola_Axel_2026.pdf"
            aria-label="Descargar CV"
          >
            <HiOutlineDocumentArrowDown />
          </a>

        </div>

        {/* BOTÓN MOBILE */}

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
        </button>

      </nav>
    </>
  );
}

export default Navbar;