import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { formatDate, formatDistanceToNow } from "../utils/dateUtils";
import { Search, Filter, ChevronDown, Star, Moon } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

const DashboardHoroscopes: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRead, setFilterRead] = useState<boolean | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  type HoroscopeMessage = {
    id: string;
    content: string;
    read: boolean;
    sentAt: Date;
    messageType: string;
  };

  const [userMessages, setUserMessages] = useState<HoroscopeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const getUserMessages = async () => {
    const { data, error } = await supabase
      .from("horoscope")
      .select("*")
      .eq("user_id", user?.id);
    if (error) {
      console.error("Error fetching user messages:", error);
      return;
    }
    setUserMessages(
      data.map((msg) => ({
        ...msg,
        sentAt: msg.sentat ? new Date(msg.sentat) : new Date(), // Use lowercase 'sentat' and provide fallback
        messageType: msg.messagetype || 'daily_horoscope' // Use lowercase 'messagetype' and provide fallback
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    getUserMessages();
  }, [user]);

  // Filter messages based on search and read status
  const filteredMessages = userMessages.filter((message) => {
    const matchesSearch = message.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesReadStatus =
      filterRead === null || message.read === filterRead;
    return matchesSearch && matchesReadStatus;
  });

  // Sort messages by date (newest first)
  const sortedMessages = [...filteredMessages].sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  // Get message type display name with translation support
  const getMessageTypeDisplay = (messageType: string) => {
    // Normalize the message type
    const normalizedType = messageType?.toLowerCase() || 'daily_horoscope';
    
    // Map of display names
    const displayNames: Record<string, string> = {
      'daily_horoscope': 'Daily Horoscope',
      'weekly_forecast': 'Weekly Forecast',
      'monthly_reading': 'Monthly Reading',
      'planetary_transit': 'Planetary Transit',
      'personalized_insight': 'Personal Insight'
    };

    return displayNames[normalizedType] || displayNames['daily_horoscope'];
  };

  // Get message type color
  const getMessageTypeColor = (messageType: string) => {
    const colors: Record<string, string> = {
      daily_horoscope: "bg-yellow-100 text-yellow-800",
      weekly_forecast: "bg-purple-100 text-purple-800",
      monthly_reading: "bg-indigo-100 text-indigo-800",
      planetary_transit: "bg-teal-100 text-teal-800",
      personalized_insight: "bg-pink-100 text-pink-800",
    };
    return colors[messageType] || "bg-gray-100 text-gray-800";
  };

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from("horoscope")
      .update({ read: true })
      .eq("id", messageId);
    if (error) {
      console.error("Error marking message as read:", error);
      setLoading(false);
      return;
    }
    getUserMessages();
  };

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="p-6">
          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Star className="mr-2 text-purple-600" size={28} />
                {t("dashboard.myHoroscopes")}
              </h1>
              <p className="text-gray-600">
                {t("dashboard.horoscopesDescription")}
              </p>
            </div>

            {/* Quick stats */}
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userMessages.length}
                </div>
                <div className="text-sm text-gray-500">
                  {t("dashboard.total")}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userMessages.filter((m) => !m.read).length}
                </div>
                <div className="text-sm text-gray-500">
                  {t("dashboard.unread")}
                </div>
              </div>
            </div>
          </div>

          {/* Horoscopes card */}
          <div className="bg-white rounded-lg shadow">
            {/* Search and filter header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                {/* Search input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={t("dashboard.search")}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  >
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span>{t("dashboard.status")}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {showFilterDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            filterRead === null
                              ? "bg-purple-50 text-purple-700"
                              : "text-gray-700"
                          }`}
                          onClick={() => {
                            setFilterRead(null);
                            setShowFilterDropdown(false);
                          }}
                        >
                          {t("dashboard.allHoroscopes")}
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            filterRead === false
                              ? "bg-purple-50 text-purple-700"
                              : "text-gray-700"
                          }`}
                          onClick={() => {
                            setFilterRead(false);
                            setShowFilterDropdown(false);
                          }}
                        >
                          {t("dashboard.unreadOnly")}
                        </button>
                        <button
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                            filterRead === true
                              ? "bg-purple-50 text-purple-700"
                              : "text-gray-700"
                          }`}
                          onClick={() => {
                            setFilterRead(true);
                            setShowFilterDropdown(false);
                          }}
                        >
                          {t("dashboard.readOnly")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Horoscopes list */}
            {sortedMessages.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {sortedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !message.read
                        ? "border-l-4 border-purple-500 bg-purple-50"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getMessageTypeColor(
                            message.messageType
                          )}`}
                        >
                          {getMessageTypeDisplay(message.messageType)}
                        </span>
                        {!message.read && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            {t("dashboard.new")}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDistanceToNow(message.sentAt)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-800 leading-relaxed">
                        {message.content}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        {formatDate(message.sentAt)}
                      </div>

                      {!message.read && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => markAsRead(message.id)}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
                          >
                            {t("dashboard.markAsRead")}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-gray-500">
                <Moon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  {t("dashboard.noHoroscopes")}
                </h3>
                <p>{t("dashboard.noHoroscopesDescription")}</p>
                <p className="text-sm mt-1">{t("dashboard.adjustSearch")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardHoroscopes;
