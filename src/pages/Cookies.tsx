import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Container from "../components/common/Container";
import { useLanguage } from "../contexts/LanguageContext";

export default function Cookies() {
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
              {t("cookies.navigation.back")}
            </button>

            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              {t("cookies.navigation.home")}
            </Link>
          </div>

          <h1 className="mb-6 text-3xl font-semibold">
            {t("cookies.title")}
          </h1>

          <div className="space-y-6 text-sm leading-6 text-gray-700">
            <p>{t("cookies.intro")}</p>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section1.title")}
              </h2>
              <p>{t("cookies.section1.body")}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section2.title")}
              </h2>
              <p>{t("cookies.section2.body")}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-semibold text-gray-900">
                {t("cookies.section3.title")}
              </h2>
              <p>{t("cookies.section3.body")}</p>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
