/**
 * Features section component showcasing the astrology service capabilities
 * Displays key features with descriptions in a responsive layout
 */

import React from 'react';
import Container from '../common/Container';
import { useLanguage } from '../../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      id: '1',
      titleKey: 'features.personalizedChart.title',
      descriptionKey: 'features.personalizedChart.description'
    },
    {
      id: '2',
      titleKey: 'features.dailyUpdates.title',
      descriptionKey: 'features.dailyUpdates.description'
    },
    {
      id: '3',
      titleKey: 'features.multiChannel.title',
      descriptionKey: 'features.multiChannel.description'
    }
  ];

  return (
    <section
      id="features"
      className="py-20 bg-white"
      style={{ backgroundColor: "#f8fdff" }}
    >
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 whitespace-pre-line">
            {t("features.title")}
          </h2>

          <p className="text-center text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("features.description")}
            <br />
            {t("features.description2")}
          </p>

          {t("features.description3").trim() !== "" && (
            <p className="text-center text-xl text-gray-600 max-w-2xl mx-auto whitespace-pre-line m-0 mt-2">
              {t("features.description3")}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
          {/* Bild bleibt unverändert */}
          <div className="flex items-center justify-center h-[360px] sm:h-[420px] md:h-[480px] lg:h-[560px] max-h-[70vh]">
            <img
              src="/Bild2.jpg"
              alt="Luraaya Features"
              className="block max-w-full max-h-full object-contain rounded-3xl"
            />
          </div>

          {/* Feature-Boxen */}
          <div className="flex flex-col gap-6 lg:flex-1">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="rounded-2xl border border-gray-200 p-7 lg:p-7 transition-all duration-300"
                style={{ backgroundColor: "#f8fdff" }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Features;
