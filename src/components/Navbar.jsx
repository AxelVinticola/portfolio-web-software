import "../styles/navbar.css";
import { FaGithub } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

const SECTIONS = ["about", "skills", "projects", "testimonials", "contact"];

function Navbar({ language, setLanguage, t }) {

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [chipLabel, setChipLabel] = useState("");

  const menuRef = useRef(null);
  const linkRefs = useRef({});

  const navItems = [
    { id: "about", label: t.navbar.about },
    { id: "skills", label: t.navbar.skills },
    { id: "projects", label: t.navbar.projects },
    { id: "testimonials", label: t.navbar.testimonials },
    { id: "contact", label: t.navbar.contact },
  ];

  // Scroll: islas compactas + barra de progreso
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

  // Sección actual: la última cuyo borde superior ya pasó la "línea" del 45%
  // de la pantalla. Si ninguna la pasó, estamos en el Hero. Se calcula por
  // posición (no con IntersectionObserver) para que al volver arriba el
  // estado vuelva a "hero" en vez de quedarse en la última sección.
  useEffect(() => {
    const updateActive = () => {
      const line = window.innerHeight * 0.45;
      let current = "hero";

      SECTIONS.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      });

      setActiveSection(current);
    };

    updateActive();

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  // Recuadro resaltado detrás del link activo. Se vuelve a medir cuando
  // termina de cargar la fuente (Anton cambia el ancho de los links) y
  // cuando cambia el tamaño de la ventana.
  useEffect(() => {
    const measure = () => {
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
    };

    measure();

    window.addEventListener("resize", measure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    return () => window.removeEventListener("resize", measure);
  }, [activeSection, language, scrolled]);

  // Recuadro con el nombre de la sección actual. Al volver al Hero se
  // cierra, pero conserva el último texto para que no quede vacío mientras
  // se achica.
  useEffect(() => {
    const current = navItems.find((item) => item.id === activeSection);
    if (current) setChipLabel(current.label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, language]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <div className="navbar__progress" style={{ width: `${scrollProgress}%` }} />

      <nav
        className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--open" : ""}`}
      >

        {/* ISLA 1: marca + sección actual */}

        <a
          href="#hero"
          className="navbar__island navbar__island--brand"
          onClick={closeMenu}
          aria-label="Axel NaVi"
        >
          <img src="/logoAV.png" alt="" className="navbar__logo-img" />
          <span className="navbar__wordmark">Axel NaVi</span>

          <span
            className={`navbar__section ${activeSection !== "hero" ? "is-visible" : ""}`}
            aria-hidden="true"
          >
            <span key={chipLabel} className="navbar__section-text">
              {chipLabel}
            </span>
          </span>
        </a>

        {/* ISLA 2: links (en celular se convierte en el menú desplegable) */}

        <div className="navbar__island navbar__island--links">

          <ul ref={menuRef} className="navbar__menu">

            <span
              className="navbar__indicator"
              style={{
                transform: `translateX(${indicator.left}px)`,
                width: `${indicator.width}px`,
                opacity: indicator.opacity,
              }}
            />

            {navItems.map((item, index) => (
              <li key={item.id} style={{ "--stagger-index": index }}>
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

          {/* Solo se ve en celular, adentro del menú */}
          <div className="navbar__menu-extras">
            <a href="#contact" className="navbar__cta" onClick={closeMenu}>
              {t.hero.ctaPrimary}
            </a>
            <a
              href="https://github.com/AxelVinticola"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar__menu-github"
            >
              <FaGithub /> GitHub
            </a>
          </div>

        </div>

        {/* ISLA 3: acciones */}

        <div className="navbar__island navbar__island--actions">

          <a
            href="https://github.com/AxelVinticola"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="navbar__icon-link"
          >
            <FaGithub />
          </a>

          <button
            id="lang-toggle"
            className="navbar__language"
            onClick={() => setLanguage(language === "es" ? "en" : "es")}
          >
            {language === "es" ? "🇺🇸 EN" : "🇪🇸 ES"}
          </button>

          <a href="#contact" className="navbar__cta navbar__cta--bar" onClick={closeMenu}>
            {t.hero.ctaPrimary}
          </a>

          <button
            className="navbar__toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "×" : "• • •"}
          </button>

        </div>

      </nav>
    </>
  );
}

export default Navbar;