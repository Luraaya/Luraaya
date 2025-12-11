import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.jpg" alt="logo" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                Luraaya
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#signup"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.getStarted")}
            </a>
            <a
              href="#features"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.howItWorks")}
            </a>
            <a
              href="#signup"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.pricing")}
            </a>
            {/* Contact */}
            <a
              href="#footer"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              {t("nav.contact")}
            </a>

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
            <LanguageSelector variant="header" />
            {!loading && (
              <>
                {user ? (
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
                )}
              </>
            )}
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
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-[4.5rem] bg-black bg-opacity-40 z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Dropdown Menu */}
            <div className="fixed top-18 left-0 right-0 z-50 bg-white shadow-lg rounded-b-2xl p-6 animate-dropdown">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#signup"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.getStarted")}
                </a>
                <a
                  href="#features"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.howItWorks")}
                </a>
                <a
                  href="#signup"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.pricing")}
                </a>
                <a
                  href="#footer"
                  className="text-gray-700 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("nav.contact")}
                </a>

                {user && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-purple-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("nav.dashboard")}
                  </Link>
                )}
                {!loading && (
                  <div className="flex flex-col space-y-2 pt-2">
                    {user ? (
                      <div className="pt-2 flex space-x-4 items-center">
                        <LanguageSelector variant="mobile" />
                        <UserDropdown variant="mobile" />
                      </div>
                    ) : (
                      <>
                        <div className="pt-2">
                          <LanguageSelector variant="mobile" />
                        </div>
                        <Link
                          to="/auth/login"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button variant="outline" fullWidth>
                            {t("nav.login")}
                          </Button>
                        </Link>
                        <Link
                          to="/auth/signup"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Button fullWidth>{t("nav.signup")}</Button>
                        </Link>
                      </>
                    )}
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
