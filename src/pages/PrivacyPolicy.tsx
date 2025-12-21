import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import Container from "../components/common/Container";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Layout>
      <section className="py-16">
        <Container className="max-w-3xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Zurück
            </button>

            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Startseite
            </Link>
          </div>

          <h1 className="text-3xl font-semibold mb-6">Datenschutzerklärung</h1>

          <div className="space-y-4 text-sm leading-6 text-gray-700">
            <p>Hier kommt deine vollständige Datenschutzerklärung rein.</p>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
