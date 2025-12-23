/**
 * Language Selector Component
 * Header + Mobile: Fullscreen overlay im Luraaya-Stil (helles Aurora-Design)
 * Footer + Dashboard: Kleines Dropdown (wie bisher)
 */

import React, { useEffect, useRef, useState } from "react";
import { useLanguage, Language } from "../../contexts/LanguageContext";
import { ChevronDown, Globe, X } from "lucide-react";

interface LanguageSelectorProps {
  variant?: "header" | "footer" | "dashboard" | "mobile";
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "header",
  className = "",
}) => {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string }[] = [
    { code: "de" as Language, name: "Deutsch" },
    { code: "en" as Language, name: "English" },
    { code: "fr" as Language, name: "Français" },
  ];

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const showOverlay = variant === "header" || variant === "mobile";

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "footer":
        return {
          button:
            "flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-md hover:bg-gray-800",
          dropdown:
            "absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-md shadow-lg z-50 border border-gray-700",
          option:
            "flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors",
          selected: "bg-gray-700 text-white",
        };
      case "dashboard":
        return {
          button:
            "flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-md hover:bg-gray-100",
          dropdown:
            "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200",
          option:
            "flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors",
          selected: "bg-purple-50 text-purple-700",
        };
      case "mobile":
      case "header":
      default:
        return {
          button:
            "flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:text-purple-600 transition-colors rounded-md hover:bg-gray-50",
          dropdown:
            "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200",
          option:
            "flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 cursor-pointer transition-colors",
          selected: "bg-purple-50 text-purple-700",
        };
    }
  };

  const styles = getVariantStyles();

  // Klick ausserhalb: nur Dropdown-Varianten (nicht Overlay)
  useEffect(() => {
    if (!isOpen) return;
    if (showOverlay) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, showOverlay]);

  // ESC zum Schliessen (Overlay und Dropdown)
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Scroll sperren bei Overlay
  useEffect(() => {
    if (!isOpen) return;
    if (!showOverlay) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, showOverlay]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Button */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className={styles.button}
        aria-label="Sprache auswählen"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={16} strokeWidth={1.5} />
        <span className="whitespace-nowrap">{currentLang.name}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Fullscreen Overlay (Header + Mobile) */}
      {isOpen && showOverlay && (
        <div className="fixed inset-0 z-[99999]">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 h-full w-full bg-black/30"
            onClick={() => setIsOpen(false)}
            aria-label="Sprache schliessen"
          />

          {/* Panel */}
          <div className="absolute inset-0">
            {/* Base */}
            <div className="absolute inset-0 bg-white" />

            {/* Aurora blobs */}
            <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-purple-300/35 blur-3xl" />
            <div className="pointer-events-none absolute top-16 -right-28 h-96 w-96 rounded-full bg-teal-300/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-indigo-300/20 blur-3xl" />

            <div className="relative mx-auto flex h-full max-w-3xl flex-col px-6 py-6 text-gray-900">
              {/* Top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe size={18} />
                  <span className="font-normal">{currentLang.name}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                  
                </button>
              </div>

              {/* Title */}
              <h2 className="mt-12 text-4xl font-semibold tracking-tight text-gray-900">
                {t("language.selectTitle")}
              </h2>

              {/* Options */}
                <div className="mt-10 flex flex-col gap-6">
                  {languages.map((language) => {
                    const active = currentLanguage === language.code;

                    return (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => handleLanguageSelect(language.code)}
                        className="group w-full text-left text-xl font-normal"
                      >
                        <span
                          className={active ? "text-gray-900" : "text-gray-700"}
                        >
                          {language.name}
                        </span>

                        <div
                          className={`mt-1 h-px w-full transition-opacity
                            ${active ? "bg-gray-700 opacity-100" : "bg-gray-700 opacity-0 group-hover:opacity-100"}
                          `}
                        />
                      </button>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Kleines Dropdown (Footer + Dashboard) */}
      {isOpen && !showOverlay && (
        <div className={styles.dropdown}>
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageSelect(language.code)}
                className={`${styles.option} ${
                  currentLanguage === language.code ? styles.selected : ""
                } w-full text-left`}
              >
                <span className="font-medium">{language.name}</span>
                {currentLanguage === language.code && (
                  <span className="ml-auto" aria-hidden="true">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
