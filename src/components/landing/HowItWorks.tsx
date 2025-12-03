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
        
        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('features.step1.title')}</h3>
            <p className="text-gray-600">
              {t('features.step1.description')}
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('features.step2.title')}</h3>
            <p className="text-gray-600">
              {t('features.step2.description')}
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('features.step3.title')}</h3>
            <p className="text-gray-600">
              {t('features.step3.description')}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;