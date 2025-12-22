/**
 * Hero section component for the astrology messaging service
 * Features compelling headline, description, and call-to-action buttons
 */

import React from "react";
import Container from "../common/Container";
import Button from "../common/Button";
import { ArrowRight, Star, Moon } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { AuroraBackground } from "../ui/aurora-background";


const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
  <AuroraBackground className="w-full lg:justify-start lg:py-32">
    <section className="relative pt-32 pb-20 lg:pt-28 lg:pb-40 overflow-hidden">

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Content */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left">


            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t("hero.title")}{" "}
              <span className="bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                {t("hero.titleHighlight")}
              </span>
            </h1>

            <p className="text-lg text-gray-800 mb-8 max-w-lg mx-auto lg:mx-0">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#signup">
                <Button size="lg">
                  {t("hero.cta")} 
                </Button>
              </a>
              <a href="#features">
                <Button variant="outline" size="lg">
                  {t("hero.learnMore")}
                </Button>
              </a>
            </div>

            {/* Trust indicators
            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Star size={16} className="text-yellow-400 mr-1" />
                <span>{t("hero.rating")}</span>
              </div>
              <div>{t("hero.users")}</div>
              <div>{t("hero.insights")}</div>
            </div>
            */}
          </div>


          {/* Right side - Sample message card */}
          <div className="w-full lg:w-1/2 relative mt-20 lg:mt-0">
            <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md mx-auto transition-transform duration-300 hover:scale-105">
              {/* New message indicator */}
              <div
                className="
                    absolute
                    -top-3
                    left-1/2
                    -translate-x-1/2
                    bg-teal-500
                    text-white
                    text-xs
                    font-medium
                    px-3
                    py-1
                    rounded-full
                    z-20
                    shadow-sm
                  "
                >
                {t("hero.newReading")}
              </div>

              {/* Message header */}
              <div className="flex items-start mb-4">


                <div>
                  <h3 className="font-semibold text-gray-800">
                    {t("hero.sampleMessage.title")}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {t("hero.personalizedFor")}
                  </p>
                </div>
              </div>

              {/* Message content */}
              <p className="text-gray-700 mb-4 leading-relaxed">
                {t("hero.sampleMessage.content")}
              </p>

              {/* Message footer */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500 flex items-center">
                  <Star size={14} className="mr-1 text-yellow-400" />
                  {t("hero.sampleMessage.footer")}
                </span>
                {/*
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-gray-700 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-700 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <polyline points="9 21 3 21 3 15"></polyline>
                      <line x1="21" y1="3" x2="14" y2="10"></line>
                      <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                  </button>
                </div>
                */}
              </div>
            </div>

            {/* Floating zodiac symbols 
            <div className="absolute top-4 left-4 text-purple-300 text-2xl animate-pulse">
              ♈
            </div>
            <div className="absolute bottom-8 right-8 text-teal-300 text-xl animate-pulse delay-1000">
              ♓
            </div>
            <div className="absolute top-1/2 left-0 text-indigo-300 text-lg animate-pulse delay-500">
              ♌
            </div>
            */}
          </div>
        </div>
      </Container>
    </section>
  </AuroraBackground>
  );
};

export default Hero;
