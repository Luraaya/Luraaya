import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Container from "../components/common/Container";
import { useLanguage } from "../contexts/LanguageContext";

export default function TermsOfService() {
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
              {t("terms.navigation.back")}
            </button>

            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              {t("terms.navigation.home")}
            </Link>
          </div>

          <h1 className="mb-6 text-3xl font-semibold">{t("terms.title")}</h1>

          <div className="space-y-6 text-sm leading-6 text-gray-700">
            {/* 1 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section1.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section1.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section1.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section1.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section1.2.body")}</p>
              </div>
            </div>

            {/* 2 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section2.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section2.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section2.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section2.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section2.2.body")}</p>
              </div>
            </div>

            {/* 3 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section3.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section3.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section3.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section3.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section3.2.body")}</p>
              </div>
            </div>

            {/* 4 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section4.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section4.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section4.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section4.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section4.2.body")}</p>
              </div>
            </div>

            {/* 5 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section5.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section5.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section5.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section5.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section5.2.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section5.3.title")}
                </h3>
                <p className="mt-0">{t("terms.section5.3.body")}</p>
              </div>
            </div>

            {/* 6 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section6.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section6.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section6.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section6.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section6.2.body")}</p>
              </div>
            </div>

            {/* 7 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section7.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section7.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section7.1.body")}</p>
              </div>


                          <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section7.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section7.2.body")}</p>
              </div>
            </div>

            {/* 8 */}
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section8.title")}
              </h2>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section8.1.title")}
                </h3>
                <p className="mt-0">{t("terms.section8.1.body")}</p>
              </div>

              <div className="space-y-0">
                <h3 className="text-sm font-semibold text-gray-900">
                  {t("terms.section8.2.title")}
                </h3>
                <p className="mt-0">{t("terms.section8.2.body")}</p>
              </div>
            </div>

            {/* 9 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section9.title")}
              </h2>
              <p className="mt-0">{t("terms.section9.body")}</p>
            </div>

            {/* 10 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section10.title")}
              </h2>
              <p className="mt-0">{t("terms.section10.body")}</p>
            </div>

            {/* 11 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section11.title")}
              </h2>
              <p className="mt-0">{t("terms.section11.body")}</p>
            </div>

            {/* 12 */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("terms.section12.title")}
              </h2>
              <p className="mt-0">{t("terms.section12.body")}</p>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
