/**
 * Features section component showcasing the astrology service capabilities
 * Displays key features with icons and descriptions in a responsive grid
 */

import React from 'react';
import Container from '../common/Container';
import { Star, Sun, MessageSquare, Moon, Users, Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();
  
  // Define features with translation keys for better maintainability
  const features = [
    {
      id: '1',
      titleKey: 'features.personalizedChart.title',
      descriptionKey: 'features.personalizedChart.description',
      icon: Star
    },
    {
      id: '2',
      titleKey: 'features.dailyUpdates.title',
      descriptionKey: 'features.dailyUpdates.description',
      icon: Sun
    },
    {
      id: '3',
      titleKey: 'features.multiChannel.title',
      descriptionKey: 'features.multiChannel.description',
      icon: MessageSquare
    },
    {
      id: '4',
      titleKey: 'features.lunarTracking.title',
      descriptionKey: 'features.lunarTracking.description',
      icon: Moon
    },
    {
      id: '5',
      titleKey: 'features.compatibility.title',
      descriptionKey: 'features.compatibility.description',
      icon: Users
    },
    {
      id: '6',
      titleKey: 'features.secure.title',
      descriptionKey: 'features.secure.description',
      icon: Shield
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <Container>
        {/* Section header */}
        <div className="text-center mb-16 whitespace-pre-line">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('features.title')}
          </h2>
          <p className="text-center text-xl text-gray-600 max-w-2xl mx-auto whitespace-pre-line">
            {t('features.description')}
          </p>
        <div className="max-w-xl mx-auto mt-3">
          <p className="text-left text-xl text-gray-600 whitespace-pre-line inline-block max-w-2xl">
            {t('features.description2')}
          </p>
        </div>
          <p className="text-center text-xl text-gray-600 max-w-2xl mx-auto whitespace-pre-line mt-3">
            {t('features.description3')}
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            
            return (
              <div 
                key={feature.id} 
                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent className="text-purple-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(feature.titleKey)}</h3>
                <p className="text-gray-600">{t(feature.descriptionKey)}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Features;