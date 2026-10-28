import "../styles/skills.css";

import {
  FaReact,
  FaPython,
  FaJava,
  FaPhp,
  FaGitAlt,
  FaGithub,
  FaDatabase,
  FaHtml5,
  FaCss3Alt,
  FaCode,
  FaRocket,
} from "react-icons/fa";

import {
  SiJavascript,
  SiTypescript,
  SiDjango,
  SiMysql,
  SiFirebase,
  SiSupabase,
  SiBootstrap,
  SiTrello,
  SiFigma,
  SiJquery,
  SiDocker,
  SiAngular,
} from "react-icons/si";

// Una tarjeta chica: ícono arriba, nombre abajo
function TechChip({ icon, name }) {
  return (
    <div className="tech-chip">
      <span className="tech-chip__icon">
        {icon || <span className="tech-chip__text-icon">C#</span>}
      </span>
      <span className="tech-chip__name">{name}</span>
      <div className="tech-chip__indicator"></div>
    </div>
  );
}

// Una cinta infinita: el array se duplica para que el loop sea perfecto,
// y se pausa entera al pasar el cursor sobre cualquiera de sus tecnologías
function MarqueeRow({ items, reverse }) {
  const doubled = [...items, ...items];

  return (
    <div className="tech-marquee">
      <div
        className={`tech-marquee__track ${reverse ? "tech-marquee__track--reverse" : ""}`}
      >
        {doubled.map((item, index) => (
          <TechChip key={index} icon={item.icon} name={item.name} />
        ))}
      </div>
    </div>
  );
}

function Skills({ t }) {

  const allTech = [
    { name: "React", icon: <FaReact /> },
    { name: "Python", icon: <FaPython /> },
    { name: "JavaScript", icon: <SiJavascript /> },
    { name: "Django", icon: <SiDjango /> },
    { name: "TypeScript", icon: <SiTypescript /> },
    { name: "Java", icon: <FaJava /> },
    { name: "HTML", icon: <FaHtml5 /> },
    { name: "PHP", icon: <FaPhp /> },
    { name: "CSS", icon: <FaCss3Alt /> },
    { name: "C#", icon: null },
    { name: "Bootstrap", icon: <SiBootstrap /> },
    { name: "MySQL", icon: <SiMysql /> },
    { name: "jQuery", icon: <SiJquery /> },
    { name: "Firebase", icon: <SiFirebase /> },
    { name: "Angular", icon: <SiAngular /> },
    { name: "Supabase", icon: <SiSupabase /> },
    { name: "React Native", icon: <FaReact /> },
    { name: "SQL", icon: <FaDatabase /> },
    { name: "Expo", icon: <FaRocket /> },
    { name: "Git", icon: <FaGitAlt /> },
    { name: "GitHub", icon: <FaGithub /> },
    { name: "VS Code", icon: <FaCode /> },
    { name: "Trello", icon: <SiTrello /> },
    { name: "Figma", icon: <SiFigma /> },
    { name: "Docker", icon: <SiDocker /> },
  ];

  const rowLeft = allTech.filter((_, index) => index % 2 === 0);
  const rowRight = allTech.filter((_, index) => index % 2 === 1);

  return (
    <section id="skills" className="skills">
      <div className="skills__container">
        
       {/* ENCABEZADO ESTILO REFERENCIA */}
        <div className="skills__header-area">
          <div className="skills__top-tag">
            <span className="skills__tag-line"></span>
            <span>{t.skills.tag}</span>
          </div>

          <div className="skills__title-wrapper">
            <h2 className="skills__huge-title">{t.skills.titleMain}</h2>
            <div className="skills__banner-box">
              <span className="skills__banner-text">{t.skills.titleSub}</span>
            </div>
          </div>

          <div className="skills__subtitle-box">
            <p>{t.skills.subtitle}</p>
          </div>
        </div>

        {/* CINTAS INFINITAS (CARRUSEL INTACTO) */}
        <div className="skills__marquees">
          <MarqueeRow items={rowLeft} reverse={false} />
          <MarqueeRow items={rowRight} reverse={true} />
        </div>

      </div>
    </section>
  );
}

export default Skills;