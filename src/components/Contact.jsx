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

function Contact({ t }) {

  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sent, setSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    projectType: "",
    message: "",
  });

  // Revela el formulario de a poco cuando la sección entra en pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

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

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  // No hay backend: en vez de "enviar" en silencio, armamos el mensaje
  // con lo que la persona escribió y abrimos WhatsApp con ese texto ya
  // redactado — solo falta que ella misma toque "Enviar" ahí.
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
    window.setTimeout(() => setSent(false), 4000);
  };

  const projectTypes = [t.hero.role1, t.hero.role2, t.hero.role3, t.hero.role4];

  return (
    <section
      id="contact"
      className={`contact ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
      onMouseMove={handleSpotlightMove}
    >

      <div className="contact__grid" />
      <div className="contact__grid contact__grid--spotlight" />

      <div className="section-title">
        <h2>{t.contact.title}</h2>
        <p>{t.contact.subtitle}</p>
      </div>

      <div className="contact__container">

        {/* Columna principal: formulario → WhatsApp */}

        <div className="contact__form-col">

          <h3>{t.contact.heading}</h3>

          <p className="contact__intro">{t.contact.paragraph1}</p>

          <form className="contact__form" onSubmit={handleSubmit}>

            <div className="contact__field">
              <label htmlFor="contact-name">{t.contact.form.nameLabel}</label>
              <input
                id="contact-name"
                type="text"
                placeholder={t.contact.form.namePlaceholder}
                value={formData.name}
                onChange={handleChange("name")}
                required
              />
            </div>

            <div className="contact__field">
              <label htmlFor="contact-project-type">{t.contact.form.projectTypeLabel}</label>
              <select
                id="contact-project-type"
                value={formData.projectType}
                onChange={handleChange("projectType")}
              >
                <option value="">—</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
                <option value={t.contact.form.projectTypeOther}>
                  {t.contact.form.projectTypeOther}
                </option>
              </select>
            </div>

            <div className="contact__field">
              <label htmlFor="contact-message">{t.contact.form.messageLabel}</label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder={t.contact.form.messagePlaceholder}
                value={formData.message}
                onChange={handleChange("message")}
                required
              />
            </div>

            <button type="submit" className="contact__submit">
              <FaWhatsapp />
              {t.contact.form.submit}
            </button>

            <span className={`contact__sending ${sent ? "is-visible" : ""}`}>
              {t.contact.form.sending}
            </span>

          </form>

        </div>

        {/* Columna secundaria: contacto directo */}

        <div className="contact__direct-col">

          <h4>{t.contact.form.directTitle}</h4>

          <div className="contact__location">
            <FaMapMarkerAlt />
            <span>{t.contact.location}</span>
          </div>

          <a href="mailto:axelvinticola@gmail.com" className="contact__item">
            <FaEnvelope />
            <div>
              <span>{t.contact.email}</span>
              <strong>axelvinticola@gmail.com</strong>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/axel-vinticola-2b7245208"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__item"
          >
            <FaLinkedin />
            <div>
              <span>{t.contact.linkedin}</span>
              <strong>{t.contact.linkedinAction}</strong>
            </div>
          </a>

          <a
            href="https://github.com/AxelVinticola"
            target="_blank"
            rel="noopener noreferrer"
            className="contact__item"
          >
            <FaGithub />
            <div>
              <span>{t.contact.github}</span>
              <strong>{t.contact.githubAction}</strong>
            </div>
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

        </div>

      </div>

    </section>
  );
}

export default Contact;