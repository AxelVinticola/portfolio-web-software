import "../styles/about.css";
import { useEffect, useRef, useState } from "react";

// =========================================================
// MOCKUPS — una "escena" distinta por servicio, no un ícono
// =========================================================

// Sitios Web: ventana de navegador con tilt 3D + brillo que cruza al hover
function BrowserMockup({ isHovered }) {

  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    el.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      className="mockup mockup--browser"
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="mockup__bar">
        <span className="mockup__dot" />
        <span className="mockup__dot" />
        <span className="mockup__dot" />
        <span className="mockup__url" />
      </div>

      <div className="mockup__body">
        <span className="mockup__nav" />
        <span className="mockup__hero-block" />
        <div className="mockup__cards">
          <span />
          <span />
          <span />
        </div>

        {isHovered && <span className="mockup__glare" />}
      </div>
    </div>
  );
}

// Software a Medida: terminal con líneas que se tipean solas, en loop
const CODE_LINES = [
  "npx create-project axel-navi",
  "git commit -m \"feature ready\"",
  "> deploy successful ✓",
];

function TerminalMockup({ isVisible, isHovered }) {

  const [lineIndex, setLineIndex] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!isVisible) return;

    let charIndex = 0;
    let deleting = false;
    let timeoutId;

    const currentLine = CODE_LINES[lineIndex];

    const tick = () => {
      if (!deleting) {
        charIndex++;
        setText(currentLine.slice(0, charIndex));

        if (charIndex === currentLine.length) {
          timeoutId = setTimeout(() => {
            deleting = true;
            tick();
          }, 1300);
          return;
        }
      } else {
        charIndex--;
        setText(currentLine.slice(0, charIndex));

        if (charIndex === 0) {
          setLineIndex((prev) => (prev + 1) % CODE_LINES.length);
          return;
        }
      }

      timeoutId = setTimeout(tick, deleting ? 25 : 55);
    };

    timeoutId = setTimeout(tick, 400);

    return () => clearTimeout(timeoutId);
  }, [isVisible, lineIndex]);

  return (
    <div className="mockup mockup--terminal">
      <div className="mockup__bar mockup__bar--dark">
        <span className="mockup__dot" />
        <span className="mockup__dot" />
        <span className="mockup__dot" />
      </div>

      <div className="mockup__terminal-body">
        <span className="mockup__prompt">$</span>
        <span className="mockup__typed">{text}</span>
        <span className="mockup__cursor" />

        {isHovered && (
          <div className="mockup__hover-line">
            <span className="mockup__prompt">$</span>
            <span className="mockup__typed-fast">✓ build exitoso</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Sistemas ERP: gráfico de barras que crecen al entrar en pantalla,
// y se "recalculan" con nuevos valores al pasar el cursor
function ChartMockup({ isRevealed, isHovered }) {

  const [bars, setBars] = useState([35, 68, 48, 92, 60]);
  const [growing, setGrowing] = useState(false);

  // Primera aparición: crecen una vez que la tarjeta entra en pantalla
  useEffect(() => {
    if (isRevealed) {
      const timeout = setTimeout(() => setGrowing(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [isRevealed]);

  // Hover: bajan a cero y vuelven a crecer con valores distintos (efecto "dato en vivo")
  useEffect(() => {
    if (!isHovered || !isRevealed) return;

    setGrowing(false);

    const newBars = bars.map(() => 30 + Math.round(Math.random() * 65));

    const timeout = setTimeout(() => {
      setBars(newBars);
      setGrowing(true);
    }, 250);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered]);

  return (
    <div className="mockup mockup--chart">
      <div className="mockup__bar mockup__bar--dark">
        <span className="mockup__dot" />
        <span className="mockup__dot" />
        <span className="mockup__dot" />
      </div>

      <div className="mockup__chart-body">
        {bars.map((height, index) => (
          <span
            key={index}
            className={`chart-bar ${growing ? "is-growing" : ""}`}
            style={{ "--target": `${height}%`, transitionDelay: `${index * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// Apps Móviles: mockup de celular con contenido que respira en loop,
// y una notificación nueva entrando al pasar el cursor
function PhoneMockup({ isHovered }) {
  return (
    <div className="mockup mockup--phone">
      <div className="mockup__phone-frame">
        <span className="mockup__phone-notch" />
        <div className="mockup__phone-screen">

          {isHovered && (
            <span className="mockup__phone-notification">Nuevo turno reservado</span>
          )}

          <span className="mockup__phone-row mockup__phone-row--active" />
          <span className="mockup__phone-row" />
          <span className="mockup__phone-row" />
          <span className="mockup__phone-badge" />
        </div>
      </div>
    </div>
  );
}

// =========================================================
// TARJETA DE SERVICIO — entra deslizándose desde su lado
// (izquierda o derecha) cuando la grilla aparece en pantalla
// =========================================================

function ServiceCard({ index, side, isRevealed, title, description, renderVisual, t }) {

  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  // Glow que sigue al cursor dentro de la propia tarjeta
  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    el.style.setProperty("--card-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--card-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      className={`service-card service-card--${side} ${isRevealed ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 0.1}s` }}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

      <span className="service-card__glow" />

      <div className="service-card__number">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="service-card__visual">
        {renderVisual(isRevealed, isHovered)}
      </div>

      <h3 className="service-card__title">{title}</h3>

      <p className="service-card__desc">{description}</p>

      <a href="#projects" className="service-card__link">
        {t.about.viewExample} →
      </a>

    </div>
  );
}

function About({ t }) {

  const [gridRevealed, setGridRevealed] = useState(false);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  // Un solo disparador para las 4 tarjetas: convergen juntas, no una por una
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGridRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (gridRef.current) observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, []);

  // Spotlight de fondo: el foco de luz sigue al cursor por toda la sección
  const handleSpotlightMove = (e) => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const services = [
    {
      side: "left",
      title: t.hero.role1,
      desc: t.about.service1Desc,
      renderVisual: (isRevealed, isHovered) => <BrowserMockup isHovered={isHovered} />,
    },
    {
      side: "right",
      title: t.hero.role2,
      desc: t.about.service2Desc,
      renderVisual: (isRevealed, isHovered) => (
        <TerminalMockup isVisible={isRevealed} isHovered={isHovered} />
      ),
    },
    {
      side: "left",
      title: t.hero.role3,
      desc: t.about.service3Desc,
      renderVisual: (isRevealed, isHovered) => (
        <ChartMockup isRevealed={isRevealed} isHovered={isHovered} />
      ),
    },
    {
      side: "right",
      title: t.hero.role4,
      desc: t.about.service4Desc,
      renderVisual: (isRevealed, isHovered) => <PhoneMockup isHovered={isHovered} />,
    },
  ];

  return (
    <section
      id="about"
      className="about-services"
      ref={sectionRef}
      onMouseMove={handleSpotlightMove}
    >

      <div className="services__grid" />
      <div className="services__grid services__grid--spotlight" />

      <div className="services__header">
        <h2>{t.about.title}</h2>
        <p>{t.about.subtitle}</p>
      </div>

      <div className="services__cards" ref={gridRef}>
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            index={index}
            side={service.side}
            isRevealed={gridRevealed}
            title={service.title}
            description={service.desc}
            renderVisual={service.renderVisual}
            t={t}
          />
        ))}
      </div>

      <div className="services__closing">
        <h3>{t.about.closingTitle}</h3>
        <p>{t.about.closingText}</p>
        <a href="#contact" className="services__cta">
          {t.hero.ctaPrimary}
        </a>
      </div>

    </section>
  );
}

export default About;