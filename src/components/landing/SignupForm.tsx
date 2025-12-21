/**
 * Comprehensive signup form component for astrology service
 * Collects birth data, preferences, and subscription details
 */

import React, { useEffect, useRef, useState } from "react";
import Container from "../common/Container";
import PricingCalculator from "./PricingCalculator";
import { SubscriptionType, CommunicationChannel, Sex } from "../../types";
import {
  getZodiacSign,
  getZodiacDisplayName,
} from "../../utils/astrologyUtils";
import { Star, Moon, Sun, Mail, MessageCircle, MessagesSquare, Smartphone } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { StripeAPI } from "../../lib/stripe-api";
import { countryCodes } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";

const keys = {
  basic: {
    daily: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_DAILY_MONTHLY ||
        "price_1RpaegFYjVV07eHjdhXh1EYn",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_DAILY_YEARLY ||
        "price_1RpaeeFYjVV07eHjwuuwRtDV",
    },
    weekly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_MONTHLY ||
        "price_1RpaeHFYjVV07eHjOXUxCp8m",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_YEARLY ||
        "price_1RpaeBFYjVV07eHjyGgVU1V4",
    },
    monthly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_MONTHLY ||
        "price_1RpaeTFYjVV07eHjI4B91Hzy",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_YEARLY ||
        "price_1RpaePFYjVV07eHjyEkFHPfy",
    },
  },
  premium: {
    daily: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_MONTHLY ||
        "price_1RpaeZFYjVV07eHjvznjTs7Q",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_YEARLY ||
        "price_1RpaeWFYjVV07eHjJqQfPAcV",
    },
    weekly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_MONTHLY ||
        "price_1RpaeEFYjVV07eHjXENNGhnT",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_YEARLY ||
        "price_1Rpae7FYjVV07eHjosTrUhyV",
    },
    monthly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_MONTHLY ||
        "price_1RpaeMFYjVV07eHjQ93vIVQd",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_YEARLY ||
        "price_1RpaeKFYjVV07eHjpv50IbEV",
    },
  },
};

const SignupForm: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    sendTo: "",
    sex: Sex.FEMALE,
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    subscriptionType: SubscriptionType.WEEKLY,
    communicationChannel: CommunicationChannel.EMAIL,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [zodiacSign, setZodiacSign] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium">(
    "basic"
  );
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState(false);
  const { user, signUp, signIn } = useAuth();
  const { currentLanguage, setLanguage } = useLanguage();
  const [countryCode, setCountryCode] = useState("+1");

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showSexDropdown, setShowSexDropdown] = useState(false);
  const sexDropdownRef = useRef<HTMLDivElement>(null);

  const [placeSuggestions, setPlaceSuggestions] = useState<string[]>([]);
  const [showPlaceDropdown, setShowPlaceDropdown] = useState(false);
  const placeDropdownRef = useRef<HTMLDivElement>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showExistingAccountModal, setShowExistingAccountModal] = useState(false);
  const [showActiveSubscriptionModal, setShowActiveSubscriptionModal] = useState(false);
  const [existingAccountEmail, setExistingAccountEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const formTopRef = useRef<HTMLDivElement>(null);

  // Filtered country codes based on search
  const filteredCountryCodes = countryCodes.filter(
    (country) =>
      country.code.includes(countrySearch) ||
      country.label.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const sexOptions = [
    { value: Sex.FEMALE, label: "Female" },
    { value: Sex.MALE, label: "Male" },
    { value: Sex.OTHER, label: "Other" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    }
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  // Close sex dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sexDropdownRef.current &&
        !sexDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSexDropdown(false);
      }
    }
    if (showSexDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSexDropdown]);

  useEffect(() => {
    const getUser = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (data) {
        setFormData({
          name: data.fullname || "",
          email: data.email || "",
          sendTo: data.sendTo || "",
          sex: data.sex || Sex.FEMALE,
          dateOfBirth: data.dateOfBirth || "",
          timeOfBirth: data.timeOfBirth || "",
          placeOfBirth: data.placeOfBirth || "",
          subscriptionType: data.subscriptionType || SubscriptionType.WEEKLY,
          communicationChannel:
            data.communicationChannel === CommunicationChannel.WHATSAPP
              ? CommunicationChannel.SMS
              : data.communicationChannel || CommunicationChannel.EMAIL,
        });
        setZodiacSign(data.zodiacSign || "");
      }
    };

    getUser();
  }, [user]);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "dateOfBirth" && value) {
      const birthDate = new Date(value);
      const sign = getZodiacSign(birthDate);
      setZodiacSign(getZodiacDisplayName(sign));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) return;
    
    if (!user) {
      setShowPasswordModal(true);
      return;
    }

    try {
      setLoading(true);

      // First get user profile and check subscription status
      const { data: profile } = await supabase
        .from("users")
        .select("stripe_customer_id, email, subscription_status")
        .eq("id", user?.id)
        .maybeSingle();

      if (!profile) throw new Error("Profile not found");


      let customerId = profile.stripe_customer_id;

      // Create/update customer if needed
      if (!customerId) {
        const customer = await StripeAPI.createOrUpdateCustomer(
          user?.id,
          profile.email
        );
        customerId = customer?.id;
        if (!customerId) throw new Error("Failed to create customer");
      } else {
        // Double-check with Stripe API for any existing subscriptions
        const subscriptionData: any = await StripeAPI.getSubscription(
          profile.stripe_customer_id
        );

        if (subscriptionData && (subscriptionData.status === "active" || subscriptionData.status === "trialing")) {
          setLoading(false);
          setShowActiveSubscriptionModal(true);
          return;
        }
      }

      const priceId =
        keys[selectedPlan][formData.subscriptionType][billingCycle];

      const session: any = await StripeAPI.createCheckoutSession(
        user?.id,
        customerId,
        priceId,
        `${window.location.origin}/?success=true`,
        `${window.location.origin}/?canceled=true`
      );

      if (session?.url) {
        await supabase
          .from("users")
          .update({
            send_to:
              formData.communicationChannel === CommunicationChannel.EMAIL
                ? formData.email
                : countryCode + formData.sendTo,
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
        window.location.href = session.url;
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
      try {
        setLoading(true);
      setPasswordError("");

      // First check if email already exists in the system
      const { data: existingUser } = await supabase
      .from("users")
        .select("id, email, stripe_customer_id, subscription_status")
      .eq("email", formData.email)
        .maybeSingle();

      if (existingUser) {
        let hasActive = false;
        if (existingUser.stripe_customer_id) {
          const subscriptionData: any = await StripeAPI.getSubscription(existingUser.stripe_customer_id);
          hasActive = !!(subscriptionData && (subscriptionData.status === "active" || subscriptionData.status === "trialing"));
        }
        if (hasActive) {
          setPasswordError("This email already has an active subscription. Please sign in to manage your existing subscription.");
          setLoading(false);
          return;
        }
        setExistingAccountEmail(formData.email);
        setShowPasswordModal(false);
        setShowExistingAccountModal(true);
        setLoading(false);
        return;
      }

      // Email doesn't exist - create new account
      if (!password || password.length < 6) {
        setPasswordError("Password must be at least 6 characters.");
        setLoading(false);
        return;
      }

      const { data, error } = await signUp(
        formData.name,
        formData.email,
        password
      );
      
      if (error) {
        setPasswordError(error.message);
        setLoading(false);
        return;
      }

      // Create user record
      if (!data?.user?.id) {
        console.error("Sign up did not return a session/user. Email confirmation likely required.");
        // We can't proceed without a user id; surface error
        setPasswordError("Signup did not return a user id. Please try again.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from("users")
        .upsert(
          [
            {
          id: data.user.id,
              email: data.user.email || formData.email,
              fullname: data.user.user_metadata?.fullname || formData.name,
          language: currentLanguage,
            },
          ],
          { onConflict: "id" }
        );

      if (insertError) {
        console.error("User upsert failed:", insertError);
        setPasswordError("Failed to create user profile. Please try again.");
        setLoading(false);
        return;
      }
 
      console.log("User record created successfully for:", data.user.email);
 
      // Proceed with subscription for new user
      await proceedWithSubscription(data.user.id, data.user.email);
    } catch (error) {
      console.error("Error:", error);
      setPasswordError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const proceedWithSubscription = async (userId: string, userEmail: string, existingCustomerId?: string) => {
      try {
        setShowPasswordModal(false);
      setShowExistingAccountModal(false);
        setLoading(true);

      // Create/update customer if needed
      let customerId = existingCustomerId;
      if (!customerId) {
        const customer = await StripeAPI.createOrUpdateCustomer(userId, userEmail);
        customerId = customer?.id;
        if (!customerId) throw new Error("Failed to create customer");
      }

      const priceId = keys[selectedPlan][formData.subscriptionType][billingCycle];

        const session: any = await StripeAPI.createCheckoutSession(
        userId,
          customerId,
          priceId,
          `${window.location.origin}/?success=true`,
          `${window.location.origin}/?canceled=true`
        );

        if (session?.url) {
          await supabase
            .from("users")
            .update({
              send_to:
                formData.communicationChannel === CommunicationChannel.EMAIL
                ? userEmail
                  : countryCode + formData.sendTo,
              sex: formData.sex,
              dateOfBirth: formData.dateOfBirth,
              timeOfBirth: formData.timeOfBirth,
              placeOfBirth: formData.placeOfBirth,
              communicationChannel: formData.communicationChannel,
              subscriptionType: formData.subscriptionType,
              zodiacSign: zodiacSign,
              language: currentLanguage,
            })
          .eq("id", userId);
          window.location.href = session.url;
        }
      } catch (err) {
        console.error("Error:", err);
      setPasswordError("Failed to process subscription. Please try again.");
        setLoading(false);
    }
  };

  // Validation logic for each step
  const validateStep = () => {
    console.log(currentLanguage);
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!formData.communicationChannel)
        newErrors.communicationChannel = "Required";
      if (!formData.subscriptionType) newErrors.subscriptionType = "Required";
    }
    if (currentStep === 2) {
      if (!formData.name) newErrors.name = "Required";
      if (!formData.email) newErrors.email = "Required";
      if (
        formData.communicationChannel !== CommunicationChannel.EMAIL &&
        (!formData.sendTo || formData.sendTo === "")
      )
        newErrors.sendTo = "Required";
      if (!formData.sex) newErrors.sex = "Required";
      // Date of Birth is mandatory for all plans
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Required";
      // Time of Birth is mandatory only for Premium plans
      if (selectedPlan === "premium" && !formData.timeOfBirth) {
        newErrors.timeOfBirth = "Required for Premium plans";
      }
      if (!formData.placeOfBirth) newErrors.placeOfBirth = "Required";
      if (
        formData.communicationChannel === CommunicationChannel.EMAIL &&
        formData.sendTo &&
        formData.sendTo !== ""
      ) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.sendTo)) {
          newErrors.sendTo = "Invalid email address";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
      formTopRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    formTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPlaceSuggestions = async (query: string) => {
    if (!query) {
      setPlaceSuggestions([]);
      return;
    }
    try {
      const resp = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&type=city&format=json&apiKey=${
          import.meta.env.VITE_GEOAPIFY_API_KEY
        }&limit=10`
      );
      const data = await resp.json();
      setPlaceSuggestions(
        (data.results || []).map(
          (item: any) =>
            `${item.city || item.name}, ${
              item.country ||
              (item.country_code ? item.country_code.toUpperCase() : "")
            }`
        )
      );
    } catch (err) {
      setPlaceSuggestions([]);
    }
  };

  // Handle input change for birthplace
  const handlePlaceOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    fetchPlaceSuggestions(e.target.value);
    setShowPlaceDropdown(true);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        placeDropdownRef.current &&
        !placeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPlaceDropdown(false);
      }
    }
    if (showPlaceDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPlaceDropdown]);

  return (
    <section
      id="signup"
      className="py-20 bg-gradient-to-br from-teal-50 to-indigo-50"
    >
      <Container>
        <div className="max-w-4xl mx-auto">
          <div ref={formTopRef} />
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("signup.title")}
            </h2>
            <p className="text-xl text-gray-600">{t("signup.description")}</p>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        currentStep > step ? "bg-purple-600" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Service Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <img
                      src="/logo.jpg"
                      alt="Luraaya"
                      className="w-12 h-12 mx-auto mb-2 object-contain"
                    />
                    <h3 className="text-2xl font-bold">
                      {t("signup.step1.title")}
                    </h3>
                    <p className="text-gray-600">
                      {/*t("signup.step1.description")*/}
                    </p>
                  </div>

                  {/* Communication Channel Selection */}
                  <div>
                    <label className="block text-lg font-medium text-gray-00 mb-3">
                      {t("signup.communicationChannel")}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.values(CommunicationChannel)
                        .filter((c) => c !== CommunicationChannel.WHATSAPP)
                        .map((channel) => (
                        <label key={channel} className="relative">
                          <input
                            type="radio"
                            name="communicationChannel"
                            value={channel}
                            checked={formData.communicationChannel === channel}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all h-20 flex flex-col justify-center ${
                              formData.communicationChannel === channel
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="text-center">
                              <div className="mb-2 flex justify-center">
                                {channel === CommunicationChannel.EMAIL && (
                                  <Mail className="w-4.5 h-4.5 text-slate-500
" />
                                )}
                                {channel === CommunicationChannel.SMS && (
                                  <MessageCircle className="w-4.5 h-4.5 text-slate-500" />
                                )}
                                {channel === CommunicationChannel.WHATSAPP && (
                                  <Smartphone className="w-7 h-7 text-purple-600" />
                                )}
                              </div>
                              <div className="font-medium capitalize">
                                {channel}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Frequency Selection */}
                  <div>
                    <label className="block text-lg font-medium text-gray-00 mb-3">
                      {t("signup.messageFrequency")}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.values(SubscriptionType).map((type) => (
                        <label key={type} className="relative">
                          <input
                            type="radio"
                            name="subscriptionType"
                            value={type}
                            checked={formData.subscriptionType === type}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all h-20 flex flex-col justify-center ${
                              formData.subscriptionType === type
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="text-center">
                              <div className="font-medium capitalize">
                                {t(`subscription.${type.toLowerCase()}`)}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {type === SubscriptionType.DAILY &&
                                  t("common.daily")}
                                {type === SubscriptionType.WEEKLY &&
                                  t("common.weekly")}
                                {type === SubscriptionType.MONTHLY &&
                                  t("common.monthly")}
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Pricing Display */}
                  <PricingCalculator
                    frequency={formData.subscriptionType}
                    channel={formData.communicationChannel}
                    selectedPlan={selectedPlan}
                    onPlanChange={setSelectedPlan}
                    billingCycle={billingCycle}
                    setBillingCycle={setBillingCycle}
                  />
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Moon className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                    <h3 className="text-2xl font-bold">
                      {t("signup.step2.title")}
                    </h3>
                    <p className="text-gray-600">
                      {t("signup.step2.description")}
                    </p>
                  </div>

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
                        required
                        className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Sarah Johnson"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
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
                        required
                        className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="sarah@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Language Selection */}
                    <div>
                      <label
                        htmlFor="language"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Language *
                      </label>
                      <select
                        id="language"
                        name="language"
                        value={currentLanguage}
                        onChange={(e) => {
                          setLanguage(e.target.value as any);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="en">English</option>
                        <option value="de">Deutsch</option>
                        <option value="fr">Français</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Choose your preferred language for horoscope delivery
                      </p>
                    </div>

                    {/* Send To */}
                    <div
                      className={`${
                        formData.communicationChannel ===
                        CommunicationChannel.EMAIL
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      <label
                        htmlFor="sendTo"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {formData.communicationChannel ===
                        CommunicationChannel.EMAIL
                          ? t("signup.email")
                          : t("signup.sms")}{" "}
                        *
                      </label>
                      <div className="flex">
                        {(formData.communicationChannel ===
                          CommunicationChannel.SMS ||
                          formData.communicationChannel ===
                            CommunicationChannel.WHATSAPP) && (
                          <div className="relative mr-2" ref={dropdownRef}>
                            <input
                              type="text"
                              className="w-[120px] px-3 py-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 font-medium cursor-pointer"
                              value={
                                countrySearch !== "" || showCountryDropdown
                                  ? countrySearch
                                  : countryCode
                                  ? `${countryCode} • ${
                                      countryCodes.find(
                                        (c) => c.code === countryCode
                                      )?.label
                                    }`
                                  : ""
                              }
                              placeholder="+1 • US"
                              onFocus={() => {
                                setShowCountryDropdown(true);
                                setCountrySearch("");
                              }}
                              onClick={() => {
                                setShowCountryDropdown(true);
                                setCountrySearch("");
                              }}
                              onChange={(e) => {
                                setCountrySearch(e.target.value);
                                setShowCountryDropdown(true);
                              }}
                              readOnly={false}
                              autoComplete="off"
                            />
                            {showCountryDropdown && (
                              <div
                                className="absolute z-10 mt-2 w-full max-h-80 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg"
                                style={{
                                  minWidth: 120,
                                  maxWidth: 220,
                                  maxHeight: "320px",
                                }}
                                tabIndex={-1}
                              >
                                <ul role="listbox">
                                  {filteredCountryCodes.length === 0 && (
                                    <li className="px-3 py-2 text-gray-400">
                                      No results
                                    </li>
                                  )}
                                  {filteredCountryCodes
                                    .slice(0, 10)
                                    .map((country) => (
                                      <li
                                        key={country.code}
                                        role="option"
                                        aria-selected={
                                          countryCode === country.code
                                        }
                                        className={`px-3 py-2 cursor-pointer hover:bg-purple-50 ${
                                          countryCode === country.code
                                            ? "bg-purple-100 font-semibold"
                                            : ""
                                        }`}
                                        onClick={() => {
                                          setCountryCode(country.code);
                                          setCountrySearch("");
                                          setShowCountryDropdown(false);
                                        }}
                                      >
                                        {country.code}{" "}
                                        <span className="text-gray-500">
                                          • {country.label}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        <input
                          type={
                            formData.communicationChannel ===
                            CommunicationChannel.EMAIL
                              ? "email"
                              : "text"
                          }
                          id="sendTo"
                          name="sendTo"
                          value={formData.sendTo}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            errors.sendTo ? "border-red-500" : "border-gray-300"
                          }`}
                          placeholder={
                            formData.communicationChannel ===
                            CommunicationChannel.EMAIL
                              ? "sarah@example.com"
                              : formData.communicationChannel ===
                                CommunicationChannel.SMS
                              ? "1234567890"
                              : "612345678"
                          }
                        />
                      </div>
                      {errors.sendTo && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.sendTo}
                        </p>
                      )}
                    </div>

                    {/* Sex */}
                    <div>
                      <label
                        htmlFor="sex"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("signup.sex")} *
                      </label>
                      <div className="relative" ref={sexDropdownRef}>
                        <button
                          type="button"
                          className="w-full flex justify-between items-center px-4 py-2 border rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 border-gray-300 font-medium"
                          onClick={() => setShowSexDropdown((prev) => !prev)}
                        >
                          {sexOptions.find((s) => s.value === formData.sex)
                            ?.label || "Select"}
                          <svg
                            className="ml-2 h-4 w-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {showSexDropdown && (
                          <div
                            className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg"
                            style={{ minWidth: 120, maxWidth: 220 }}
                          >
                            <ul role="listbox">
                              {sexOptions.map((option) => (
                                <li
                                  key={option.value}
                                  role="option"
                                  aria-selected={formData.sex === option.value}
                                  className={`px-4 py-2 cursor-pointer hover:bg-purple-50 ${
                                    formData.sex === option.value
                                      ? "bg-purple-100 font-semibold"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      sex: option.value,
                                    });
                                    setShowSexDropdown(false);
                                  }}
                                >
                                  {option.label}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
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
                        required
                        className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                          errors.dateOfBirth
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {zodiacSign && (
                        <p className="mt-1 text-sm text-purple-600 font-medium">
                          Your zodiac sign: {zodiacSign}
                        </p>
                      )}
                    </div>

                    {/* Time of Birth */}
                    <div>
                      <label
                        htmlFor="timeOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("signup.timeOfBirth")} {selectedPlan === "premium" ? "*" : ""}
                      </label>
                      <input
                        type="time"
                        id="timeOfBirth"
                        name="timeOfBirth"
                        value={formData.timeOfBirth}
                        onChange={handleInputChange}
                        required={selectedPlan === "premium"}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                          errors.timeOfBirth
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {selectedPlan === "premium" 
                          ? t("signup.birthTime.note") 
                          : "Required for Premium plans only"}
                      </p>
                      {errors.timeOfBirth && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.timeOfBirth}
                        </p>
                      )}
                    </div>

                    {/* Place of Birth */}
                    <div>
                      <label
                        htmlFor="placeOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {t("signup.placeOfBirth")} *
                      </label>
                      <div className="relative" ref={placeDropdownRef}>
                        <input
                          type="text"
                          id="placeOfBirth"
                          name="placeOfBirth"
                          value={formData.placeOfBirth}
                          onChange={handlePlaceOfBirthChange}
                          required
                          autoComplete="off"
                          className={`w-full px-4 py-2 border rounded-md focus:ring-purple-500 focus:border-purple-500 ${
                            errors.placeOfBirth
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="City, State/Province, Country"
                          onFocus={() => {
                            if (formData.placeOfBirth)
                              setShowPlaceDropdown(true);
                          }}
                        />
                        {showPlaceDropdown && placeSuggestions.length > 0 && (
                          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <ul>
                              {placeSuggestions.map((suggestion, idx) => (
                                <li
                                  key={idx}
                                  className="px-4 py-2 cursor-pointer hover:bg-purple-50"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      placeOfBirth: suggestion,
                                    });
                                    setShowPlaceDropdown(false);
                                  }}
                                >
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          {t("signup.birthPlace.note")}
                        </p>
                        {errors.placeOfBirth && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.placeOfBirth}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Plan Selection & Summary */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white font-bold text-xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-bold">
                      {t("signup.step4.title")}
                    </h3>
                    <p className="text-gray-600">
                      {t("signup.step4.description")}
                    </p>
                  </div>

                  {/* Summary of user selections */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      {t("signup.yourSelection")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">
                          {t("signup.fullName")}:
                        </span>
                        <span className="ml-2 font-medium">
                          {formData.name || "Not provided"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("signup.email")}:
                        </span>
                        <span className="ml-2 font-medium">
                          {formData.email || "Not provided"}
                        </span>
                      </div>
                      {formData.communicationChannel !==
                        CommunicationChannel.EMAIL && (
                        <div>
                          <span className="text-gray-600">
                            {t("signup.sms")}
                          </span>
                          <span className="ml-2 font-medium">
                            {countryCode + " " + formData.sendTo ||
                              "Not provided"}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">
                          {t("signup.dateOfBirth")}:
                        </span>
                        <span className="ml-2 font-medium">
                          {formData.dateOfBirth
                            ? new Date(
                                formData.dateOfBirth
                              ).toLocaleDateString()
                            : "Not provided"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">
                          {t("signup.zodiacSign")}:
                        </span>
                        <span className="ml-2 font-medium text-purple-600">
                          {zodiacSign || "Not calculated"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Pricing Display */}
                  <PricingCalculator
                    frequency={formData.subscriptionType}
                    channel={formData.communicationChannel}
                    selectedPlan={selectedPlan}
                    onPlanChange={setSelectedPlan}
                    billingCycle={billingCycle}
                    setBillingCycle={setBillingCycle}
                  />
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-center mt-8">
                <div>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-2 rounded-md font-medium transition-all duration-200 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                    >
                      {t("signup.previous")}
                    </button>
                  )}
                </div>

                <div>
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 rounded-md font-bold transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                    >
                      {t("signup.nextStep")}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 rounded-md font-bold transition-all duration-200 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        t("signup.startJourney")
                      )}
                    </button>
                  )}
                </div>
              </div>
            </form>

            {showPasswordModal && (
              <Modal onClose={() => setShowPasswordModal(false)}>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    {passwordError && (passwordError.includes("already exists") || passwordError.includes("active subscription"))
                      ? "Account Already Exists" 
                      : "Set your password"}
                  </h2>
                  {passwordError && (passwordError.includes("already exists") || passwordError.includes("active subscription")) ? (
                    <div className="mb-4">
                      <p className="text-sm text-red-600 mb-4">{passwordError}</p>
                      <div className="space-y-2">
                        <button
                          className="w-full py-2 bg-purple-600 text-white rounded-md font-bold"
                          onClick={() => {
                            setShowPasswordModal(false);
                            navigate(`/auth/login?email=${encodeURIComponent(formData.email)}`);
                          }}
                          type="button"
                        >
                          Sign In to Existing Account
                        </button>
                        <button
                          className="w-full py-2 bg-gray-200 text-gray-800 rounded-md font-bold"
                          onClick={() => {
                            setShowPasswordModal(false);
                            setPasswordError("");
                          }}
                          type="button"
                        >
                          Use Different Email
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-md mb-2"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className="text-sm text-red-600 mb-2">{passwordError}</p>
                  )}
                  <button
                        className="w-full py-2 bg-purple-600 text-white rounded-md font-bold disabled:opacity-50"
                    onClick={handlePasswordSubmit}
                        disabled={loading}
                    type="button"
                  >
                        {loading ? "Processing..." : "Continue"}
                  </button>
                    </>
                  )}
                </div>
              </Modal>
            )}

            {showExistingAccountModal && (
              <Modal onClose={() => setShowExistingAccountModal(false)}>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">
                    Account Already Exists
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    An account with the email <strong>{existingAccountEmail}</strong> already exists. 
                    Please sign in to continue with your subscription.
                  </p>
                  <div className="space-y-2">
                    <button
                      className="w-full py-2 bg-purple-600 text-white rounded-md font-bold"
                      onClick={() => {
                        setShowExistingAccountModal(false);
                        navigate(`/auth/login?email=${encodeURIComponent(existingAccountEmail)}`);
                      }}
                      type="button"
                    >
                      Sign In & Continue
                    </button>
                    <button
                      className="w-full py-2 bg-gray-200 text-gray-800 rounded-md font-bold"
                      onClick={() => {
                        setShowExistingAccountModal(false);
                        setPasswordError("");
                        setPassword("");
                        setFormData({ ...formData, email: "" });
                      }}
                      type="button"
                    >
                      Use Different Email
                    </button>
                  </div>
                </div>
              </Modal>
            )}

            {showActiveSubscriptionModal && (
              <Modal onClose={() => setShowActiveSubscriptionModal(false)}>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4 text-red-600">
                    Active Subscription Found
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    You already have an active subscription. Please manage your existing subscription in the dashboard.
                  </p>
                  <div className="space-y-2">
                    <button
                      className="w-full py-2 bg-purple-600 text-white rounded-md font-bold"
                      onClick={() => {
                        setShowActiveSubscriptionModal(false);
                        navigate("/dashboard/settings");
                      }}
                      type="button"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      className="w-full py-2 bg-gray-200 text-gray-800 rounded-md font-bold"
                      onClick={() => setShowActiveSubscriptionModal(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </Modal>
            )}

            {/* Privacy notice */}
            {currentStep === 3 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  {t("signup.privacyNotice")}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default SignupForm;
