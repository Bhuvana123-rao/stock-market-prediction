import { useEffect, useState } from "react";
import {
  Bell,
  Building2,
  Info,
  Save,
  Settings as SettingsIcon,
  User,
} from "lucide-react";

interface SettingsData {
  company: string;
  predictionDays: string;
  notifications: boolean;
}

const defaultSettings: SettingsData = {
  company: "RELIANCE",
  predictionDays: "1",
  notifications: true,
};

export default function Settings() {
  const [settings, setSettings] =
    useState<SettingsData>(defaultSettings);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("appSettings");

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        setSettings({
          company: parsed.company || parsed.defaultCompany || "RELIANCE",
          predictionDays:
            parsed.predictionDays ||
            parsed.predictionPeriod ||
            "1",
          notifications:
            typeof parsed.notifications === "boolean"
              ? parsed.notifications
              : true,
        });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  const updateSetting = (
    key: keyof SettingsData,
    value: string | boolean
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setMessage("");
  };

  const saveSettings = () => {
    localStorage.setItem(
      "appSettings",
      JSON.stringify(settings)
    );

    setMessage("Settings saved successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const userData = localStorage.getItem("user");

  let userName = "StockVision User";
  let userEmail = "user@example.com";

  if (userData) {
    try {
      const user = JSON.parse(userData);

      userName = user.name || userName;
      userEmail = user.email || userEmail;
    } catch {
      // Use default user information
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-6">

      {/* HEADER */}

      <div className="mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#1F7A63] flex items-center justify-center">
            <SettingsIcon
              size={22}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#081C2D]">
              Settings
            </h1>

            <p className="text-sm text-gray-500">
              Manage your StockVision preferences
            </p>
          </div>

        </div>

      </div>

      {/* TOP CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        {/* USER */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-full bg-[#E8F3F0] flex items-center justify-center">
              <User
                size={19}
                className="text-[#1F7A63]"
              />
            </div>

            <div>

              <p className="text-xs text-gray-400">
                ACCOUNT
              </p>

              <p className="font-semibold text-[#081C2D]">
                {userName}
              </p>

            </div>

          </div>

          <p className="text-sm text-gray-500 break-all">
            {userEmail}
          </p>

        </div>

        {/* COMPANY */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-lg bg-[#E8F3F0] flex items-center justify-center">
              <Building2
                size={19}
                className="text-[#1F7A63]"
              />
            </div>

            <div>

              <p className="text-xs text-gray-400">
                DEFAULT COMPANY
              </p>

              <p className="font-semibold text-[#081C2D]">
                {settings.company}
              </p>

            </div>

          </div>

          <p className="text-sm text-gray-500">
            Selected stock for analysis
          </p>

        </div>

        {/* NOTIFICATIONS */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-10 h-10 rounded-lg bg-[#E8F3F0] flex items-center justify-center">
              <Bell
                size={19}
                className="text-[#1F7A63]"
              />
            </div>

            <div>

              <p className="text-xs text-gray-400">
                NOTIFICATIONS
              </p>

              <p className="font-semibold text-[#081C2D]">
                {settings.notifications
                  ? "Enabled"
                  : "Disabled"}
              </p>

            </div>

          </div>

          <p className="text-sm text-gray-500">
            Market and prediction updates
          </p>

        </div>

      </div>

      {/* MAIN SETTINGS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SETTINGS MENU */}

        <div className="bg-white rounded-xl border border-gray-200 p-5">

          <h2 className="font-bold text-[#081C2D] mb-4">
            Settings Menu
          </h2>

          <div className="space-y-2">

            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#E8F3F0] text-[#1F7A63] font-medium">
              <SettingsIcon size={18} />
              General
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500">
              <User size={18} />
              Account
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500">
              <Bell size={18} />
              Notifications
            </div>

            <div className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500">
              <Info size={18} />
              About
            </div>

          </div>

        </div>

        {/* GENERAL SETTINGS */}

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-xl border border-gray-200 p-6">

            <h2 className="text-lg font-bold text-[#081C2D]">
              General Preferences
            </h2>

            <p className="text-sm text-gray-500 mt-1 mb-6">
              Configure your stock analysis preferences.
            </p>

            {/* COMPANY */}

            <div className="mb-6">

              <label className="block text-sm font-semibold text-[#081C2D] mb-2">
                Default Company
              </label>

              <select
                value={settings.company}
                onChange={(event) =>
                  updateSetting(
                    "company",
                    event.target.value
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-[#1F7A63]"
              >

                <option value="RELIANCE">
                  Reliance Industries
                </option>

                <option value="HDFCBANK">
                  HDFC Bank
                </option>

                <option value="ICICIBANK">
                  ICICI Bank
                </option>

              </select>

              <p className="text-xs text-gray-400 mt-2">
                This company will be selected by default.
              </p>

            </div>

            {/* PREDICTION PERIOD */}

            <div className="mb-6">

              <label className="block text-sm font-semibold text-[#081C2D] mb-2">
                Prediction Period
              </label>

              <select
                value={settings.predictionDays}
                onChange={(event) =>
                  updateSetting(
                    "predictionDays",
                    event.target.value
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white outline-none focus:border-[#1F7A63]"
              >

                <option value="1">
                  1 Day
                </option>

                <option value="7">
                  7 Days
                </option>

                <option value="14">
                  14 Days
                </option>

                <option value="30">
                  30 Days
                </option>

              </select>

              <p className="text-xs text-gray-400 mt-2">
                Default number of days used for predictions.
              </p>

            </div>

            {/* NOTIFICATIONS */}

            <div className="flex items-center justify-between border-t border-gray-100 pt-6">

              <div className="flex items-center gap-3">

                <Bell
                  size={20}
                  className="text-[#1F7A63]"
                />

                <div>

                  <p className="font-semibold text-[#081C2D]">
                    Notifications
                  </p>

                  <p className="text-xs text-gray-400">
                    Enable stock analysis notifications
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  updateSetting(
                    "notifications",
                    !settings.notifications
                  )
                }
                className={`w-12 h-6 rounded-full relative ${
                  settings.notifications
                    ? "bg-[#1F7A63]"
                    : "bg-gray-300"
                }`}
              >

                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    settings.notifications
                      ? "left-7"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

          </div>

          {/* ABOUT CARD */}

          <div className="bg-white rounded-xl border border-gray-200 p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-lg bg-[#E8F3F0] flex items-center justify-center">
                <Info
                  size={19}
                  className="text-[#1F7A63]"
                />
              </div>

              <div>

                <h2 className="font-bold text-[#081C2D]">
                  About StockVision
                </h2>

                <p className="text-sm text-gray-500">
                  Stock prediction and analysis platform
                </p>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-4">

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400">
                  Companies
                </p>
                <p className="text-xl font-bold mt-1">
                  3
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400">
                  Models
                </p>
                <p className="text-xl font-bold mt-1">
                  3
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400">
                  Version
                </p>
                <p className="text-xl font-bold mt-1">
                  1.0
                </p>
              </div>

            </div>

          </div>

          {/* SAVE */}

          <div className="flex items-center justify-between bg-[#081C2D] rounded-xl p-5">

            <div>

              <p className="text-white font-semibold">
                Save your changes
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Your preferences are saved locally.
              </p>

            </div>

            <button
              type="button"
              onClick={saveSettings}
              className="flex items-center gap-2 px-5 py-3 bg-[#1F7A63] text-white rounded-lg font-semibold text-sm hover:opacity-90"
            >

              <Save size={17} />

              Save Changes

            </button>

          </div>

          {message && (
            <p className="text-center text-sm font-medium text-[#1F7A63]">
              {message}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}