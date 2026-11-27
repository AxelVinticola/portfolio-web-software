import { useEffect, useRef, useState } from "react";
import "../styles/gallery.css";

// ============================================================
// GALERÍA — "Más proyectos"
// Cada entrada acepta:
//  - image: ruta de la captura (cuando las pases a .webp, cambiá la extensión acá)
//  - url:   link al sitio. Si lo tiene, la tarjeta abre ese link. Si es null,
//           al tocarla se abre la imagen en grande.
//  - alt:   descripción de la imagen (también se muestra en la barra de la ventana)
//  - title: (opcional) texto de la barra; si no está, se usa el dominio del link o el alt
// Si una imagen no existe todavía, se muestra un marcador de posición.
// ============================================================

const galleryImages = [
  { image: "/projects/gallery/hilosysuelas.png", url: null, alt: "Landing page 1" },
  { image: "/gallery/landing-2.png", url: null, alt: "Landing page 2" },
  { image: "/gallery/landing-3.png", url: null, alt: "Landing page 3" },
  { image: "/gallery/landing-4.png", url: null, alt: "Landing page 4" },
  { image: "/gallery/landing-5.png", url: null, alt: "Landing page 5" },
  { image: "/gallery/landing-6.png", url: null, alt: "Landing page 6" },
  { image: "/gallery/landing-7.png", url: null, alt: "Landing page 7" },
  { image: "/gallery/landing-8.png", url: null, alt: "Landing page 8" },
  { image: "/gallery/landing-9.png", url: null, alt: "Landing page 9" },
  { image: "/gallery/landing-10.png", url: null, alt: "Landing page 10" },
  { image: "/gallery/landing-11.png", url: null, alt: "Landing page 11" },
  { image: "/gallery/landing-12.png", url: null, alt: "Landing page 12" },
  { image: "/gallery/landing-13.png", url: null, alt: "Landing page 13" },
  { image: "/gallery/landing-14.png", url: null, alt: "Landing page 14" },
  { image: "/gallery/landing-15.png", url: null, alt: "Landing page 15" },
  { image: "/gallery/landing-16.png", url: null, alt: "Landing page 16" },
];

// Inclinaciones suaves y alternadas (en grados): se enderezan al pasar el mouse
const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9, -1.9, 1.4];

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (e) {
    return "";
  }
}

const pad = (n) => String(n).padStart(2, "0");

function GalleryCard({ item, number, tilt, loaded, failed, onLoad, onFail, onOpen, duplicate }) {
  const label = item.title || hostOf(item.url) || item.alt || `Proyecto ${pad(number)}`;

  const inner = (
    <>
      <span className="gallery-card__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="gallery-card__url">{label}</span>
      </span>

      <span className="gallery-card__shot">
        {/* Marcador de posición: queda siempre debajo y la imagen lo tapa al cargar */}
        <span className="gallery-card__empty" aria-hidden="true">
          <i />
          <i />
          <i />
          <b>{pad(number)}</b>
        </span>

        {!failed && (
          <img
            className={loaded ? "is-loaded" : ""}
            src={item.image}
            alt={duplicate ? "" : item.alt || label}
            width="1886"
            height="834"
            loading="lazy"
            decoding="async"
            onLoad={() => onLoad(number - 1)}
            onError={() => onFail(number - 1)}
          />
        )}

        {(item.url || loaded) && (
          <span className="gallery-card__chip" aria-hidden="true">
            {item.url ? "\u2197" : "+"}
          </span>
        )}
      </span>
    </>
  );

  const common = {
    className: `gallery-card ${loaded ? "is-loaded" : "is-empty"}`,
    style: { "--tilt": `${tilt}deg` },
    tabIndex: duplicate ? -1 : undefined,
  };

  if (item.url) {
    return (
      <a {...common} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      {...common}
      disabled={!loaded}
      onClick={() => onOpen(number - 1)}
      aria-label={label}
    >
      {inner}
    </button>
  );
}

// Visor de imagen en grande (para las tarjetas que no tienen link)
function Lightbox({ items, current, onClose, onMove }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };

    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose, onMove]);

  const item = items[current];
  const label = item.title || hostOf(item.url) || item.alt || "";

  return (
    <div className="gallery-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className="gallery-lightbox__frame" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="gallery-lightbox__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <img src={item.image} alt={item.alt || label} className="gallery-lightbox__image" />

        <div className="gallery-lightbox__caption">{label}</div>

        {items.length > 1 && (
          <div className="gallery-lightbox__nav">
            <button type="button" onClick={() => onMove(-1)} aria-label="Anterior">‹</button>
            <span>
              {current + 1} / {items.length}
            </span>
            <button type="button" onClick={() => onMove(1)} aria-label="Siguiente">›</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Gallery({ t }) {
  const rootRef = useRef(null);
  const rowsRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loaded, setLoaded] = useState(() => new Set());
  const [failed, setFailed] = useState(() => new Set());
  const [open, setOpen] = useState(null); // índice (dentro de las imágenes que sí existen)

  // La entrada se dispara una vez; las cintas solo se mueven mientras se ven
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      setIsPlaying(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPlaying(entry.isIntersecting);
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.12 }
    );

    if (rootRef.current) observer.observe(rootRef.current);

    return () => observer.disconnect();
  }, []);

  const markLoaded = (index) => {
    setLoaded((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const markFailed = (index) => {
    setFailed((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Spotlight de puntitos que sigue al cursor (como en las secciones oscuras)
  const handleMove = (e) => {
    const el = rowsRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  // Dos cintas: pares arriba, impares abajo. Cada una se repite hasta tener
  // suficientes tarjetas y se duplica para que el loop no tenga saltos.
  const numbered = galleryImages.map((item, i) => ({ item, number: i + 1 }));
  const split = [
    numbered.filter((_, i) => i % 2 === 0),
    numbered.filter((_, i) => i % 2 === 1),
  ];

  const buildGroup = (list) => {
    if (list.length === 0) return [];
    let group = list;
    while (group.length < 8) group = [...group, ...list];
    return group;
  };

  // Imágenes que ya cargaron, para el visor
  const viewable = numbered.filter(({ number }) => loaded.has(number - 1)).map(({ item }) => item);

  const openAt = (itemIndex) => {
    const item = galleryImages[itemIndex];
    const position = viewable.indexOf(item);
    if (position >= 0) setOpen(position);
  };

  const moveLightbox = (step) => {
    setOpen((current) => {
      if (current === null || viewable.length === 0) return current;
      return (current + step + viewable.length) % viewable.length;
    });
  };

  // Título en dos partes, como en las demás secciones: la última palabra va
  // en el recuadro. Si agregás titleMain / titleSub a projects.more, se usan.
  const more = t?.projects?.more || {};
  const words = (more.title || "Más proyectos").trim().split(" ");
  const derivedSub = words.pop();
  const titleMain = more.titleMain || words.join(" ");
  const titleSub = more.titleSub || derivedSub;
  const subtitle = more.subtitle || "Landing pages y sitios que desarrollé para distintos clientes.";

  return (
    <div
      className={`gallery ${isVisible ? "is-visible" : ""} ${isPlaying ? "is-playing" : ""}`}
      ref={rootRef}
    >

      <div className="gallery__header">

        <div className="gallery__header-main">
          {more.tag && <span className="gallery__tag">{more.tag}</span>}

          <h3 className="gallery__title">
            {titleMain && <span className="gallery__title-main">{titleMain}</span>}
            <span className="gallery__title-sub">{titleSub}</span>
          </h3>
        </div>

        <p className="gallery__subtitle">{subtitle}</p>

      </div>

      <div className="gallery__rows" ref={rowsRef} onMouseMove={handleMove}>

        <div className="gallery__dots" aria-hidden="true" />
        <div className="gallery__dots gallery__dots--spot" aria-hidden="true" />

        {split.map((list, rowIndex) => {
          const group = buildGroup(list);

          return (
            <div
              key={rowIndex}
              className={`gallery-row ${rowIndex === 1 ? "gallery-row--reverse gallery-row--b" : "gallery-row--a"}`}
            >
              <div className="gallery-row__track">
                {[0, 1].map((copy) => (
                  <div
                    className="gallery-row__half"
                    key={copy}
                    aria-hidden={copy === 1 ? "true" : undefined}
                  >
                    {group.map(({ item, number }, i) => (
                      <GalleryCard
                        key={`${copy}-${i}`}
                        item={item}
                        number={number}
                        tilt={TILTS[(i + rowIndex * 3) % TILTS.length]}
                        loaded={loaded.has(number - 1)}
                        failed={failed.has(number - 1)}
                        onLoad={markLoaded}
                        onFail={markFailed}
                        onOpen={openAt}
                        duplicate={copy === 1}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

      </div>

      {open !== null && viewable[open] && (
        <Lightbox
          items={viewable}
          current={open}
          onClose={() => setOpen(null)}
          onMove={moveLightbox}
        />
      )}

    </div>
  );
}

export default Gallery;