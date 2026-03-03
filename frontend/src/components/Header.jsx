import { Link, useNavigate } from "react-router-dom";
import { Shield, Menu, User, LogOut, Settings, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isLoggedIn = !!token;

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 border-b-2 border-transparent">
          <img src="/logo.png" alt="HealthBridge Logo" className="w-10 h-10 object-contain drop-shadow-sm mix-blend-multiply" />
          <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 hidden sm:block tracking-tight">
            HealthBridge
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-text-secondary">
          <a href="#how" className="hover:text-primary-500 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-primary-500 transition-colors">Features</a>
          <a href="#security" className="hover:text-primary-500 transition-colors">Security</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Emergency Access Button - Always Visible */}
          <Link
            to="/emergency"
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-medium flex items-center gap-1"
          >
            <AlertCircle size={16} />
            <span className="hidden sm:inline">Emergency</span>
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium text-sm">
                  {role?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium text-text-primary hidden sm:block capitalize">
                  {role?.toLowerCase()}
                </span>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card border border-border py-2 animate-slide-down">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary capitalize">{role?.toLowerCase()} Account</p>
                    <p className="text-xs text-text-muted">Signed in</p>
                  </div>
                  <Link
                    to={role === "PATIENT" ? "/patient" : role === "DOCTOR" ? "/doctor" : "/hospital"}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-gray-50 hover:text-text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
