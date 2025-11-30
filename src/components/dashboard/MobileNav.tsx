/**
 * Mobile navigation component for dashboard
 * Provides collapsible navigation menu for mobile devices
 * Fully internationalized with translation support
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Star, User, Settings, LogOut } from "lucide-react";
import LanguageSelector from "../common/LanguageSelector";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  // Check if current path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Navigation items with translation keys
  const navItems = [
    {
      path: "/dashboard/horoscopes",
      icon: Star,
      labelKey: "dashboard.myHoroscopes",
    },
    { path: "/dashboard/profile", icon: User, labelKey: "dashboard.profile" },
    {
      path: "/dashboard/settings",
      icon: Settings,
      labelKey: "dashboard.settings",
    },
  ];

  return (
    <div className="md:hidden">
      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AM</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            Luraaya
          </span>
        </Link>

        {/* Menu toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={
            isOpen ? t("dashboard.closeMenu") : t("dashboard.openMenu")
          }
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out transform pt-4 ${
            isOpen
              ? "translate-x-0"
              : "translate-x-full pointer-events-none opacity-0"
          }`}
          aria-hidden={!isOpen}
        >
          {/* Close button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={t("dashboard.closeMenu")}
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu content */}
          <div className="flex flex-col h-full">
            <Link to="/" className="flex items-center space-x-2 ml-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AM</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
                Luraaya
              </span>
            </Link>
            <div className="flex-1 overflow-y-auto">
              {/* Dashboard section header */}
              <div className="p-4 mb-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t("nav.dashboard")}
                </p>
              </div>

              {/* Main navigation items */}
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm transition-colors ${
                        isActive(item.path)
                          ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {t(item.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Account section header */}
              <div className="p-4 mt-6 mb-2">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t("dashboard.account")}
                </p>
              </div>

              {/* Account items */}
              <ul>
                <li>
                  <div className="px-4 py-3">
                    <LanguageSelector variant="dashboard" />
                  </div>
                </li>
                <li>
                  <Link
                    to="/"
                    className="flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    {t("dashboard.logout")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* User profile section at bottom */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AM</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.user_metadata.fullname}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
