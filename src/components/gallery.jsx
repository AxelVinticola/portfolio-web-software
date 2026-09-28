import "../styles/gallery.css";
import { useState } from "react";

// ============================================================
// GALERÍA DE LANDING PAGES
// 2 cintas horizontales infinitas (una va a la izquierda, la otra
// a la derecha), solo imágenes, sin texto — se pausan al pasar
// el cursor por encima.
//
// Agregá tus propias landing pages en el array de abajo. Cada
// objeto necesita:
//  - image: ruta a la captura de esa landing
//  - url:   link al sitio en vivo. Si todavía no está online,
//           dejá "url: null" y esa imagen deja de ser clickeable
//           automáticamente (no hace falta tocar nada más).
//  - alt:   texto alternativo descriptivo (accesibilidad / SEO)
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

// Una sola imagen: clickeable si tiene url, decorativa si no
function GalleryImage({ item }) {

  const [failed, setFailed] = useState(false);

  const content = !failed ? (
    <img
      src={item.image}
      alt={item.alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="gallery-image__placeholder">Agregar imagen</span>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="gallery-image"
      >
        {content}
      </a>
    );
  }

  return <div className="gallery-image">{content}</div>;
}

// Una fila que se mueve hacia la izquierda o la derecha en loop
// infinito — el array se duplica para que el loop sea perfecto
// (misma técnica que las cintas de Tecnologías). Se pausa entera
// al pasar el cursor.
function GalleryRow({ items, direction }) {
  const doubled = [...items, ...items];

  return (
    <div className="gallery-row">
      <div
        className={`gallery-row__track ${direction === "right" ? "gallery-row__track--reverse" : ""}`}
      >
        {doubled.map((item, index) => (
          <GalleryImage key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function Gallery() {

  // Reparte las 16 imágenes entre las 2 filas (pares/impares)
  const rowA = galleryImages.filter((_, i) => i % 2 === 0);
  const rowB = galleryImages.filter((_, i) => i % 2 === 1);

  return (
    <div className="gallery">
      <GalleryRow items={rowA} direction="left" />
      <GalleryRow items={rowB} direction="right" />
    </div>
  );
}

export default Gallery;