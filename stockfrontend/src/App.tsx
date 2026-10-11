import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import HistoricalData from "./pages/HistoricalData";
import Prediction from "./pages/Prediction";
import Analytics from "./pages/Analytics";
import Models from "./pages/Models";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function ProtectedLayout() {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      <Sidebar />

      <div className="ml-64">

        <Navbar />

        <main className="p-6">

          <Routes>

            {/* Dashboard */}

            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Historical Data */}

            <Route
              path="/historical"
              element={<HistoricalData />}
            />

            {/* Prediction */}

            <Route
              path="/prediction"
              element={<Prediction />}
            />

            {/* Analytics */}

            <Route
              path="/analytics"
              element={<Analytics />}
            />

            {/* Models */}

            <Route
              path="/models"
              element={<Models />}
            />

            {/* Profile */}

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* Settings */}

            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Unknown protected page */}

            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>

        </main>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Pages */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* Protected Pages */}

        <Route
          path="/*"
          element={<ProtectedLayout />}
        />

      </Routes>

    </BrowserRouter>
  );
}