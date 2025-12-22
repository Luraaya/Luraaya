import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Container from "../components/common/Container";
import { useLanguage } from "../contexts/LanguageContext";

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Layout>
      <section className="relative py-16 bg-white min-h-screen z-10">
        <Container className="max-w-3xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {t("privacy.navigation.back")}
            </button>

            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              {t("privacy.navigation.home")}
            </Link>
          </div>

          <h1 className="mb-6 text-3xl font-semibold">{t("privacy.title")}</h1>

          {/* Wichtig: kein space-y direkt auf h3/p-Ebene verwenden */}
          <div className="space-y-6 text-sm leading-6 text-gray-700">
            {/* 1 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section1.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section1.1.title")}
                </h3>
                <p className="mt-0">{t("privacy.section1.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section1.2.title")}
                </h3>
                <p className="mt-0">{t("privacy.section1.2.body")}</p>
              </div>
            </div>

            {/* 2 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section2.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section2.1.title")}
                </h3>
                <p className="mt-0">{t("privacy.section2.1.body")}</p>
              </div>
            </div>

            {/* 3 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section3.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section3.1.title")}
                </h3>
                <p className="mt-0">{t("privacy.section3.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section3.2.title")}
                </h3>
                <p className="mt-0">{t("privacy.section3.2.body")}</p>
              </div>
            </div>

            {/* 4 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section4.title")}
              </h2>
              <p className="mt-0">{t("privacy.section4.body")}</p>
            </div>

            {/* 5 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section5.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section5.1.title")}
                </h3>
                <p className="mt-0">{t("privacy.section5.1.body")}</p>
              </div>
            </div>

            {/* 6 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section6.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section6.1.title")}
                </h3>
                <p className="mt-0">{t("privacy.section6.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section6.2.title")}
                </h3>
                <p className="mt-0">{t("privacy.section6.2.body")}</p>
              </div>
            </div>

            {/* 7 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section7.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section7.1.title")}
                </h3>
                <p className="mt-0">{t("privacy.section7.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("privacy.section7.2.title")}
                </h3>
                <p className="mt-0">{t("privacy.section7.2.body")}</p>
              </div>
            </div>

            {/* 8 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section8.title")}
              </h2>
              <p className="mt-0">{t("privacy.section8.body")}</p>
            </div>

            {/* 9 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section9.title")}
              </h2>
              <p className="mt-0">{t("privacy.section9.body")}</p>
            </div>

            {/* 10 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section10.title")}
              </h2>
              <p className="mt-0">{t("privacy.section10.body")}</p>
            </div>

            {/* 11 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section11.title")}
              </h2>
              <p className="mt-0">{t("privacy.section11.body")}</p>
            </div>

            {/* 12 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section12.title")}
              </h2>
              <p className="mt-0">{t("privacy.section12.body")}</p>
            </div>

            {/* 13 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("privacy.section13.title")}
              </h2>
              <p className="mt-0">{t("privacy.section13.body")}</p>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
