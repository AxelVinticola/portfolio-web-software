import "../styles/footer.css";
import { FaLinkedin } from "react-icons/fa";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

function Footer({ t }) {

  const year = new Date().getFullYear();

  return (
    <footer className="footer">

      <p className="footer__copy">
        © {year} Axel NaVi — Axel Vintícola
      </p>

      <div className="footer__links">

        <a
          href="https://linkedin.com/in/axel-vintícola-2b7245208"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
        >
          <FaLinkedin />
          LinkedIn
        </a>

        <a
          href="/CV_Vinticola_Axel_2026.pdf"
          download="CV_Vinticola_Axel_2026.pdf"
          className="footer__link"
        >
          <HiOutlineDocumentArrowDown />
          {t.hero.downloadCV}
        </a>

      </div>

    </footer>
  );
}

export default Footer;