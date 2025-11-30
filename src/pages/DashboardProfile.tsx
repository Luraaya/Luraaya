/**
 * Dashboard profile page component
 * Allows users to update their personal and astrological information
 * Fully internationalized with translation support
 */

import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import { SubscriptionType, CommunicationChannel, Sex } from "../types";
import { getZodiacSign, getZodiacDisplayName } from "../utils/astrologyUtils";
import { User, Calendar, MapPin, Clock, Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

const DashboardProfile: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Mock current user data (in real app, this would come from API/context)
  const [formData, setFormData] = useState({
    name: "Sarah Chen",
    email: "sarah@example.com",
    sex: Sex.FEMALE,
    dateOfBirth: "1990-07-15",
    timeOfBirth: "14:30",
    placeOfBirth: "San Francisco, CA, USA",
    subscriptionType: SubscriptionType.WEEKLY,
    communicationChannel: CommunicationChannel.EMAIL,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [zodiacSign, setZodiacSign] = useState<string>("");
  const { currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (data) {
        setFormData({
          ...formData,
          name: data.fullname || "Sarah Chen",
          email: data.email || "sarah@example.com",
          sex: data.sex || Sex.FEMALE,
          dateOfBirth: data.dateOfBirth || "1990-07-15",
          timeOfBirth: data.timeOfBirth || "14:30",
          placeOfBirth: data.placeOfBirth || "San Francisco, CA, USA",
          subscriptionType: data.subscriptionType || SubscriptionType.WEEKLY,
          communicationChannel:
            data.communicationChannel === CommunicationChannel.WHATSAPP
              ? CommunicationChannel.SMS
              : data.communicationChannel || CommunicationChannel.EMAIL,
        });
        setZodiacSign(data.zodiacSign || "");
      }
      setLoading(false);
    };

    getUser();
  }, []);

  // Calculate zodiac sign on component mount and when date changes
  React.useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const sign = getZodiacSign(birthDate);
      setZodiacSign(getZodiacDisplayName(sign));
    }
  }, [formData.dateOfBirth]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase
      .from("users")
      .update({
        sex: formData.sex,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        placeOfBirth: formData.placeOfBirth,
        communicationChannel: formData.communicationChannel,
        subscriptionType: formData.subscriptionType,
        zodiacSign: zodiacSign,
        language: currentLanguage,
      })
      .eq("id", user?.id);
    setIsEditing(false);
  };

  // Cancel editing
  const handleCancel = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (data) {
      setFormData({
        ...formData,
        name: data.fullname || "Sarah Chen",
        email: data.email || "sarah@example.com",
        sex: data.sex || Sex.FEMALE,
        dateOfBirth: data.dateOfBirth || "1990-07-15",
        timeOfBirth: data.timeOfBirth || "14:30",
        placeOfBirth: data.placeOfBirth || "San Francisco, CA, USA",
        subscriptionType: data.subscriptionType || SubscriptionType.WEEKLY,
        communicationChannel:
          data.communicationChannel === CommunicationChannel.WHATSAPP
            ? CommunicationChannel.SMS
            : data.communicationChannel || CommunicationChannel.EMAIL,
      });
    }
    setIsEditing(false);
  };

  // Get sex display name with translation
  const getSexDisplay = (sex: Sex) => {
    const sexKey = `dashboard.sex.${sex}`;
    const translated = t(sexKey);
    return translated !== sexKey ? translated : sex;
  };

  // Get subscription type display name with translation
  const getSubscriptionTypeDisplay = (type: SubscriptionType) => {
    const typeKey = `common.${type}`;
    return t(typeKey);
  };

  // Get communication channel display name with translation
  const getCommunicationChannelDisplay = (channel: CommunicationChannel) => {
    const channelKey = `common.${channel}`;
    return t(channelKey);
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
                <User className="mr-2 text-purple-600" size={28} />
                {t("dashboard.profile")}
              </h1>
              <p className="text-gray-600">
                {t("dashboard.profileDescription")}
              </p>
            </div>

            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                {t("dashboard.editProfile")}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-2xl">
                      {zodiacSign.split(" ")[1] || "♋"}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {formData.name}
                  </h2>
                  <p className="text-purple-600 font-medium mb-2">
                    {zodiacSign}
                  </p>
                  <p className="text-gray-500 text-sm">{formData.email}</p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {t("dashboard.born")}:{" "}
                    {new Date(formData.dateOfBirth).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {t("dashboard.time")}: {formData.timeOfBirth}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t("dashboard.place")}: {formData.placeOfBirth}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">
                    {isEditing
                      ? t("dashboard.editProfileInfo")
                      : t("dashboard.profileInfo")}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  {/* Personal Information Section */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-purple-600" />
                      {t("dashboard.personalInfo")}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("signup.fullName")} *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("signup.email")} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                        />
                      </div>

                      {/* Sex */}
                      <div>
                        <label
                          htmlFor="sex"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("signup.sex")} *
                        </label>
                        <select
                          id="sex"
                          name="sex"
                          value={formData.sex}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                        >
                          <option value={Sex.FEMALE}>
                            {getSexDisplay(Sex.FEMALE)}
                          </option>
                          <option value={Sex.MALE}>
                            {getSexDisplay(Sex.MALE)}
                          </option>
                          <option value={Sex.OTHER}>
                            {getSexDisplay(Sex.OTHER)}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Birth Information Section */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                      {t("dashboard.birthInfo")}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Date of Birth */}
                      <div>
                        <label
                          htmlFor="dateOfBirth"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("signup.dateOfBirth")} *
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                        />
                        {zodiacSign && (
                          <p className="mt-1 text-sm text-purple-600 font-medium">
                            {t("dashboard.yourZodiacSign")}: {zodiacSign}
                          </p>
                        )}
                      </div>

                      {/* Time of Birth */}
                      <div>
                        <label
                          htmlFor="timeOfBirth"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("signup.timeOfBirth")} *
                        </label>
                        <input
                          type="time"
                          id="timeOfBirth"
                          name="timeOfBirth"
                          value={formData.timeOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                        />
                      </div>

                      {/* Place of Birth */}
                      <div className="md:col-span-2">
                        <label
                          htmlFor="placeOfBirth"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("signup.placeOfBirth")} *
                        </label>
                        <input
                          type="text"
                          id="placeOfBirth"
                          name="placeOfBirth"
                          value={formData.placeOfBirth}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                          placeholder={t("dashboard.birthPlacePlaceholder")}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subscription Preferences Section */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-purple-600" />
                      {t("dashboard.subscriptionPrefs")}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Communication Channel */}
                      <div>
                        <label
                          htmlFor="communicationChannel"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("dashboard.preferredChannel")} *
                        </label>
                        <select
                          id="communicationChannel"
                          name="communicationChannel"
                          value={formData.communicationChannel}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                        >
                          <option value={CommunicationChannel.EMAIL}>
                            {getCommunicationChannelDisplay(
                              CommunicationChannel.EMAIL
                            )}
                          </option>
                          <option value={CommunicationChannel.SMS}>
                            {getCommunicationChannelDisplay(
                              CommunicationChannel.SMS
                            )}
                          </option>
                        </select>
                      </div>

                      {/* Subscription Type */}
                      <div>
                        <label
                          htmlFor="subscriptionType"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("dashboard.messageFrequency")} *
                        </label>
                        <select
                          id="subscriptionType"
                          name="subscriptionType"
                          value={formData.subscriptionType}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          required
                          className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            !isEditing ? "bg-gray-50 text-gray-500" : ""
                          }`}
                        >
                          <option value={SubscriptionType.DAILY}>
                            {getSubscriptionTypeDisplay(SubscriptionType.DAILY)}
                          </option>
                          <option value={SubscriptionType.WEEKLY}>
                            {getSubscriptionTypeDisplay(
                              SubscriptionType.WEEKLY
                            )}
                          </option>
                          <option value={SubscriptionType.MONTHLY}>
                            {getSubscriptionTypeDisplay(
                              SubscriptionType.MONTHLY
                            )}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                      >
                        {t("common.cancel")}
                      </Button>
                      <Button type="submit">
                        {t("dashboard.saveChanges")}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardProfile;
