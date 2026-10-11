import { useState, type FormEvent } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoredUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");

  const handleSignup = (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const storedUsers =
      localStorage.getItem("users");

    let users: StoredUser[] = [];

    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch {
        users = [];
      }
    }

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() ===
        email.trim().toLowerCase()
    );

    if (existingUser) {
      setError(
        "An account with this email already exists."
      );
      return;
    }

    const newUser: StoredUser = {
      name: name.trim(),
      email: email.trim(),
      password,
      role: "user",
    };

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md">

        {/* BRAND */}

        <div className="text-center mb-8">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1F7A63] flex items-center justify-center mb-4">
            <TrendingUp
              size={28}
              className="text-white"
            />
          </div>

          <h1 className="text-2xl font-bold text-[#081C2D]">
            Stock Analytics
          </h1>

          <p className="text-sm text-[#7C858A] mt-2">
            Create your account to get started
          </p>

        </div>

        {/* SIGNUP CARD */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-7 shadow-sm">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-[#081C2D]">
              Create Account
            </h2>

            <p className="text-sm text-[#7C858A] mt-1">
              Enter your details below
            </p>

          </div>

          <form
            onSubmit={handleSignup}
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm font-medium text-[#081C2D] mb-2">
                Full Name
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA3A8]"
                />

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full border border-[#E5DFDC] rounded-lg pl-11 pr-4 py-3 outline-none text-sm focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63]"
                />

              </div>

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-[#081C2D] mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA3A8]"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full border border-[#E5DFDC] rounded-lg pl-11 pr-4 py-3 outline-none text-sm focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63]"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-[#081C2D] mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA3A8]"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Create a password"
                  className="w-full border border-[#E5DFDC] rounded-lg pl-11 pr-12 py-3 outline-none text-sm focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C858A] hover:text-[#081C2D]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-sm font-medium text-[#081C2D] mb-2">
                Confirm Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA3A8]"
                />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm your password"
                  className="w-full border border-[#E5DFDC] rounded-lg pl-11 pr-12 py-3 outline-none text-sm focus:ring-2 focus:ring-[#1F7A63] focus:border-[#1F7A63]"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C858A] hover:text-[#081C2D]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* SIGNUP BUTTON */}

            <button
              type="submit"
              className="w-full bg-[#1F7A63] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Create Account
            </button>

          </form>

          {/* LOGIN LINK */}

          <div className="text-center mt-6">

            <p className="text-sm text-[#7C858A]">
              Already have an account?{" "}

              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-[#C65D7B] hover:underline"
              >
                Sign In
              </button>

            </p>

          </div>

        </div>

        <p className="text-xs text-[#9AA3A8] text-center mt-6">
          Stock Analytics Platform
        </p>

      </div>

    </div>
  );
}