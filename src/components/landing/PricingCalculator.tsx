/**
 * Dynamic pricing calculator component
 * Calculates and displays pricing based on user's frequency, channel, and billing cycle selections
 */

import React from "react";
import { SubscriptionType, CommunicationChannel } from "../../types";
import { Check, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface PricingCalculatorProps {
  frequency: SubscriptionType;
  channel: CommunicationChannel;
  selectedPlan: "basic" | "premium";
  onPlanChange: (plan: "basic" | "premium") => void;
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (cycle: "monthly" | "yearly") => void;
}

// Pricing data structure based on the Excel file
const PRICING_DATA = {
  [SubscriptionType.MONTHLY]: {
    [CommunicationChannel.WHATSAPP]: {
      basic: { monthly: 16, yearly: 149 },
      premium: { monthly: 30, yearly: 289 },
    },
    [CommunicationChannel.SMS]: {
      basic: { monthly: 19, yearly: 179 },
      premium: { monthly: 36, yearly: 349 },
    },
    [CommunicationChannel.EMAIL]: {
      basic: { monthly: 16, yearly: 149 },
      premium: { monthly: 30, yearly: 289 },
    },
  },
  [SubscriptionType.WEEKLY]: {
    [CommunicationChannel.WHATSAPP]: {
      basic: { monthly: 19, yearly: 179 },
      premium: { monthly: 36, yearly: 349 },
    },
    [CommunicationChannel.SMS]: {
      basic: { monthly: 19, yearly: 179 },
      premium: { monthly: 36, yearly: 349 },
    },
    [CommunicationChannel.EMAIL]: {
      basic: { monthly: 19, yearly: 179 },
      premium: { monthly: 36, yearly: 349 },
    },
  },
  [SubscriptionType.DAILY]: {
    [CommunicationChannel.WHATSAPP]: {
      basic: { monthly: 24, yearly: 229 },
      premium: { monthly: 46, yearly: 439 },
    },
    [CommunicationChannel.SMS]: {
      basic: { monthly: 24, yearly: 229 },
      premium: { monthly: 46, yearly: 439 },
    },
    [CommunicationChannel.EMAIL]: {
      basic: { monthly: 24, yearly: 229 },
      premium: { monthly: 46, yearly: 439 },
    },
  },
};

// Plan features
const getPlanFeatures = (t: (key: string) => string) => ({
  basic: [
    t("signup.planFeatures.basic.horoscopes"),
    t("signup.planFeatures.basic.birthChart"),
    t("signup.planFeatures.basic.lunar"),
    t("signup.planFeatures.basic.compatibility"),
    t("signup.planFeatures.basic.support"),
  ],
  premium: [
    t("signup.planFeatures.premium.everything"),
    t("signup.planFeatures.premium.advanced"),
    t("signup.planFeatures.premium.transit"),
    t("signup.planFeatures.premium.detailed"),
    t("signup.planFeatures.premium.consultation"),
    t("signup.planFeatures.premium.priority"),
    t("signup.planFeatures.premium.timing"),
  ],
});

const DEFAULT_CURRENCY = "CHF";

const priceFormatter = new Intl.NumberFormat("de-CH", {
  style: "currency",
  currency: DEFAULT_CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatPrice = (value: number) => {
  return priceFormatter.format(value);
};

const formatPriceParts = (value: number) => {
  const parts = priceFormatter.formatToParts(value);

  return {
    currency: parts.find(p => p.type === "currency")?.value ?? "",
    amount: parts
      .filter(p => p.type === "integer" || p.type === "group")
      .map(p => p.value)
      .join(""),
  };
};



const PricingCalculator: React.FC<PricingCalculatorProps> = ({
  frequency,
  channel,
  selectedPlan,
  onPlanChange,
  billingCycle,
  setBillingCycle,
}) => {
  // State for billing cycle selection (monthly vs yearly)
  const { t } = useLanguage();

  // Get plan features with current language
  const planFeatures = getPlanFeatures(t);

  // Get pricing for current selection
  const getCurrentPricing = (plan: "basic" | "premium") => {
    return (
      PRICING_DATA[frequency]?.[channel]?.[plan] || { monthly: 0, yearly: 0 }
    );
  };

  // Calculate savings percentage for yearly plan
  const calculateSavings = (plan: "basic" | "premium") => {
    const pricing = getCurrentPricing(plan);
    const monthlyCost = pricing.monthly * 12;
    const yearlyCost = pricing.yearly;
    const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
    return Math.round(savings);
  };

  // Get the display price based on selected billing cycle
  const getDisplayPrice = (plan: "basic" | "premium") => {
    const pricing = getCurrentPricing(plan);
    return billingCycle === "monthly" ? pricing.monthly : pricing.yearly;
  };

  // Get price period text
    const getPricePeriod = () => {
      return billingCycle === "monthly"
        ? t("pricing.perMonth")
        : t("pricing.perYear");
    };

  return (
    <div className="mt-8">
      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-50 p-2 rounded-xl inline-flex">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-10 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("signup.monthly")}
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`px-10 py-3 rounded-lg text-base font-medium transition-all duration-200 relative ${
              billingCycle === "yearly"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-black-800 hover:text-gray-900"
            }`}
          >
            {t("signup.yearly")}
            {/* Savings badge */}
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              {t("pricing.savePercent").replace(
                "{{percent}}",
                String(calculateSavings(selectedPlan))
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Plan */}
        <div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
            selectedPlan === "basic"
              ? "border-purple-500 bg-purple-50 shadow-lg"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
          onClick={() => onPlanChange("basic")}
        >
          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-gray-900 mb-1">
              {t("signup.basicPlan")}
            </h4>
            <p className="text-sm text-gray-600">
              {t("signup.planFeatures.basic.perfect")}
            </p>
          </div>

          {/* Pricing display */}
          <div className="text-center mb-6">
            <div className="mb-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(getDisplayPrice("basic"))}
              </span>
              <span className="text-gray-600">{getPricePeriod()}</span>
            </div>

            {/* Show savings for yearly billing */}
            {billingCycle === "yearly" && (
              <div className="text-sm">
                <div className="text-gray-500 line-through mb-1">
                  {formatPrice(getCurrentPricing("basic").monthly * 12)} {t("pricing.perYear")}
                </div>
                  <div className="text-green-600 font-medium">
                    {t("pricing.saveAmount")
                      .replace(
                        "{{amount}}",
                        formatPrice(
                          getCurrentPricing("basic").monthly * 12 -
                            getCurrentPricing("basic").yearly
                        )
                      )
                      .replace("{{percent}}", String(calculateSavings("basic")))}
                  </div>
              </div>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-4">
            {planFeatures.basic.map((feature, index) => (
              <li key={index} className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Selection indicator */}
          {selectedPlan === "basic" && (
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white">
                <Check className="w-4 h-4 mr-1" />
                {t("signup.selected")}
              </div>
            </div>
          )}
        </div>

        {/* Premium Plan */}
        <div
          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 relative ${
            selectedPlan === "premium"
              ? "border-purple-500 bg-purple-50 shadow-lg"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
          onClick={() => onPlanChange("premium")}
        >
          {/* Popular badge */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="bg-gradient-to-r from-purple-600 to-teal-500 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" />
              {t("signup.mostPopular")}
            </span>
          </div>

          <div className="text-center mb-4">
            <h4 className="text-lg font-bold text-gray-900 mb-1">
              {t("signup.premiumPlan")}
            </h4>
            <p className="text-sm text-gray-600">
              {t("signup.planFeatures.premium.complete")}
            </p>
          </div>

          {/* Pricing display */}
          <div className="text-center mb-6">
            <div className="mb-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(getDisplayPrice("premium"))}
              </span>
              <span className="text-gray-600">{getPricePeriod()}</span>
            </div>

            {/* Show savings for yearly billing */}
            {billingCycle === "yearly" && (
              <div className="text-sm">
                <div className="text-gray-500 line-through mb-1">
                  {formatPrice(getCurrentPricing("premium").monthly * 12)} {t("pricing.perYear")}
                </div>
                <div className="text-green-600 font-medium">
                  {t("pricing.saveAmount")
                    .replace(
                      "{{amount}}",
                      formatPrice(
                        getCurrentPricing("premium").monthly * 12 -
                          getCurrentPricing("premium").yearly
                      )
                    )
                    .replace("{{percent}}", String(calculateSavings("premium")))}
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <ul className="space-y-2 mb-4">
            {planFeatures.premium.map((feature, index) => {
              const highlightStart = planFeatures.premium.length - 3;
              const isFirstHighlight = index === highlightStart;
              const isHighlight = index >= highlightStart;

              return (
                <li
                  key={index}
                  className={`flex items-start text-sm ${isFirstHighlight ? "pt-3 mt-3 border-t border-gray-200" : ""}`}
                >
                  <Check className={`mr-2 h-4 w-4 mt-0.5 flex-shrink-0 ${isHighlight ? "text-green-600" : "text-green-500"}`} />
                  <span className={`text-gray-700 ${isHighlight ? "font-medium" : ""}`}>{feature}</span>
                </li>
              );
            })}
          </ul>

          {/* Selection indicator */}
          {selectedPlan === "premium" && (
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white">
                <Check className="w-4 h-4 mr-1" />
                {t("signup.selected")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          {t("signup.freeTrialNote")}
        </p>
        <div className="flex justify-center items-center space-x-6 text-sm font-medium text-gray-500">
          <span>{t("signup.support")}</span>
          <span>{t("signup.guarantees")}</span>
          <span>{t("signup.securePayments")}</span>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
