/**
 * Testimonials section component displaying customer reviews
 * Shows user feedback with zodiac signs and star ratings
 */

import React from 'react';
import Container from '../common/Container';
import { ZodiacSign } from '../../types';
import { getZodiacDisplayName } from '../../utils/astrologyUtils';
import { Star } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  
  // Define testimonials with translation keys for better maintainability
  const testimonials = [
    {
      id: '1',
      name: 'Luna Martinez',
      zodiacSign: ZodiacSign.PISCES,
      contentKey: 'testimonials.luna.content',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
      rating: 5
    },
    {
      id: '2',
      name: 'David Thompson',
      zodiacSign: ZodiacSign.LEO,
      contentKey: 'testimonials.david.content',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
      rating: 5
    },
    {
      id: '3',
      name: 'Aria Patel',
      zodiacSign: ZodiacSign.VIRGO,
      contentKey: 'testimonials.aria.content',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=150',
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-purple-50 to-teal-50">
      <Container>
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('testimonials.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('testimonials.description')}
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-xl shadow-md p-6 transition-transform duration-300 hover:-translate-y-2"
            >
              {/* User info header */}
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {getZodiacDisplayName(testimonial.zodiacSign)}
                  </p>
                </div>
              </div>
              
              {/* Testimonial content */}
              <p className="text-gray-700 italic mb-4">"{t(testimonial.contentKey)}"</p>
              
              {/* Star rating */}
              <div className="flex items-center">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <Star 
                    key={index}
                    size={16}
                    className="text-yellow-400 fill-current"
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  {testimonial.rating}/5
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Additional social proof */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
              <div className="text-gray-600">{t('testimonials.activeUsers')}</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-teal-600 mb-2">4.9/5</div>
              <div className="text-gray-600">{t('testimonials.averageRating')}</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-2">50,000+</div>
              <div className="text-gray-600">{t('testimonials.messagesDelivered')}</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;