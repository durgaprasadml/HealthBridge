import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function AuthCard({ title, subtitle, children, showTabs = true }) {
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center text-white">
            <Shield size={24} />
          </div>
          <span className="text-2xl font-bold text-text-primary">HealthBridge</span>
        </div>
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

      <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
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

