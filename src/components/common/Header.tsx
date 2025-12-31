import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Container from "./Container";
import Button from "./Button";
import LanguageSelector from "./LanguageSelector";
import UserDropdown from "./UserDropdown";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const goToSection = (id: string) => {
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempt < 40) {
        requestAnimationFrame(() => tryScroll(attempt + 1));
      }
    };

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      requestAnimationFrame(() => tryScroll());
    } else {
      window.location.hash = id;
      tryScroll();
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[9999] border-b border-gray-200 bg-white px-4"
      style={{
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <Container>
        <div className="flex items-center justify-between h-[56px]">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Luraaya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">

            <button
              type="button"
              onClick={() => goToSection("features")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.howItWorks")}
            </button>

            <button
              type="button"
              onClick={() => goToSection("pricing")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.pricing")}
            </button>

            <button
              type="button"
              onClick={() => goToSection("footer")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.contact")}
            </button>

            {user && (
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                {t("nav.dashboard")}
              </Link>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector variant="header" className="font-normal" />
            {!loading &&
              (user ? (
                <UserDropdown variant="header" />
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button variant="outline" size="sm">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <button type="button" onClick={() => goToSection("signup")}>
                    <Button size="sm">{t("nav.signup")}</Button>
                  </button>
                </>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 top-[4.5rem] bg-black bg-opacity-40 z-40"
              onClick={closeMenu}
            />

            <div className="fixed left-0 right-0 top-[4.5rem] z-50 rounded-b-2xl bg-white shadow-lg p-6 animate-dropdown">
              <nav className="flex flex-col space-y-5">
                {/* Sprache ganz oben, zentriert */}
                <div className="flex justify-center">
                  <LanguageSelector variant="mobile" className="font-normal text-sm opacity-100" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    goToSection("signup");
                    closeMenu();
                  }}
                  className="text-center text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {t("nav.getStarted")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    goToSection("features");
                    closeMenu();
                  }}
                  className="text-center text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {t("nav.howItWorks")}
                </button>


                <button
                  type="button"
                  onClick={() => {
                    goToSection("pricing");
                    closeMenu();
                  }}
                  className="text-center text-gray-700 hover:text-purple-600 transition-colors"
                >
                  Preise
                </button>

                <button
                  type="button"
                  onClick={() => {
                    goToSection("footer");
                    closeMenu();
                  }}
                  className="text-center text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {t("nav.contact")}
                </button>

                {user && (
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    {t("nav.dashboard")}
                  </Link>
                )}
                {!loading && !user && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    <Link to="/auth/login" onClick={closeMenu} className="flex-1">
                      <Button variant="outline" fullWidth>
                        {t("nav.login")}
                      </Button>
                    </Link>

                      <button
                        type="button"
                        onClick={() => {
                          goToSection("signup");
                          closeMenu();
                        }}
                        className="flex-1"
                      >
                        <Button fullWidth>{t("nav.signup")}</Button>
                      </button>
                  </div>
                )}
              </nav>
            </div>
          </>
        )}
      </Container>
    </header>
  );
};

export default Header;
