import React from "react";
import Container from "../common/Container";
import { useLanguage } from "../../contexts/LanguageContext";

const PricingInfo: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          {/* Subtile Linie als visuelle Klammer */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-px bg-gray-400 " />
          </div>

          {/* Überschrift */}
          <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {t("pricing.title")}
          </h2>

          {/* Erklärungssatz */}
          <p className="text-l text-gray-600 leading-relaxed max-w-2xl mx-auto mb-16">
            {t("pricing.subtitle")}
          </p>

          {/* Preiszeile */}
          <p className="text-xl md:text-2xl font-medium mt-6 mb-2">
            {t("pricing.priceLine")}
          </p>

          {/* Sinnzeile direkt unter dem Preis */}
          <p className="text-sm text-gray-700 mb-14">
            {t("pricing.description")}
          </p>

          {/* Stichpunkte */}
          <ul className="list-none m-0 p-0 text-gray-700 mb-12 leading-snug">
            <li>{t("pricing.bullets.customizable")}</li>
            <li>{t("pricing.bullets.swissProvider")}</li>
            <li>{t("pricing.bullets.cancelAnytime")}</li>
          </ul>

          {/* CTA */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("signup");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            }}
            className="text-gray-900 underline underline-offset-4 text-sm font-medium hover:decoration-2"
          >
            {t("pricing.cta")}
          </button>
        </div>
      </Container>
    </section>
  );
};

export default PricingInfo;
