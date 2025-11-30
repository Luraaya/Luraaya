/**
 * Dashboard sidebar component for desktop navigation
 * Provides navigation links and user profile display
 * Fully internationalized with translation support
 */

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Star, User, Settings, LogOut } from "lucide-react";
import LanguageSelector from "../common/LanguageSelector";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const { user } = useAuth();

  // Check if current path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
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
    <aside className="bg-white w-64 border-r border-gray-200 h-screen flex-shrink-0 hidden md:block">
      {/* Logo section */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AM</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            Luraaya
          </span>
        </Link>
      </div>

      {/* Navigation section */}
      <nav className="py-6">
        <div className="px-6 mb-4">
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
                className={`flex items-center px-6 py-3 text-sm transition-colors ${
                  isActive(item.path)
                    ? "bg-purple-50 text-purple-700 border-r-4 border-purple-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {t(item.labelKey)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Account section */}
        <div className="px-6 mt-8 mb-4">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {t("dashboard.account")}
          </p>
        </div>

        {/* Account items */}
        <ul>
          <li>
            <div className="px-6 py-3">
              <LanguageSelector variant="dashboard" />
            </div>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="flex items-center px-6 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              {t("dashboard.logout")}
            </button>
          </li>
        </ul>
      </nav>

      {/* User profile section at bottom */}
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
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
    </aside>
  );
};

export default Sidebar;
