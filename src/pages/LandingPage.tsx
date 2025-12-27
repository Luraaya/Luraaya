import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import Layout from "../components/common/Layout";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import PricingInfo from "../components/landing/PricingInfo";
import SignupForm from "../components/landing/SignupForm";

const LandingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "canceled" | null
  >(null);

  // 1) Read query params once and set UI state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success") === "true";
    const canceled = params.get("canceled") === "true";

    if (!success && !canceled) return;

    setPaymentStatus(success ? "success" : "canceled");

    // Clear URL query without re-running routing (keeps timers intact)
    window.history.replaceState({}, "", "/");

    if (canceled) {
      window.setTimeout(() => {
        const el = document.getElementById("signup");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  }, [location.search]);

  // 2) Redirect after showing success state
  useEffect(() => {
    if (paymentStatus !== "success") return;

    const timer = window.setTimeout(() => {
      navigate("/dashboard/horoscopes", { replace: true });
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [paymentStatus, navigate]);

  return (
    <Layout>
      <Hero />

      {paymentStatus === "success" && (
        <div className="max-w-3xl mx-auto mt-8 mb-8 rounded-lg bg-green-50 border border-green-200 p-6 text-center">
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            {t("payment.success.title")}
          </h2>
          <p className="text-green-700 mb-4">
            {t("payment.success.body")}
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/horoscopes")}
            className="px-6 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700"
          >
            {t("payment.success.cta")}
          </button>
        </div>
      )}

      {paymentStatus === "canceled" && (
        <div className="max-w-3xl mx-auto mt-8 mb-8 rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">
            {t("payment.canceled.title")}
          </h2>
          <p className="text-yellow-700">
            {t("payment.canceled.body")}
          </p>
        </div>
      )}

      <SignupForm />
      <Features />
      <PricingInfo />
    </Layout>
  );
};

export default LandingPage;
