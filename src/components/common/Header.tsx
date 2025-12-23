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
    const scroll = () => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      setTimeout(scroll, 80);
    } else {
      scroll();
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
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <img
              src="/logo.png"
              alt="Luraaya Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Luraaya
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              type="button"
              onClick={() => goToSection("signup")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.getStarted")}
            </button>

            <button
              type="button"
              onClick={() => goToSection("features")}
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.howItWorks")}
            </button>

            <button
              type="button"
              onClick={() => goToSection("signup")}
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
                  <Link to="/auth/signup">
                    <Button size="sm">{t("nav.signup")}</Button>
                  </Link>
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
              <nav className="flex flex-col space-y-4">
                {/* Sprache ganz oben, zentriert */}
                <div className="flex justify-center">
                  <LanguageSelector variant="mobile" className="font-normal" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    goToSection("signup");
                    closeMenu();
                  }}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {t("nav.getStarted")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    goToSection("features");
                    closeMenu();
                  }}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {t("nav.howItWorks")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    goToSection("signup");
                    closeMenu();
                  }}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors"
                >
                  {t("nav.pricing")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    goToSection("footer");
                    closeMenu();
                  }}
                  className="text-left text-gray-700 hover:text-purple-600 transition-colors"
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
                  <>
                    <Link to="/auth/login" onClick={closeMenu}>
                      <Button variant="outline" fullWidth>
                        {t("nav.login")}
                      </Button>
                    </Link>
                    <Link to="/auth/signup" onClick={closeMenu}>
                      <Button fullWidth>{t("nav.signup")}</Button>
                    </Link>
                  </>
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
