import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function AuthCard({ title, subtitle, children, showTabs = true }) {
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-center mb-8 animate-slide-down">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-emerald-400 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
            <img src="/logo.png" alt="HealthBridge Logo" className="relative w-14 h-14 object-contain drop-shadow-md mix-blend-multiply transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
          </div>
          <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-600 tracking-tight">
            HealthBridge
          </span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-center text-text-primary mb-2">
        Welcome Back
      </h1>
      <p className="text-center text-text-secondary mb-6">
        Sign in to access your healthcare portal
      </p>

      {showTabs && (
        <div className="flex bg-gray-100 rounded-xl p-1.5 mb-6">
          <Link
            to="/login/patient"
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/50 text-center transition-all"
          >
            Patient
          </Link>
          <Link
            to="/login/doctor"
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/50 text-center transition-all"
          >
            Doctor
          </Link>
          <Link
            to="/login/hospital"
            className="flex-1 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/50 text-center transition-all"
          >
            Hospital
          </Link>
        </div>
      )}

      <div className="glass-panel p-6 md:p-8 relative overflow-hidden shadow-xl animate-scale-in">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-400 z-20"></div>
        <h2 className="text-xl font-semibold text-text-primary mb-1">{title}</h2>
        <p className="text-text-secondary text-sm mb-6">{subtitle}</p>
        {children}
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-text-muted mt-6">
        Secure login protected by end-to-end encryption
      </p>
    </div>
  );
}

