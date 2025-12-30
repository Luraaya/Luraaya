import React, { useEffect, useRef, useState } from "react";
import Container from "../common/Container";
import { useLanguage } from "../../contexts/LanguageContext";

type CardKey =
  | "birthChart"
  | "zodiacSigns"
  | "planets"
  | "houses"
  | "aspects"
  | "transits"
  | "moonCycles"
  | "forecastMethods";

const CARD_KEYS: CardKey[] = [
  "birthChart",
  "zodiacSigns",
  "planets",
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

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!activeKey) return;
    const el = refs.current[activeKey];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeKey]);

  return (
    <section className="bg-teal-50 py-12 md:py-20">
      <Container>
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 whitespace-pre-line">
            {t("astroInfo.title")}
          </h2>

          <p className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("astroInfo.description")}

          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CARD_KEYS.map(key => {
            const isActive = activeKey === key;
            const isDimmed = activeKey !== null && !isActive;

            return (
              <div
                key={key}
                ref={el => (refs.current[key] = el)}
                className={[
                  "relative rounded-2xl border bg-white transition flex flex-col",
                  isActive
                    ? "col-span-1 md:col-span-2 shadow-lg p-6 border-teal-200"
                    : "p-5 border-gray-200 hover:shadow-md",
                  isDimmed ? "opacity-75" : "opacity-100"
                ].join(" ")}
              >
                {/* Klickbereich zum Öffnen/Schliessen */}
                <button
                  type="button"
                  onClick={() => setActiveKey(isActive ? null : key)}
                  className="text-left w-full"
                >
                  <h3
                    className={[
                      "text-gray-900 font-semibold leading-snug",
                      isActive ? "text-lg" : "text-base"
                    ].join(" ")}
                  >
                    {t(`astroInfo.cards.${key}.title`)}
                  </h3>

                  <p className="mt-1 text-sm text-gray-700 font-medium">
                    {t(`astroInfo.cards.${key}.title2`)}
                  </p>

                  {isActive ? (
                    <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">
                      {t(`astroInfo.cards.${key}.content`)}
                    </p>
                  ) : isLaptop ? (
                    <p
                      className="mt-3 text-sm text-gray-600"
                      style={clamp3Style}
                    >
                      {t(`astroInfo.cards.${key}.content`)}
                    </p>
                  ) : null}
                </button>

                {!isActive && (
                  <div className="mt-auto w-full flex justify-end pt-3">
                    <span className="text-sm font-medium text-teal-600 underline underline-offset-2">
                      {t("common.extend")}
                    </span>
                  </div>
                )}

                {isActive && (
                  <div className="mt-4 w-full">
                    <div className="h-px w-full bg-gray-100 my-4" />

                    <div className="grid grid-cols-2 gap-3 w-full">
                      <button
                        type="button"
                        className="w-full rounded-2xl bg-gray-50 border py-3 font-semibold text-gray-800"
                        onClick={() => setActiveKey(null)}
                      >
                        {t("common.close") || "Schliessen"}
                      </button>

                      <button
                        type="button"
                        className="w-full rounded-2xl bg-teal-600 text-white py-3 font-semibold hover:bg-teal-700"
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
        {/* Zusatztext unterhalb der Kacheln */}
        <div className="mt-8 text-left">
        <p className="text-sm md:text-base text-black">
            {t("astroInfo.footerText")}
        </p>
        </div>

        {/* Call To Action Button ganz unten */}
        <div className="mt-10 flex justify-center">
        <a href="#signup">
            <button
            type="button"
            className="rounded-2xl bg-teal-600 text-white px-8 py-4 font-semibold hover:bg-teal-700 transition"
            >
            {t("astroInfo.cta")}
            </button>
        </a>
        </div>
      </Container>
    </section>
  );
}
