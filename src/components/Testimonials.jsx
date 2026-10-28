import "../styles/testimonials.css";
import { useState } from "react";

// Los nombres (name) y citas (quote) se mantienen sin traducir tal como pediste
const testimonials = [
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 1", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 2", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 3", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 4", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 5", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 6", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 7", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 8", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 9", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 10", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 11", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 12", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 13", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 14", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 15", role: "Cargo, Empresa", avatar: null, rating: 5 },
  { quote: "Escribí acá el comentario real de tu cliente.", name: "Cliente 16", role: "Cargo, Empresa", avatar: null, rating: 5 },
];

function Stars({ rating }) {
  return (
    <div className="testimonial-card__stars" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "is-filled" : ""}>★</span>
      ))}
    </div>
  );
}

function TestimonialCard({ item, fallbackRole }) {
  const [avatarFailed, setAvatarFailed] = useState(false);

  const initials = item.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="testimonial-card">
      <div className="testimonial-card__top">
        <Stars rating={item.rating} />
        <span className="testimonial-card__quote-icon" aria-hidden="true">”</span>
      </div>

      <p className="testimonial-card__quote">“{item.quote}”</p>

      <div className="testimonial-card__author">
        <div className="testimonial-card__avatar">
          {item.avatar && !avatarFailed ? (
            <img
              src={item.avatar}
              alt={item.name}
              loading="lazy"
              onError={() => setAvatarFailed(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <div className="testimonial-card__info">
          <strong>{item.name}</strong>
          <span>{item.role === "Cargo, Empresa" && fallbackRole ? fallbackRole : item.role}</span>
        </div>
      </div>

      <div className="testimonial-card__indicator"></div>
    </div>
  );
}

function TestimonialRow({ items, direction, fallbackRole }) {
  const doubled = [...items, ...items];

  return (
    <div className="testimonial-row">
      <div
        className={`testimonial-row__track ${direction === "right" ? "testimonial-row__track--reverse" : ""}`}
      >
        {doubled.map((item, index) => (
          <TestimonialCard key={index} item={item} fallbackRole={fallbackRole} />
        ))}
      </div>
    </div>
  );
}

function Testimonials({ t }) {
  const rowA = testimonials.filter((_, i) => i % 2 === 0);
  const rowB = testimonials.filter((_, i) => i % 2 === 1);

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials__container">
        
        {/* ENCABEZADO CONECTADO A TRADUCCIÓN */}
        <div className="testimonials__header-area">
          <div className="testimonials__top-tag">
            <span className="testimonials__tag-line"></span>
            <span>{t?.testimonials?.tag || "TESTIMONIOS Y OPINIONES"}</span>
          </div>

          <div className="testimonials__title-wrapper">
            <h2 className="testimonials__huge-title">{t?.testimonials?.titleMain || "LO QUE DICEN"}</h2>
            <div className="testimonials__banner-box">
              <span className="testimonials__banner-text">{t?.testimonials?.titleSub || "MIS CLIENTES."}</span>
            </div>
          </div>

          <div className="testimonials__subtitle-box">
            <p>{t?.testimonials?.subtitle || "Experiencias reales que respaldan cada línea de código y cada proyecto desplegado."}</p>
          </div>
        </div>

        {/* CINTAS INFINITAS */}
        <div className="testimonials__rows">
          <TestimonialRow items={rowA} direction="right" fallbackRole={t?.testimonials?.roleFallback} />
          <TestimonialRow items={rowB} direction="left" fallbackRole={t?.testimonials?.roleFallback} />
        </div>

      </div>
    </section>
  );
}

export default Testimonials;