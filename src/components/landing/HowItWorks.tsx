/**
 * How It Works section component
 * Displays the three-step process of how Luraaya works
 */

import React from 'react';
import Container from '../common/Container';
import { useLanguage } from '../../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-gray-50">
      <Container>
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.howItWorks')}
          </h2>
        </div>

        {/* Layout: links Container (Placeholder), rechts drei Text-Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          {/* Links: Bild/Container (kommt später) */}
          <div className="rounded-3xl overflow-hidden bg-white border border-gray-200 min-h-[320px] md:min-h-[420px]">
            <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100" />
          </div>

          {/* Rechts: drei Container */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <span className="font-bold text-purple-700">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {t('features.step1.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('features.step1.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <span className="font-bold text-teal-700">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {t('features.step2.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('features.step2.description')}
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <span className="font-bold text-amber-700">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    {t('features.step3.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('features.step3.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;
