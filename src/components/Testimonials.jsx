import "../styles/testimonials.css";
import { useState } from "react";

// ============================================================
// TESTIMONIOS — reemplazá cada uno por el comentario real de tu
// cliente. Cada objeto acepta:
//  - quote: la cita textual del cliente
//  - name: nombre del cliente
//  - role: cargo + empresa (ej: "Dueña, Yume Sakura Salon")
//  - avatar: ruta a una foto (opcional). Si la dejás en null, o si
//    la imagen no carga, se muestran las iniciales del nombre.
//  - rating: de 1 a 5 estrellas
// ============================================================

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

function TestimonialCard({ item }) {

  const [avatarFailed, setAvatarFailed] = useState(false);

  const initials = item.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="testimonial-card">

      <Stars rating={item.rating} />

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
          <span>{item.role}</span>
        </div>

      </div>

    </div>
  );
}

// Una fila que se mueve hacia la izquierda o la derecha en loop
// infinito — el array se duplica para que el loop sea perfecto
// (misma técnica que las demás cintas del sitio). Se pausa entera
// al pasar el cursor.
function TestimonialRow({ items, direction }) {
  const doubled = [...items, ...items];

  return (
    <div className="testimonial-row">
      <div
        className={`testimonial-row__track ${direction === "right" ? "testimonial-row__track--reverse" : ""}`}
      >
        {doubled.map((item, index) => (
          <TestimonialCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

function Testimonials({ t }) {

  // Reparte los testimonios entre las 2 filas (pares/impares)
  const rowA = testimonials.filter((_, i) => i % 2 === 0);
  const rowB = testimonials.filter((_, i) => i % 2 === 1);

  return (
    <section id="testimonials" className="testimonials">

      <div className="testimonials__header">
        <h2>{t?.testimonials?.title || "Lo que dicen mis clientes"}</h2>
        <p>{t?.testimonials?.subtitle || "Proyectos reales, resultados reales."}</p>
      </div>

      <div className="testimonials__rows">
        <TestimonialRow items={rowA} direction="right" />
        <TestimonialRow items={rowB} direction="left" />
      </div>

    </section>
  );
}

export default Testimonials;