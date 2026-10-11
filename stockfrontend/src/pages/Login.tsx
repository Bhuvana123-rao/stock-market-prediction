import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Lock, Mail, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    const storedUsers = localStorage.getItem("users");

    let users: Array<{
      name?: string;
      email: string;
      password: string;
      role?: string;
    }> = [];

    if (storedUsers) {
      try {
        users = JSON.parse(storedUsers);
      } catch {
        users = [];
      }
    }

    const existingUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!existingUser) {
      setError("Invalid email or password.");
      return;
    }

    const loggedInUser = {
      name: existingUser.name || "Stock Market User",
      email: existingUser.email,
      role: existingUser.role || "user",
    };

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    if (loggedInUser.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4F2] flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* LOGO / BRAND */}

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
            Sign in to continue to your dashboard
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="bg-white rounded-2xl border border-[#E5DFDC] p-7 shadow-sm">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-[#081C2D]">
              Welcome back
            </h2>

            <p className="text-sm text-[#7C858A] mt-1">
              Enter your account details below
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

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
                  placeholder="Enter your password"
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

            {/* ERROR */}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="w-full bg-[#1F7A63] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Sign In
            </button>

          </form>

          {/* SIGNUP */}

          <div className="text-center mt-6">

            <p className="text-sm text-[#7C858A]">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="font-semibold text-[#C65D7B] hover:underline"
              >
                Create account
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