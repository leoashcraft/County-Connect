import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CONSENT_KEY = "cookie-consent";

/**
 * Get the current consent status from localStorage
 */
export function getConsentStatus() {
  if (typeof window === "undefined") return "pending";
  const stored = localStorage.getItem(CONSENT_KEY);
  if (stored === "accepted" || stored === "declined") return stored;
  return "pending";
}

/**
 * Check if analytics consent has been given
 */
export function hasAnalyticsConsent() {
  return getConsentStatus() === "accepted";
}

/**
 * Set consent status and trigger analytics if accepted
 */
export function setConsentStatus(status) {
  localStorage.setItem(CONSENT_KEY, status);

  // If accepted, we need to reload to initialize analytics
  // If declined, set the opt-out flag
  if (status === "declined") {
    localStorage.setItem("analytics.disabled", "true");
  } else {
    localStorage.removeItem("analytics.disabled");
    // Reload to initialize analytics with consent
    window.location.reload();
  }
}

/**
 * Reset consent (for "Manage Cookies" functionality)
 */
export function resetConsent() {
  localStorage.removeItem(CONSENT_KEY);
  localStorage.removeItem("analytics.disabled");
  window.location.reload();
}

/**
 * Small, unobtrusive cookie consent banner
 * Compliant with GDPR (EU), CCPA/CPRA (California), VCDPA (Virginia),
 * CPA (Colorado), CTDPA (Connecticut), UCPA (Utah), TDPSA (Texas),
 * OCPA (Oregon), and MCDPA (Montana)
 */
export function CookieConsent() {
  const [status, setStatus] = useState("pending");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check consent status on mount
    const currentStatus = getConsentStatus();
    setStatus(currentStatus);

    // Only show banner if consent is pending
    if (currentStatus === "pending") {
      // Small delay to not interfere with initial page load
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setStatus("accepted");
    setIsVisible(false);
    setConsentStatus("accepted");
  };

  const handleDecline = () => {
    setStatus("declined");
    setIsVisible(false);
    setConsentStatus("declined");
  };

  if (!isVisible || status !== "pending") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 pointer-events-none">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-xl border border-gray-200 p-4 pointer-events-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 text-sm text-gray-700">
            <p>
              We use Google Analytics (with cookies) to improve your experience.
              We also use privacy-focused analytics that doesn't use cookies or personal data.{" "}
              <Link
                to={createPageUrl("CookiePolicy")}
                className="text-orange-600 hover:underline font-medium"
              >
                Cookie Policy
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              GDPR, CCPA, VCDPA, CPA, CTDPA, UCPA, TDPSA, OCPA, MCDPA compliant
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition font-medium"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Button to manage cookie preferences (for footer/settings)
 */
export function ManageCookiesButton({ className }) {
  const handleClick = () => {
    resetConsent();
  };

  return (
    <button
      onClick={handleClick}
      className={className || "text-gray-400 hover:text-white transition text-sm underline"}
    >
      Cookie Preferences
    </button>
  );
}

export default CookieConsent;
