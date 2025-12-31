/**
 * Features section component showcasing the astrology service capabilities
 * Displays key features with descriptions in a professional vertical step layout
 */

import React from "react";
import Container from "../common/Container";
import { useLanguage } from "../../contexts/LanguageContext";

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      id: 1,
      titleKey: "features.personalizedChart.title",
      descriptionKey: "features.personalizedChart.description"
    },
    {
      id: 2,
      titleKey: "features.dailyUpdates.title",
      descriptionKey: "features.dailyUpdates.description"
    },
    {
      id: 3,
      titleKey: "features.multiChannel.title",
      descriptionKey: "features.multiChannel.description"
    }
  ];

  return (
    <section
      id="features"
      className="py-20"
      style={{ backgroundColor: "#f8fdff" }}
    >
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 whitespace-pre-line">
            {t("features.title")}
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("features.description")}
            <br />
            {t("features.description2")}
          </p>

          {t("features.description3").trim() !== "" && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-2 whitespace-pre-line">
              {t("features.description3")}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
          {/* Bild */}
          <div className="flex items-center justify-center h-[360px] sm:h-[420px] md:h-[480px] lg:h-[560px] max-h-[70vh]">
            <img
              src="/Bild2.jpg"
              alt="Luraaya Features"
              className="block max-w-full max-h-full object-contain rounded-3xl"
            />
          </div>

          {/* Timeline + Boxen */}
          <div className="relative lg:flex-1">
            {/* Vertikale Linie */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gray-300" />

            <div className="flex flex-col gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="grid grid-cols-[40px_1fr] items-center gap-2"
                >
                  {/* Kreis */}
                  <div className="flex justify-center">
                    <div className="h-10 w-10 rounded-full border border-gray-300 bg-slate-700 border-slate-700 text-white flex items-center justify-center z-10">
                      <span className="text-sm font-semibold text-white">
                        {feature.id}
                      </span>
                    </div>
                  </div>

                  {/* Box */}
                  <div
                    className="rounded-2xl border border-gray-200 p-7 bg-white"
                    style={{ backgroundColor: "#f8fdff" }}
                  >
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">
                      {t(feature.titleKey)}
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                      {t(feature.descriptionKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;
