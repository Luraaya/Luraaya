import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { Mail, Instagram, Send } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "../../contexts/LanguageContext";


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus("sending");
    
    try {
      // Simulate sending contact form
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this to your backend
      console.log("Contact form submitted:", contactForm);
      
      setContactStatus("success");
      setContactForm({ name: "", email: "", message: "" });
      
      // Reset status after 3 seconds
      setTimeout(() => setContactStatus("idle"), 3000);
    } catch (error) {
      setContactStatus("error");
      setTimeout(() => setContactStatus("idle"), 3000);
    }
  };

  return (
    <footer
  id="footer"
  className="bg-gray-900 text-white pt-16 pb-8 px-4"
  style={{
    paddingLeft: "max(1rem, env(safe-area-inset-left))",
    paddingRight: "max(1rem, env(safe-area-inset-right))",
  }}
>
<Container>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl font-bold text-white">Luraaya</span>
          </div>

            <p className="text-gray-400 mb-4">{t("footer.content")}</p>
            <div className="flex space-x-4">

              <a
                href="mailto:luraaya@outlook.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail size={20} />
              </a>
              <a
                href="https://www.instagram.com/luraaya.official/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.howItWorks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.howItWorks")}
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.pricing")}
                </a>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.dashboard")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.resources")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.astrologyGuide")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.birthChartBasics")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("footer.helpCenter")}
                </a>
              </li>
            </ul>
          </div>

        <div className="md:col-span-2 md:col-start-4">
          <h3 className="text-lg font-semibold mb-4">
            {t("footer.contactForm.title")}
          </h3>
          <form onSubmit={handleContactSubmit} className="space-y-3 w-full">
            <div>
              <input
                type="text"
                placeholder={t("footer.contactForm.namePlaceholder")}
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder={t("footer.contactForm.emailPlaceholder")}
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <textarea
                placeholder={t("footer.contactForm.messagePlaceholder")}
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                required
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={contactStatus === "sending"}
              className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-md transition-colors"
            >
              {contactStatus === "sending" ? (
                t("footer.contactForm.sending")
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  {t("footer.contactForm.sendButton")}
                </>
              )}
            </button>

            {contactStatus === "success" && (
              <p className="text-green-400 text-sm">
                {t("footer.contactForm.successMessage")}
              </p>
            )}

            {contactStatus === "error" && (
              <p className="text-red-400 text-sm">
                {t("footer.contactForm.errorMessage")}
              </p>
            )}
          </form>
        </div>

        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Luraaya. All rights reserved.
            </p>
              <div className="flex items-center space-x-6">
                <LanguageSelector variant="footer" />

<Link
  to="/datenschutz"
  className="text-gray-500 hover:text-white text-sm transition-colors"
>
  {t("footer.legal.privacyPolicy")}
</Link>


                <a
                  href="#"
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  {t("footer.legal.termsOfService")}
                </a>

                <a
                  href="#"
                  className="text-gray-500 hover:text-white text-sm transition-colors"
                >
                  {t("footer.legal.cookies")}
                </a>
              </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
