import "../styles/hero.css";

function Hero({ t }) {
  return (
    <section id="hero" className="hero">

      <div className="hero__blob hero__blob--1"></div>
      <div className="hero__blob hero__blob--2"></div>
      <div className="hero__blob hero__blob--3"></div>

      <div className="hero__content">

        <span className="hero__badge">
          {t.hero.available}
        </span>

        <h1 className="hero__title">
          Axel NaVi
        </h1>

        <h2 className="hero__subtitle">
          {t.hero.subtitle}
        </h2>

        <p className="hero__description">
          {t.hero.description}
        </p>

        <div className="hero__stack">
          <span>Python</span>
          <span>Django</span>
          <span>React</span>
          <span>React Native</span>
        </div>

        <div className="hero__buttons">

          <a href="#projects" className="btn btn-primary">
            {t.hero.projects}
          </a>

          <a
            href="/CV_Vinticola_Axel_2026.pdf"
            download="CV_Vinticola_Axel_2026.pdf"
            className="btn btn-secondary"
          >
            {t.hero.downloadCV}
          </a>

        </div>

      </div>

      <div className="hero__image">

        <div className="hero__photo">
          <img
            src="/logoAV.png"
            alt="Axel Vintícola"
          />
        </div>

      </div>

    </section>
  );
}

export default Hero;