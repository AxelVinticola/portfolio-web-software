import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import es from "./locales/es";
import en from "./locales/en";

function App() {

  const [language, setLanguage] = useState("es");
  const t = language === "es" ? es : en;

  return (

    <>

      <Navbar
        language={language}
        setLanguage={setLanguage}
        t={t}
      />

      <Hero t={t}/>

      <About t={t}/>

      <Skills t={t}/>

      <Projects t={t}/>

      <Education t={t}/>

      <Contact t={t}/>

      <Footer t={t}/>

    </>

  )

}

export default App;