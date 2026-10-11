import { useEffect, useState, type FormEvent } from "react";
import {
  Camera,
  Check,
  Lock,
  Mail,
  Save,
  User,
} from "lucide-react";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserData>({
    name: "",
    email: "",
    role: "user",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
        setName(parsedUser.name || "");
        setEmail(parsedUser.email || "");
      } catch {
        console.error("Unable to read user data");
      }
    }
  }, []);

  const handleProfileSave = (event: FormEvent) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    const updatedUser = {
      ...user,
      name: name.trim(),
      email: email.trim(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handlePasswordChange = (
    event: FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    const usersData = localStorage.getItem("users");

    if (!usersData) {
      setError("User account could not be found.");
      return;
    }

    try {
      const users = JSON.parse(usersData);

      const userIndex = users.findIndex(
        (item: {
          email: string;
          password: string;
        }) => item.email === user.email
      );

      if (userIndex === -1) {
        setError("User account could not be found.");
        return;
      }

      if (
        users[userIndex].password !==
        currentPassword
      ) {
        setError("Current password is incorrect.");
        return;
      }

      users[userIndex].password = newPassword;

      localStorage.setItem(
        "users",
        JSON.stringify(users)
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch {
      setError("Unable to update password.");
    }
  };

  const firstLetter =
    name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      {/* HEADER */}

      <div className="bg-white border-b border-gray-200 px-8 py-6">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-[#1F7A63] flex items-center justify-center">

            <User
              size={24}
              className="text-white"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-[#081C2D]">
              My Profile
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your personal information and account
            </p>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <main className="p-8 max-w-6xl mx-auto">

        {/* PROFILE OVERVIEW */}

        <section className="bg-[#081C2D] rounded-2xl p-7 mb-6 text-white">

          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* AVATAR */}

            <div className="relative">

              <div className="w-24 h-24 rounded-full bg-[#1F7A63] flex items-center justify-center text-3xl font-bold">

                {firstLetter}

              </div>

              <button
                type="button"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-[#081C2D] flex items-center justify-center shadow"
                title="Change profile picture"
              >

                <Camera size={15} />

              </button>

            </div>

            {/* USER INFO */}

            <div className="flex-1">

              <h2 className="text-2xl font-bold">
                {name || "StockVision User"}
              </h2>

              <p className="text-gray-400 mt-1">
                {email || "No email available"}
              </p>

              <div className="flex items-center gap-2 mt-4">

                <span className="px-3 py-1 rounded-full bg-[#1F7A63] text-xs font-semibold capitalize">
                  {user.role || "user"}
                </span>

                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-gray-300">
                  Active Account
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            <p className="text-sm text-gray-500">
              Account Type
            </p>

            <p className="text-xl font-bold text-[#081C2D] mt-2 capitalize">
              {user.role || "User"}
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            <p className="text-sm text-gray-500">
              Companies Available
            </p>

            <p className="text-xl font-bold text-[#081C2D] mt-2">
              3
            </p>

          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">

            <p className="text-sm text-gray-500">
              Prediction Models
            </p>

            <p className="text-xl font-bold text-[#081C2D] mt-2">
              3
            </p>

          </div>

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PERSONAL INFORMATION */}

          <section className="bg-white rounded-2xl border border-gray-200">

            <div className="px-6 py-5 border-b border-gray-100">

              <h2 className="text-lg font-bold text-[#081C2D]">
                Personal Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Update your basic account information.
              </p>

            </div>

            <form
              onSubmit={handleProfileSave}
              className="p-6"
            >

              {/* NAME */}

              <div className="mb-5">

                <label className="block text-sm font-semibold text-[#081C2D] mb-2">
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1F7A63] focus:ring-2 focus:ring-[#1F7A63]/10"
                    placeholder="Enter your name"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="mb-6">

                <label className="block text-sm font-semibold text-[#081C2D] mb-2">
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1F7A63] focus:ring-2 focus:ring-[#1F7A63]/10"
                    placeholder="Enter your email"
                  />

                </div>

              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#1F7A63] text-white font-semibold text-sm hover:opacity-90 transition"
              >

                <Save size={17} />

                Save Profile

              </button>

            </form>

          </section>

          {/* PASSWORD */}

          <section className="bg-white rounded-2xl border border-gray-200">

            <div className="px-6 py-5 border-b border-gray-100">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-[#F7E8EF] flex items-center justify-center">

                  <Lock
                    size={19}
                    className="text-[#A83D68]"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#081C2D]">
                    Change Password
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Keep your account secure.
                  </p>

                </div>

              </div>

            </div>

            <form
              onSubmit={handlePasswordChange}
              className="p-6"
            >

              <div className="mb-4">

                <label className="block text-sm font-semibold mb-2">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1F7A63]"
                  placeholder="Current password"
                />

              </div>

              <div className="mb-4">

                <label className="block text-sm font-semibold mb-2">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1F7A63]"
                  placeholder="New password"
                />

              </div>

              <div className="mb-6">

                <label className="block text-sm font-semibold mb-2">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#1F7A63]"
                  placeholder="Confirm new password"
                />

              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-[#1F7A63] text-[#1F7A63] font-semibold text-sm hover:bg-[#E8F3F0] transition"
              >

                <Lock size={17} />

                Change Password

              </button>

            </form>

          </section>

        </div>

        {/* MESSAGE */}

        {(message || error) && (

          <div
            className={`mt-6 rounded-xl px-5 py-4 text-sm font-medium flex items-center gap-2 ${
              error
                ? "bg-red-50 text-red-600 border border-red-100"
                : "bg-[#E8F3F0] text-[#1F7A63] border border-[#C9E5DC]"
            }`}
          >

            {!error && <Check size={17} />}

            {error || message}

          </div>

        )}

      </main>

    </div>
  );
}