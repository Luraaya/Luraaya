import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

interface UserDropdownProps {
  variant?: "header" | "mobile";
}

const UserDropdown: React.FC<UserDropdownProps> = ({ variant = "header" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">AM</span>
        </div>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            variant === "mobile" ? "left-0" : "right-0"
          } mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200`}
        >
          <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
            <div className="font-medium">{user.email}</div>
          </div>

          <Link
            to="/dashboard/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="mr-3 h-4 w-4" />
            Profile
          </Link>

          <Link
            to="/dashboard/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="mr-3 h-4 w-4" />
            Settings
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
