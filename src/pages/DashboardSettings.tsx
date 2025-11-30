import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import Button from "../components/common/Button";
import {
  Settings,
  Lock,
  CreditCard,
  Bell,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { StripeAPI } from "../lib/stripe-api";

const keys = {
  basic: {
    daily: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_DAILY_MONTHLY ||
        "price_1RgUTuFPWscwqOaDZo51Gnp5",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_DAILY_YEARLY ||
        "price_1RgUUiFPWscwqOaDnEddKi1h",
    },
    weekly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_MONTHLY ||
        "price_1RgUWlFPWscwqOaDD4csp4Ch",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_WEEKLY_YEARLY ||
        "price_1RgUYEFPWscwqOaDqtyqKe9v",
    },
    monthly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_MONTHLY ||
        "price_1RgUVgFPWscwqOaDRQxlin8o",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY_YEARLY ||
        "price_1RgUVwFPWscwqOaDVTFuKQMH",
    },
  },
  premium: {
    daily: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_MONTHLY ||
        "price_1RgUV8FPWscwqOaDHZQXT6Wz",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_DAILY_YEARLY ||
        "price_1RgUVVFPWscwqOaD5YSmWL9E",
    },
    weekly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_MONTHLY ||
        "price_1RgUXnFPWscwqOaDbnHAnQ3r",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_WEEKLY_YEARLY ||
        "price_1RgUYUFPWscwqOaDq6mNWBQ3",
    },
    monthly: {
      monthly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_MONTHLY ||
        "price_1RgUW8FPWscwqOaD3Ku2h6Gd",
      yearly:
        import.meta.env.VITE_STRIPE_PRICE_PREMIUM_MONTHLY_YEARLY ||
        "price_1RgUWZFPWscwqOaDhAWPJHpD",
    },
  },
};

const DashboardSettings: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  // Form states
  const [emailData, setEmailData] = useState({
    currentEmail: "sarah@example.com",
    newEmail: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSubscriptionData = async () => {
    try {
      const { data: profile } = await supabase
        .from("users")
        .select(
          "stripe_customer_id, subscription_status, subscription_period_end, subscription_plan, stripe_subscription_id"
        )
        .eq("id", user?.id)
        .maybeSingle();

      console.log("Profile data:", profile);

      if (
        profile?.stripe_customer_id &&
        (profile?.subscription_status === "basic" || profile?.subscription_status === "premium")
      ) {
        console.log("Found active/trialing subscription:", profile.subscription_status);
        
        // Set subscription data from database
        setSubscription({
          id: profile.stripe_subscription_id,
          status: profile.subscription_status,
          current_period_end: profile.subscription_period_end,
          plan: { id: profile.subscription_plan }
        });

        // Determine current plan from the subscription plan ID
        {
          const tierKeys = Object.keys(keys) as Array<keyof typeof keys>;
          let found = false;
          for (const tier of tierKeys) {
            const tierObj = keys[tier];
            const freqKeys = Object.keys(tierObj) as Array<keyof typeof tierObj>;
            for (const freq of freqKeys) {
              const freqObj = tierObj[freq];
              const intervalKeys = Object.keys(freqObj) as Array<keyof typeof freqObj>;
              for (const interval of intervalKeys) {
                if (freqObj[interval] === profile.subscription_plan) {
                  const tierName = String(tier);
                  setCurrentPlan(tierName.charAt(0).toUpperCase() + tierName.slice(1));
                  console.log("Set current plan to:", tierName.charAt(0).toUpperCase() + tierName.slice(1));
                  found = true;
                  break;
                }
              }
              if (found) break;
            }
            if (found) break;
          }
        }
      } else {
        console.log("No active subscription found. Status:", profile?.subscription_status);
        setSubscription(null);
        setCurrentPlan("");
      }
    } catch (err) {
      console.log("Failed to load subscription data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase
        .from("users")
        .select("email")
        .eq("id", user?.id)
        .single();

      if (data) {
        setEmailData({ ...emailData, currentEmail: data.email });
      }
    };

    getUser();
    loadSubscriptionData();
  }, [user?.id]); // Add user?.id as dependency to reload when user changes

  // Handle email update
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("users").update({ email: emailData.newEmail });
    setEmailData({ ...emailData, newEmail: "" });
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(t("dashboard.passwordMismatch"));
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user?.email || "",
      password: passwordData.currentPassword,
    });
    if (signInError) {
      alert(t("dashboard.invalidCurrentPassword"));
      return;
    }
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });
    if (updateError) {
      alert(t("dashboard.passwordUpdateError"));
      return;
    }
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (window.confirm(t("dashboard.cancelSubscriptionConfirm"))) {
      try {
        setLoading(true);
        const subscriptionId = subscription?.id;

        if (!subscriptionId) {
          toast.error("No active subscription found to cancel");
          return;
        }

        console.log("Cancelling subscription:", subscriptionId);
        await StripeAPI.cancelSubscription(subscriptionId);

        await supabase
          .from("users")
          .update({
            subscription_status: "canceled",
            subscription_period_end: null,
            subscription_plan: null,
            stripe_subscription_id: null,
          })
          .eq("id", user?.id);

        setSubscription(null);
        setCurrentPlan("");

        for (let i = 0; i < 3; i++) {
          await loadSubscriptionData();
          await new Promise((r) => setTimeout(r, 800));
        }
        toast.success("Subscription cancelled successfully");
      } catch (err) {
        toast.error(t("dashboard.cancelSubscriptionError"));
        console.log("Cancel Subscription Error: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmation = window.prompt(t("dashboard.deleteAccountConfirm"));
    if (confirmation === "DELETE") {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", user?.id);
      if (error) {
        toast.error(error.message);
      }
      await supabase.auth.signOut();
    }
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-2 text-purple-600" size={28} />
              {t("dashboard.settings")}
            </h1>
            <p className="text-gray-600">
              {t("dashboard.settingsDescription")}
            </p>
          </div>

          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <Lock className="mr-2 text-purple-600" size={20} />
                  {t("dashboard.accountSecurity")}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Email Update */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {t("dashboard.updateEmail")}
                  </h3>
                  <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("dashboard.currentEmail")}
                        </label>
                        <input
                          type="email"
                          value={emailData.currentEmail}
                          disabled
                          className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("dashboard.newEmail")}
                        </label>
                        <input
                          type="email"
                          value={emailData.newEmail}
                          onChange={(e) =>
                            setEmailData({
                              ...emailData,
                              newEmail: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                          placeholder={t("dashboard.newEmailPlaceholder")}
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={!emailData.newEmail}>
                      {t("dashboard.updateEmailButton")}
                    </Button>
                  </form>
                </div>

                <hr className="border-gray-200" />

                {/* Password Update */}
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">
                    {t("dashboard.changePassword")}
                  </h3>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("dashboard.currentPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            placeholder={t(
                              "dashboard.currentPasswordPlaceholder"
                            )}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                current: !showPasswords.current,
                              })
                            }
                          >
                            {showPasswords.current ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("dashboard.newPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            placeholder={t("dashboard.newPasswordPlaceholder")}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                new: !showPasswords.new,
                              })
                            }
                          >
                            {showPasswords.new ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {t("dashboard.confirmPassword")}
                        </label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            placeholder={t(
                              "dashboard.confirmPasswordPlaceholder"
                            )}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() =>
                              setShowPasswords({
                                ...showPasswords,
                                confirm: !showPasswords.confirm,
                              })
                            }
                          >
                            {showPasswords.confirm ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={
                        !passwordData.currentPassword ||
                        !passwordData.newPassword ||
                        !passwordData.confirmPassword
                      }
                    >
                      {t("dashboard.updatePasswordButton")}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Subscription Management */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <CreditCard className="mr-2 text-purple-600" size={20} />
                  {t("dashboard.subscriptionManagement")}
                </h2>
              </div>

              {subscription ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">
                        {t("dashboard.currentPlan")}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("dashboard.plan")}:
                          </span>
                          <span className="font-medium">{currentPlan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("dashboard.status")}:
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscription.status === "active" || subscription.status === "trialing"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {subscription.status === "trialing" ? "Trial" : 
                             subscription.status === "active" ? "Active" : 
                             subscription.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("dashboard.nextBilling")}:
                          </span>
                          <span className="font-medium">
                            {subscription.current_period_end ? 
                              new Date(subscription.current_period_end).toLocaleDateString() : 
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {t("dashboard.amount")}:
                          </span>
                          <span className="font-medium">
                            {subscription.plan?.id ? "Plan Active" : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">
                      {t("dashboard.paymentMethod")}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("dashboard.card")}:
                        </span>
                        <span className="font-medium">
                          {subscriptionData.paymentMethod}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button variant="outline" size="sm" fullWidth>
                        {t("dashboard.updatePaymentMethod")}
                      </Button>
                      <Button variant="outline" size="sm" fullWidth>
                        {t("dashboard.changePlan")}
                      </Button>
                    </div>
                  </div> */}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={handleCancelSubscription}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {t("dashboard.cancelSubscription")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  {t("dashboard.noSubscription")}
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg shadow border-red-200">
              <div className="px-6 py-4 border-b border-red-200 bg-red-50">
                <h2 className="text-lg font-medium text-red-900 flex items-center">
                  <Trash2 className="mr-2 text-red-600" size={20} />
                  {t("dashboard.dangerZone")}
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-2">
                      {t("dashboard.deleteAccount")}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {t("dashboard.deleteAccountDescription")}
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleDeleteAccount}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      {t("dashboard.deleteAccountButton")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardSettings;
