import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Container from "../components/common/Container";
import { useLanguage } from "../contexts/LanguageContext";

export default function Cookies() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const openCookieSettings = () => {
    window.dispatchEvent(new Event("open-cookie-settings"));
  };

  return (
    <Layout>
      <section className="relative py-16 bg-white min-h-screen z-10">
        <Container className="max-w-3xl">
          {/* Navigation */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("cookies.navigation.back")}
            </button>

            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              {t("cookies.navigation.home")}
            </Link>
          </div>

          {/* Titel */}
          <h1 className="mb-6 text-3xl font-semibold">
            {t("cookies.title")}
          </h1>

          <div className="space-y-8 text-sm leading-6 text-gray-700">
            {/* Intro */}
            <p>{t("cookies.intro")}</p>

            {/* Section 1 */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section1.title")}
              </h2>
              <p>{t("cookies.section1.body")}</p>
            </section>

            {/* Section 2 */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section2.title")}
              </h2>
              <p>{t("cookies.section2.body")}</p>
            </section>

            {/* Section 2.1 */}
            <section className="space-y-2 pl-4 border-l border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {t("cookies.section2.1.title")}
              </h3>
              <p>{t("cookies.section2.1.body")}</p>
            </section>

            {/* Section 2.2 */}
            <section className="space-y-2 pl-4 border-l border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {t("cookies.section2.2.title")}
              </h3>
              <p>{t("cookies.section2.2.body")}</p>
            </section>

            {/* Section 2.3 */}
            <section className="space-y-2 pl-4 border-l border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {t("cookies.section2.3.title")}
              </h3>
              <p>{t("cookies.section2.3.body")}</p>
            </section>

            {/* Section 2.4 */}
            <section className="space-y-2 pl-4 border-l border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {t("cookies.section2.4.title")}
              </h3>
              <p>{t("cookies.section2.4.body")}</p>
            </section>

            {/* Section 3 */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section3.title")}
              </h2>
              <p>{t("cookies.section3.body")}</p>
            </section>

            {/* Section 4 */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section4.title")}
              </h2>
              <p>{t("cookies.section4.body")}</p>
            </section>

            {/* Section 5 */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section5.title")}
              </h2>
              <p>{t("cookies.section5.body")}</p>
            </section>

            {/* Section 6 */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section6.title")}
              </h2>
              <p>{t("cookies.section6.body")}</p>
            </section>

            {/* Section 7 */}
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section7.title")}
              </h2>
              <p>{t("cookies.section7.body")}</p>
            </section>

            {/* Button: Cookie Einstellungen */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={openCookieSettings}
                className="inline-flex items-center justify-center rounded-md border border-teal-600 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 transition"
              >
                Cookie-Einstellungen verwalten
              </button>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
