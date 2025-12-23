import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { Mail, Instagram } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../../contexts/LanguageContext";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer
      id="footer"
      className="bg-gray-900 text-white pt-16"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <Container>
        {/* Drei gleich grosse Spalten */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Spalte 1: Brand */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="Luraaya"
                className="h-7 w-7 object-contain"
                loading="lazy"
              />
              <span className="text-xl font-bold text-white">Luraaya</span>
            </div>

            <p className="text-gray-400 mb-4">
              {t("footer.content")}
            </p>

            <div className="flex items-center gap-4">
              <a
                href="mailto:luraaya@outlook.com"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="E-Mail"
              >
                <Mail size={20} />
              </a>

              <a
                href="https://www.instagram.com/luraaya.official/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Spalte 2: Rechtliches */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.columns.legal.title")}
            </h3>

            <ul className="space-y-2">
              <li>
                <Link
                  to="/datenschutz"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.legal.privacyPolicy")}
                </Link>
              </li>

              <li>
                <Link
                  to="/agb"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.legal.termsOfService")}
                </Link>
              </li>

              <li>
                <Link
                  to="/cookies"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.legal.cookies")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Spalte 3: Kontakt */}
          <div className="min-w-0">
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.columns.contact.title")}
            </h3>

            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:luraaya@outlook.com"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  luraaya@outlook.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom-Bar */}
      <div
        className="border-t border-gray-800 py-6"
        style={{
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Luraaya. All rights reserved.
            </p>

            <div className="shrink-0">
              <LanguageSelector variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
