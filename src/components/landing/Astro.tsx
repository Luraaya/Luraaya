import React, { useEffect, useRef, useState } from "react";
import Container from "../common/Container";
import { useLanguage } from "../../contexts/LanguageContext";

type CardKey =
  | "birthChart"
  | "planets"
  | "zodiacSigns"
  | "houses"
  | "aspects"
  | "transits"
  | "moonCycles"
  | "forecastMethods";

const CARD_KEYS: CardKey[] = [
  "birthChart",
  "planets",
  "zodiacSigns",
  "houses",
  "aspects",
  "transits",
  "moonCycles",
  "forecastMethods"
];

const clamp3Style: React.CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3 as any,
  overflow: "hidden"
};

function useIsLaptop(minWidthPx = 1024) {
  const [isLaptop, setIsLaptop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(min-width: ${minWidthPx}px)`);
    const apply = () => setIsLaptop(mq.matches);

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [minWidthPx]);

  return isLaptop;
}

export default function Astro() {
  const { t } = useLanguage();
  const [activeKey, setActiveKey] = useState<CardKey | null>(null);
  const isLaptop = useIsLaptop(1024);

  useEffect(() => {
    setActiveKey(isLaptop ? CARD_KEYS[0] : null);
  }, [isLaptop]);

  const refs = useRef<Record<string, HTMLDivElement | null>>({});


  return (
    <section className="bg-teal-50 py-8 md:py-20">
      <Container>
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 whitespace-pre-line">
            {t("astroInfo.title")}
          </h2>

          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("astroInfo.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
          {CARD_KEYS.map(key => {
            const isActive = activeKey === key;
            const isDimmed = activeKey !== null && !isActive;

            return (
              <div
                key={key}
                ref={el => (refs.current[key] = el)}
                className={[
                  "relative rounded-xl md:rounded-2xl border bg-white transition-all duration-800 ease-in-out flex flex-col",
                  isActive
                    ? "col-span-1 md:col-span-2 shadow-lg p-4 md:p-6 border-teal-200"
                    : "p-3 md:p-5 border-gray-200 hover:shadow-md",
                  isDimmed ? "opacity-75" : "opacity-100"
                ].join(" ")}
              >
                <button
                  type="button"
                  onClick={() => setActiveKey(isActive ? null : key)}
                  className="text-left w-full"
                >
                  <h3
                    className={[
                      "text-gray-900 font-semibold leading-snug",
                      isActive
                        ? "text-base md:text-lg"
                        : "text-sm md:text-base"
                    ].join(" ")}
                  >
                    {t(`astroInfo.cards.${key}.title`)}
                  </h3>

                  <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-700 font-medium">
                    {t(`astroInfo.cards.${key}.title2`)}
                  </p>

                  {isActive ? (
                    <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">
                      {t(`astroInfo.cards.${key}.content`)}
                    </p>
                  ) : isLaptop ? (
                    <p
                      className="mt-2 text-sm text-gray-600"
                      style={clamp3Style}
                    >
                      {t(`astroInfo.cards.${key}.content`)}
                    </p>
                  ) : null}
                </button>

                {!isActive && (
                  <div className="mt-auto w-full flex justify-end pt-1 md:pt-3">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setActiveKey(key);
                      }}
                      className="text-xs md:text-sm font-medium text-teal-600 underline underline-offset-2"
                    >
                      {t("common.extend")}
                    </button>
                  </div>
                )}

                {isActive && (
                  <div className="mt-4 w-full">
                    <div className="h-px w-full bg-gray-100 my-4" />

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        type="button"
                        className="w-full rounded-xl md:rounded-2xl bg-gray-50 border py-2.5 md:py-3 font-semibold text-gray-800"
                        onClick={() => setActiveKey(null)}
                      >
                        {t("common.close") || "Schliessen"}
                      </button>

                      <button
                        type="button"
                        className="w-full rounded-xl md:rounded-2xl bg-teal-600 text-white py-2.5 md:py-3 font-semibold hover:bg-teal-700"
                        onClick={() => {
                          const idx = CARD_KEYS.indexOf(key);
                          setActiveKey(
                            CARD_KEYS[(idx + 1) % CARD_KEYS.length]
                          );
                        }}
                      >
                        {t("common.next") || "Weiter"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:mt-10 flex justify-center">
          <a href="#signup">
            <button
              type="button"
              className="rounded-2xl bg-teal-600 text-white px-7 md:px-8 py-3 md:py-4 font-semibold hover:bg-teal-700 transition"
            >
              {t("hero.cta")}
            </button>
          </a>
        </div>
      </Container>
    </section>
  );
}
