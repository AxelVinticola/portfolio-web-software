import "../styles/projects.css";
import { useEffect, useRef, useState } from "react";

import {
  FaPython,
  FaReact,
} from "react-icons/fa";

import {
  SiDjango,
  SiMysql,
  SiBootstrap,
  SiJavascript,
  SiJquery,
  SiChartdotjs,
  SiExpo,
  SiFirebase,
} from "react-icons/si";

// =========================================================
// MOCKUP DE PANTALLA — muestra todas las capturas del proyecto,
// una por vez con crossfade. En la tarjeta chica cicla solo;
// cuando la tarjeta está expandida, el usuario la controla con flechas.
// =========================================================

function ScreenshotFrame({ frame, images, currentIndex }) {
  return (
    <div className={`screenshot-frame screenshot-frame--${frame}`}>
      <div className="screenshot-frame__screen">
        {images.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.title}
            loading="lazy"
            className={`screenshot-frame__image ${index === currentIndex ? "is-active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}

// =========================================================
// TARJETA DE PROYECTO DESTACADO — se expande y se centra en el
// mismo elemento (técnica FLIP), sin librerías de animación
// =========================================================

function FeaturedProjectCard({ id, data, t, isExpanded, isClosing, side, coveredStyle, cardRef, onToggle, onOpenGallery }) {

  const [imgIndex, setImgIndex] = useState(0);

  // Ciclo automático de imágenes SOLO mientras la tarjeta está chica,
  // y solo si el usuario no pidió reducir animaciones
  useEffect(() => {
    if (isExpanded) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % data.images.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [isExpanded, data.images.length]);

  return (
    <article
      ref={cardRef}
      className={`project-card project-card--${side} ${isExpanded ? "is-expanded" : ""} ${isClosing ? "is-closing" : ""}`}
      style={coveredStyle}
      onClick={!isExpanded ? () => onToggle(id) : undefined}
    >

      {isExpanded && (
        <button
          className="project-card__close"
          onClick={(e) => {
            e.stopPropagation();
            onToggle(id);
          }}
          aria-label={t.projects.gallery?.close || "Cerrar"}
        >
          ×
        </button>
      )}

      {/* La imagen sigue ahí siempre en la tarjeta chica; al expandir,
          este contenedor se achica a 0 y la imagen desaparece del
          todo, dejando lugar a la información. */}
      <div className="project-card__visual">
        <ScreenshotFrame frame={data.frame} images={data.images} currentIndex={imgIndex} />
      </div>

      <div className="project-card__content">

        {/* Fila 1: categoría */}
        <span className="project-card__type">{data.type}</span>

        {/* Fila 2: título + logo (el logo solo aparece expandido) */}
        <div className="project-card__title-row">
          <h3>{data.title}</h3>

          {isExpanded && (
            <div className="project-card__logo-placeholder">
              LOGO
            </div>
          )}
        </div>

        {/* Fila 3: descripción */}
        <p className="project-card__description">
          {isExpanded ? data.description : data.shortDescription}
        </p>

        {!isExpanded && (
          <span className="project-card__expand-hint">
            {t.projects.viewCase || "Ver caso completo"} →
          </span>
        )}

        {/* Siempre montado (no se crea/destruye) para que la altura
            pueda animarse suavemente al abrir y cerrar */}
        <div className="project-card__expanded-extra">

          {/* Fila 4: botón */}
          <button
            className="project-card__gallery-btn"
            onClick={(e) => {
              e.stopPropagation();
              onOpenGallery(id);
            }}
          >
            {t.projects.viewImages || "Ver imágenes del proyecto"}
          </button>

          {/* Fila 5: tecnologías + funcionalidades */}
          <div className="project-card__details">

            <div className="project-card__tech-col">
              <h4>{data.technologiesLabel}</h4>

              <div className="project-card__technologies">
                {data.technologies}
              </div>
            </div>

            <div className="project-card__features-col">
              <h4>{data.featuresLabel}</h4>

              <ul className="project-card__features">
                {data.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

    </article>
  );
}

// =========================================================
// MODAL DE GALERÍA — el único lugar de esta sección que sí
// usa un fondo oscuro; acá tiene sentido, porque mientras mirás
// las fotos en grande no querés distracción del resto de la página
// =========================================================

function GalleryModal({ data, t, onClose }) {

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((p) => (p === data.images.length - 1 ? 0 : p + 1));
      if (e.key === "ArrowLeft") setIndex((p) => (p === 0 ? data.images.length - 1 : p - 1));
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [data.images.length, onClose]);

  const next = (e) => {
    e.stopPropagation();
    setIndex((p) => (p === data.images.length - 1 ? 0 : p + 1));
  };

  const prev = (e) => {
    e.stopPropagation();
    setIndex((p) => (p === 0 ? data.images.length - 1 : p - 1));
  };

  return (
    <div className="gallery-modal__backdrop" onClick={onClose}>

      <div className="gallery-modal" onClick={(e) => e.stopPropagation()}>

        <button
          className="gallery-modal__close"
          onClick={onClose}
          aria-label={t.projects.gallery?.close || "Cerrar"}
        >
          ×
        </button>

        <img
          src={data.images[index].src}
          alt={data.images[index].title}
          className="gallery-modal__image"
        />

        <div className="gallery-modal__caption">{data.images[index].title}</div>

        <div className="gallery-modal__nav">
          <button onClick={prev} aria-label={t.projects.gallery?.previous || "Anterior"}>‹</button>
          <span>{index + 1} / {data.images.length}</span>
          <button onClick={next} aria-label={t.projects.gallery?.next || "Siguiente"}>›</button>
        </div>

      </div>

    </div>
  );
}

// =========================================================
// ÁLBUM DE LANDING PAGES — estructura lista, con datos de
// ejemplo para que los reemplaces por los tuyos.
// Cada objeto acepta:
//  - name: nombre del sitio
//  - description: una línea corta de qué es
//  - image: ruta a la captura de inicio de esa landing
//  - url: link al sitio en vivo (si no está online, dejá null
//    y la tarjeta deja de ser clickeable automáticamente)
// =========================================================

const landingPages = [
  {
    name: "Landing 1",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/hilosysuelas.png",
    url: null,
  },
  {
    name: "Landing 2",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/landing-2.png",
    url: null,
  },
  {
    name: "Landing 3",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/landing-3.png",
    url: null,
  },
  {
    name: "Landing 4",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/landing-4.png",
    url: null,
  },
  {
    name: "Landing 5",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/landing-5.png",
    url: null,
  },
  {
    name: "Landing 6",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/landing-6.png",
    url: null,
  },
  {
    name: "Landing 7",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/landing-7.png",
    url: null,
  },
  {
    name: "Landing 8",
    description: "Reemplazá esta descripción por la tuya",
    image: "/projects/landings/landing-8.png",
    url: null,
  },
];

function LandingCard({ landing }) {

  const [imageFailed, setImageFailed] = useState(false);

  const content = (
    <>
      <div className="landing-card__image">
        {!imageFailed ? (
          <img
            src={landing.image}
            alt={landing.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className="landing-card__placeholder">Agregar imagen</span>
        )}
      </div>

      <div className="landing-card__info">
        <h4>{landing.name}</h4>
        <p>{landing.description}</p>
      </div>
    </>
  );

  if (landing.url) {
    return (
      <a
        href={landing.url}
        target="_blank"
        rel="noopener noreferrer"
        className="landing-card"
      >
        {content}
      </a>
    );
  }

  return <div className="landing-card">{content}</div>;
}

// Una columna que sube o baja en loop infinito — el array se duplica
// para que el loop sea perfecto (misma técnica que las cintas de
// Tecnologías, pero en vertical). Se pausa entera al pasar el cursor.
function LandingColumn({ items, direction }) {
  const doubled = [...items, ...items];

  return (
    <div className="landing-marquee">
      <div
        className={`landing-marquee__track ${direction === "down" ? "landing-marquee__track--reverse" : ""}`}
      >
        {doubled.map((landing, index) => (
          <LandingCard key={index} landing={landing} />
        ))}
      </div>
    </div>
  );
}

// =========================================================
// SECCIÓN COMPLETA
// =========================================================

function Projects({ t }) {

  const COLLAPSE_MS = 900;

  const [expandedId, setExpandedId] = useState(null);
  const [closingId, setClosingId] = useState(null);
  const [coveredCard, setCoveredCard] = useState(null); // { id, top, left, width, height }
  const [galleryId, setGalleryId] = useState(null);
  const [gridDirection, setGridDirection] = useState("row");

  const cardRefs = useRef({});
  const gridRef = useRef(null);

  // Cierra la tarjeta expandida con la tecla Escape
  // (el modal de galería maneja su propio Escape aparte)
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && expandedId && !galleryId) toggleExpand(expandedId);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedId, galleryId]);

  // Al expandir: la tarjeta crece con "width" (queda dentro de la sección,
  // nunca se sale de la grilla). La otra tarjeta se "clava" con
  // position:absolute exactamente donde estaba, para que la que crece
  // la tape por completo al ocupar todo el ancho.
  //
  // Al colapsar: se invierte. Recién cuando termina la animación de
  // achicado (mismo tiempo, en reversa) soltamos a la tarjeta tapada
  // para que vuelva a fluir con normalidad — así no "aparece" de golpe
  // mientras la otra todavía la está por descubrir.
  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setClosingId(id);

      window.setTimeout(() => {
        setCoveredCard(null);
        setGridDirection("row");
        setClosingId(null);
      }, COLLAPSE_MS);

      return;
    }

    const ids = Object.keys(cardRefs.current);
    const otherId = ids.find((key) => key !== id);
    const otherEl = cardRefs.current[otherId];
    const gridEl = gridRef.current;

    // Cada tarjeta crece alejándose de su propio borde exterior: la de
    // la izquierda ancla su borde izquierdo (ya es el comportamiento
    // normal), la de la derecha ancla su borde derecho. Para lograrlo
    // sin romper la transición suave de "width", invertimos el orden
    // del flex mientras esta tarjeta es la única que queda en el flujo.
    const side = ids.indexOf(id) === 0 ? "left" : "right";
    setGridDirection(side === "right" ? "row-reverse" : "row");

    // Tapar a la otra tarjeta solo tiene sentido en la grilla de 2
    // columnas (escritorio). En mobile ya están apiladas en una sola
    // columna, así que alcanza con que la de abajo se corra sola.
    const isDesktopGrid = window.innerWidth >= 900;

    if (isDesktopGrid && otherEl && gridEl) {
      const gridRect = gridEl.getBoundingClientRect();
      const otherRect = otherEl.getBoundingClientRect();

      setCoveredCard({
        id: otherId,
        top: otherRect.top - gridRect.top,
        left: otherRect.left - gridRect.left,
        width: otherRect.width,
        height: otherRect.height,
      });
    }

    setExpandedId(id);
  };

  const projects = {
    erp: {
      type: t.projects.erp.type,
      title: t.projects.erp.title,
      shortDescription: t.projects.erp.shortDescription || t.projects.erp.description,
      description: t.projects.erp.description,
      technologiesLabel: t.projects.erp.technologies,
      featuresLabel: t.projects.erp.features,
      frame: "browser",

      technologies: (
        <>
          <span><FaPython />Python</span>
          <span><SiDjango />Django</span>
          <span><SiMysql />MySQL</span>
          <span><SiBootstrap />Bootstrap</span>
          <span><SiJavascript />JavaScript</span>
          <span><SiJquery />jQuery</span>
          <span><SiChartdotjs />Chart.js</span>
        </>
      ),

      features: [
        t.projects.erp.feature1,
        t.projects.erp.feature2,
        t.projects.erp.feature3,
        t.projects.erp.feature4,
        t.projects.erp.feature5,
        t.projects.erp.feature6,
        t.projects.erp.feature7,
        t.projects.erp.feature8,
        t.projects.erp.feature9,
        t.projects.erp.feature10,
      ],

      images: [
        { src: "/projects/erp/inicio.png", title: "Inicio" },
        { src: "/projects/erp/TurnoCli.png", title: "Turno vista cliente" },
        { src: "/projects/erp/turnoemp.png", title: "Administración de turnos" },
        { src: "/projects/erp/calendario.png", title: "Calendario de turnos" },
        { src: "/projects/erp/detalleturno.png", title: "Información adicional del turno" },
        { src: "/projects/erp/caja.png", title: "Gestión y apertura de caja" },
        { src: "/projects/erp/Empleados.png", title: "Gestión de empleados" },
        { src: "/projects/erp/inventario.png", title: "Gestión de productos e inventario" },
        { src: "/projects/erp/Proveedores.png", title: "Gestión de proveedores" },
      ],
    },

    mobile: {
      type: t.projects.salon.type,
      title: t.projects.salon.title,
      shortDescription: t.projects.salon.shortDescription || t.projects.salon.description,
      description: t.projects.salon.description,
      technologiesLabel: t.projects.salon.technologies,
      featuresLabel: t.projects.salon.features,
      frame: "phone",

      technologies: (
        <>
          <span><FaReact />React Native</span>
          <span><SiExpo />Expo</span>
          <span><SiJavascript />JavaScript</span>
          <span><SiFirebase />Firebase</span>
        </>
      ),

      features: [
        t.projects.salon.feature1,
        t.projects.salon.feature2,
        t.projects.salon.feature3,
        t.projects.salon.feature4,
        t.projects.salon.feature5,
        t.projects.salon.feature6,
        t.projects.salon.feature7,
        t.projects.salon.feature8,
      ],

      images: [
        { src: "/projects/mobile/iniciocli.png", title: "Inicio" },
        { src: "/projects/mobile/login.png", title: "Login" },
        { src: "/projects/mobile/turnoscli.png", title: "Reserva de turnos" },
        { src: "/projects/mobile/inicio.png", title: "Dashboard: resumen del día" },
        { src: "/projects/mobile/agenda.png", title: "Agenda completa" },
        { src: "/projects/mobile/produ_serv.png", title: "Catálogo de servicios y productos" },
        { src: "/projects/mobile/g_personal.png", title: "Gestión de personal" },
      ],
    },
  };

  return (
    <section id="projects" className="projects">

      <div className="section-title">
        <h2>{t.projects.title}</h2>
        <p>{t.projects.subtitle}</p>
      </div>

      <div
        className="projects__grid"
        ref={gridRef}
        style={{ flexDirection: gridDirection }}
      >
        {Object.entries(projects).map(([id, data], index) => {
          const isCovered = coveredCard?.id === id;
          const side = index === 0 ? "left" : "right";

          const coveredStyle = isCovered
            ? {
                position: "absolute",
                top: `${coveredCard.top}px`,
                left: `${coveredCard.left}px`,
                width: `${coveredCard.width}px`,
                height: `${coveredCard.height}px`,
                zIndex: 1,
              }
            : undefined;

          return (
            <FeaturedProjectCard
              key={id}
              id={id}
              data={data}
              t={t}
              isExpanded={expandedId === id}
              isClosing={closingId === id}
              side={side}
              coveredStyle={coveredStyle}
              cardRef={(el) => (cardRefs.current[id] = el)}
              onToggle={toggleExpand}
              onOpenGallery={setGalleryId}
            />
          );
        })}
      </div>

      {galleryId && (
        <GalleryModal
          data={projects[galleryId]}
          t={t}
          onClose={() => setGalleryId(null)}
        />
      )}

      {/* =========================
          ÁLBUM DE LANDING PAGES
      ========================== */}

      <div className="landing-pages">

        <div className="section-title">
          <h2>{t.projects.more?.title || "Más proyectos"}</h2>
          <p>{t.projects.more?.subtitle || "Landing pages y sitios que desarrollé para distintos clientes."}</p>
        </div>

        <div className="landing-pages__columns">
          {[0, 1, 2, 3].map((colIndex) => {
            // Reparte las landing pages entre las 4 columnas (col 0 y 2
            // suben, col 1 y 3 bajan)
            const columnItems = landingPages.filter(
              (_, i) => i % 4 === colIndex
            );

            return (
              <LandingColumn
                key={colIndex}
                items={columnItems}
                direction={colIndex % 2 === 0 ? "up" : "down"}
              />
            );
          })}
        </div>

      </div>

    </section>
  );
}

export default Projects;