import {
  BarChart3,
  Brain,
  Database,
  LayoutDashboard,
  LogOut,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";


import {
  NavLink,
  useNavigate,
} from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Historical Data", path: "/historical", icon: Database },
  { name: "Prediction", path: "/prediction", icon: TrendingUp },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Models", path: "/models", icon: Brain },
  { name: "Profile", path: "/profile", icon: User },
];
const handleLogout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#081C2D] text-white flex flex-col">

      {/* Logo */}

      <div className="px-6 py-6 border-b border-white/10">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-lg bg-[#1F7A63] flex items-center justify-center">
            <TrendingUp size={22} />
          </div>

          <div>

            <h1 className="text-lg font-bold">
              StockVision
            </h1>

            <p className="text-xs text-gray-400">
              AI Prediction
            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 py-6 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-[#1F7A63] text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* Bottom Menu */}

      <div className="px-4 pb-6 space-y-2">

        {/* Settings */}

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition"
        >
          <Settings size={20} />

          <span>Settings</span>
        </button>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition"
        >
          <LogOut size={20} />

          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}
<button
  type="button"
  onClick={handleLogout}
  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition"
>
  <LogOut size={20} />
  <span>Logout</span>
</button>