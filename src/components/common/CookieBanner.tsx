import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookieConsent } from "../../contexts/CookieConsentContext";
import { useLanguage } from "../../contexts/LanguageContext";

type Draft = {
  functional: boolean;
  performance: boolean;
  targeting: boolean;
};

const CookieBanner: React.FC = () => {
  const { t } = useLanguage();
  const { hasChoice, setAll, setConsent } = useCookieConsent();

  const [mounted, setMounted] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [draft, setDraft] = useState<Draft>({
    functional: false,
    performance: false,
    targeting: false
  });

  useEffect(() => setMounted(true), []);
  useEffect(() => {
  if (!openSettings) return;

  const prevOverflow = document.body.style.overflow;
  const prevPosition = document.body.style.position;
  const prevWidth = document.body.style.width;

  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";

  return () => {
    document.body.style.overflow = prevOverflow;
    document.body.style.position = prevPosition;
    document.body.style.width = prevWidth;
  };
}, [openSettings]);
  if (!mounted) return null;

  const showBanner = !hasChoice;

  const saveDraft = () => {
    setConsent({
      functional: draft.functional,
      performance: draft.performance,
      targeting: draft.targeting
    });
    setOpenSettings(false);
  };

  return (
    <>
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
          <div className="mx-auto max-w-6xl px-4 py-4 md:py-6 md:px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm md:text-base text-gray-700 max-w-3xl">
              <div className="font-semibold text-gray-900 mb-1">
                {t("cookies.banner.title")}
              </div>
              <p className="leading-relaxed">
                {t("cookies.banner.text")}{" "}
                <Link to="/datenschutz" className="underline text-gray-900">
                  {t("cookies.banner.privacyLink")}
                </Link>{" "}
                {t("cookies.banner.and")}{" "}
                <Link to="/cookies" className="underline text-gray-900">
                  {t("cookies.banner.cookieLink")}
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setOpenSettings(true)}
                className="w-full sm:w-auto px-4 py-2.5 border border-teal-600 text-black rounded-md bg-white hover:bg-teal-50 transition"
              >
                {t("cookies.banner.settings")}
              </button>

              <button
                type="button"
                onClick={() => setAll(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition"
              >
                {t("cookies.banner.rejectAll")}
              </button>

              <button
                type="button"
                onClick={() => setAll(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition"
              >
                {t("cookies.banner.acceptAll")}
              </button>
            </div>
          </div>
        </div>
      )}

      {openSettings && (
        <div className="fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenSettings(false)}
          />

          <div className="absolute left-0 right-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 mx-auto md:max-w-2xl w-full px-0 md:px-4 pb-[env(safe-area-inset-bottom)]">
            <div className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl border border-gray-200 w-full max-h-[85svh] flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {t("cookies.settings.title")}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {t("cookies.settings.subtitle")}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpenSettings(false)}
                  className="text-gray-600 hover:text-gray-900 px-2 py-1"
                  aria-label={t("common.close")}
                >
                  ×
                </button>
              </div>

              <div className="px-5 py-4 space-y-4 overflow-y-auto overscroll-contain">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {t("cookies.categories.necessary.title")}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {t("cookies.categories.necessary.desc")}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 font-medium">
                      {t("cookies.categories.alwaysOn")}
                    </div>
                  </div>
                </div>

                <ToggleRow
                  title={t("cookies.categories.functional.title")}
                  desc={t("cookies.categories.functional.desc")}
                  checked={draft.functional}
                  onChange={(v) => setDraft((d) => ({ ...d, functional: v }))}
                />

                <ToggleRow
                  title={t("cookies.categories.performance.title")}
                  desc={t("cookies.categories.performance.desc")}
                  checked={draft.performance}
                  onChange={(v) => setDraft((d) => ({ ...d, performance: v }))}
                />

                <ToggleRow
                  title={t("cookies.categories.targeting.title")}
                  desc={t("cookies.categories.targeting.desc")}
                  checked={draft.targeting}
                  onChange={(v) => setDraft((d) => ({ ...d, targeting: v }))}
                />
              </div>

              <div className="px-5 py-4 border-t border-gray-200 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                type="button"
                onClick={() => {
                    setAll(false);
                    setOpenSettings(false);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition"
                >
                {t("cookies.settings.rejectAll")}
                </button>

                <button
                type="button"
                onClick={() => {
                    setAll(true);
                    setOpenSettings(false);
                }}
                className="px-4 py-2.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition"
                >
                {t("cookies.settings.acceptAll")}
                </button>

                <button
                  type="button"
                  onClick={saveDraft}
                  className="px-4 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-800 transition"
                >
                  {t("cookies.settings.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
const ToggleRow: React.FC<{
  title: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ title, desc, checked, onChange }) => {
  const id = `cookie-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="p-4 border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={id} className="flex-1 cursor-pointer">
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-sm text-gray-600 mt-1">{desc}</div>
        </label>

        <input
          id={id}
          type="checkbox"
          className="h-5 w-5 shrink-0 rounded border-gray-300 accent-teal-800 focus:ring-teal-300"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
      </div>
    </div>
  );
};


export default CookieBanner;
