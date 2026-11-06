import "../styles/contact.css";
import { useEffect, useRef, useState } from "react";

import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaTiktok,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

// Tu número, en formato internacional limpio (sin +, espacios ni guiones)
const WHATSAPP_NUMBER = "5493874477853";

// Ángulos de los rombos que salen disparados del botón al enviar
const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function Contact({ t }) {

  const sectionRef = useRef(null);
  const sentTimer = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [sent, setSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    projectType: "",
    message: "",
  });

  // Dispara las animaciones de entrada cuando la sección aparece en pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // Limpia el temporizador del mensaje "Abriendo WhatsApp…" al desmontar
  useEffect(() => () => window.clearTimeout(sentTimer.current), []);

  // Spotlight de fondo: el foco de luz sigue al cursor por toda la sección
  const handleSpotlightMove = (e) => {
    const el = sectionRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // Elegir el mismo chip otra vez lo desmarca (el tipo de proyecto es opcional)
  const selectType = (value) => {
    setFormData((prev) => ({
      ...prev,
      projectType: prev.projectType === value ? "" : value,
    }));
  };

  // No hay backend: armamos el mensaje con lo que la persona escribió y
  // abrimos WhatsApp con ese texto ya redactado — solo falta que ella
  // misma toque "Enviar" ahí.
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) return;

    const lines = [
      `Hola Axel! Soy ${formData.name}.`,
      formData.projectType ? `Tipo de proyecto: ${formData.projectType}` : null,
      `Mensaje: ${formData.message}`,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");

    setSent(true);
    window.clearTimeout(sentTimer.current);
    sentTimer.current = window.setTimeout(() => setSent(false), 4000);
  };

  const projectTypes = [
    t.hero.role1,
    t.hero.role2,
    t.hero.role3,
    t.hero.role4,
    t.contact.form.projectTypeOther,
  ];

  // Título en dos partes, como en las demás secciones: la última palabra va
  // en el recuadro. Si agregás titleMain / titleSub al locale, se usan.
  const titleWords = (t.contact.heading || "").trim().split(" ");
  const derivedSub = titleWords.pop();
  const titleMain = t.contact.titleMain || titleWords.join(" ");
  const titleSub = t.contact.titleSub || derivedSub;

  // Texto de la cinta que se desplaza (reusa el subtítulo de la sección)
  const marqueeText = (t.contact.subtitle || "").toUpperCase();

  return (
    <section
      id="contact"
      className={`contact ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
      onMouseMove={handleSpotlightMove}
    >

      <div className="contact__grid" />
      <div className="contact__grid contact__grid--spotlight" />

      {/* Rombos decorativos que flotan despacio */}
      <span className="contact__spark contact__spark--1" aria-hidden="true" />
      <span className="contact__spark contact__spark--2" aria-hidden="true" />
      <span className="contact__spark contact__spark--3" aria-hidden="true" />
      <span className="contact__spark contact__spark--4" aria-hidden="true" />

      {/* ENCABEZADO */}

      <div className="contact__header">

        <div className="contact__header-main">
          <span className="contact__tag">{t.contact.title}</span>

          <h2 className="contact__title">
            <span className="contact__title-main">{titleMain}</span>
            <span className="contact__title-sub">{titleSub}</span>
          </h2>
        </div>

        <p className="contact__intro">{t.contact.paragraph1}</p>

      </div>

      <div className="contact__container">

        {/* FORMULARIO: ventana crema, como la tarjeta de notificación del Hero */}

        <form className="contact__card" onSubmit={handleSubmit}>

          <div className="contact__card-bar">
            <span className="contact__dots" aria-hidden="true">
              <span /><span /><span />
            </span>

            <span className="contact__card-tag">
              <FaWhatsapp aria-hidden="true" /> WhatsApp
            </span>
          </div>

          <div className="contact__card-body">

            <div className="contact__field" style={{ "--i": 0 }}>
              <label className="contact__label" htmlFor="contact-name">
                {t.contact.form.nameLabel}
              </label>
              <input
                id="contact-name"
                className="contact__input"
                type="text"
                placeholder={t.contact.form.namePlaceholder}
                value={formData.name}
                onChange={handleChange("name")}
                required
              />
            </div>

            <div className="contact__field" style={{ "--i": 1 }}>
              <span className="contact__label" id="contact-type-label">
                {t.contact.form.projectTypeLabel}
              </span>

              <div
                className="contact__chips"
                role="radiogroup"
                aria-labelledby="contact-type-label"
              >
                {projectTypes.map((type) => {
                  const selected = formData.projectType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      className={`contact__chip ${selected ? "is-selected" : ""}`}
                      onClick={() => selectType(type)}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="contact__field" style={{ "--i": 2 }}>
              <label className="contact__label" htmlFor="contact-message">
                {t.contact.form.messageLabel}
              </label>
              <textarea
                id="contact-message"
                className="contact__input contact__input--area"
                rows={4}
                placeholder={t.contact.form.messagePlaceholder}
                value={formData.message}
                onChange={handleChange("message")}
                required
              />
            </div>

            <div className="contact__field contact__field--submit" style={{ "--i": 3 }}>
              <button
                type="submit"
                className={`contact__submit ${sent ? "is-sent" : ""}`}
              >
                <span className="contact__burst" aria-hidden="true">
                  {BURST_ANGLES.map((angle) => (
                    <i key={angle} style={{ "--a": `${angle}deg` }} />
                  ))}
                </span>

                <FaWhatsapp aria-hidden="true" />
                <span>{sent ? t.contact.form.sending : t.contact.form.submit}</span>
              </button>

              <span className="contact__sr" role="status" aria-live="polite">
                {sent ? t.contact.form.sending : ""}
              </span>
            </div>

          </div>

        </form>

        {/* CONTACTO DIRECTO */}

        <aside className="contact__side">

          <div className="contact__status">
            <span className="contact__status-dot" aria-hidden="true" />
            {t.hero.available}
          </div>

          <div className="contact__location">
            <FaMapMarkerAlt aria-hidden="true" />
            <span>{t.contact.location}</span>
          </div>

          <h3 className="contact__side-title">{t.contact.form.directTitle}</h3>

          <a href="mailto:axelvinticola@gmail.com" className="contact__ticket" style={{ "--i": 0 }}>
            <span className="contact__ticket-icon"><FaEnvelope /></span>
            <span className="contact__ticket-text">
              <span>{t.contact.email}</span>
              <strong>axelvinticola@gmail.com</strong>
            </span>
            <span className="contact__ticket-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://linkedin.com/in/axel-vinticola-2b7245208"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__ticket"
            style={{ "--i": 1 }}
          >
            <span className="contact__ticket-icon"><FaLinkedin /></span>
            <span className="contact__ticket-text">
              <span>{t.contact.linkedin}</span>
              <strong>{t.contact.linkedinAction}</strong>
            </span>
            <span className="contact__ticket-arrow" aria-hidden="true">↗</span>
          </a>

          <a
            href="https://github.com/AxelVinticola"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__ticket"
            style={{ "--i": 2 }}
          >
            <span className="contact__ticket-icon"><FaGithub /></span>
            <span className="contact__ticket-text">
              <span>{t.contact.github}</span>
              <strong>{t.contact.githubAction}</strong>
            </span>
            <span className="contact__ticket-arrow" aria-hidden="true">↗</span>
          </a>

          <div className="contact__socials">

            <a
              href="https://www.instagram.com/axel_na.vi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.contact.instagram}
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.tiktok.com/@axel.navi"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.contact.tiktok}
            >
              <FaTiktok />
            </a>

          </div>

        </aside>

      </div>

      {/* CINTA INCLINADA: puramente decorativa, se pausa al pasar el mouse */}

      <div className="contact__marquee" aria-hidden="true">
        <div className="contact__marquee-track">
          {[0, 1].map((half) => (
            <div className="contact__marquee-half" key={half}>
              {Array.from({ length: 6 }).map((_, i) => (
                <span className="contact__marquee-item" key={i}>
                  {marqueeText}
                  <i />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

export default Contact;