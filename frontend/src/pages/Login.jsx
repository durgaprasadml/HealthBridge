import { useNavigate } from "react-router-dom";
import { User, Stethoscope, Building2, Shield, ArrowRight } from "lucide-react";

const roles = [
  {
    id: "patient",
    label: "Patient",
    description: "Access your health records and manage permissions",
    icon: User,
    color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    path: "/login/patient",
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "View patient records with patient consent",
    icon: Stethoscope,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    path: "/login/doctor",
  },
  {
    id: "hospital",
    label: "Hospital",
    description: "Manage your hospital and doctors",
    icon: Building2,
    color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    path: "/login/hospital",
  },
];

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 text-white mb-4 shadow-lg shadow-primary-500/30">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">HealthBridge</h1>
          <p className="text-text-secondary mt-2">Secure Healthcare Identity Platform</p>
        </div>

        {/* Role Selection Card */}
        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <h2 className="text-xl font-semibold text-text-primary text-center mb-2">
            Choose Your Portal
          </h2>
          <p className="text-text-secondary text-center mb-6">
            Select how you want to access HealthBridge
          </p>

          <div className="space-y-3">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => navigate(role.path)}
                  className={`
                    w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                    ${role.color}
                  `}
                >
                  <div className="p-2 rounded-lg bg-white/80 shadow-sm">
                    <Icon size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-text-primary">{role.label}</p>
                    <p className="text-sm text-text-secondary">{role.description}</p>
                  </div>
                  <ArrowRight size={20} className="text-text-muted" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-text-muted mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

