import { useNavigate } from "react-router-dom";
import { User, Stethoscope, Building2, Shield, ArrowRight } from "lucide-react";

const registerRoles = [
  {
    id: "patient",
    label: "Patient",
    description: "Create Health ID and start managing your records",
    icon: User,
    color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    path: "/register/patient",
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Doctor accounts are created by hospitals",
    icon: Stethoscope,
    color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    path: "/register/doctor",
  },
  {
    id: "hospital",
    label: "Hospital",
    description: "Enroll your hospital and onboard care teams",
    icon: Building2,
    color: "bg-violet-50 text-violet-600 hover:bg-violet-100",
    path: "/register/hospital",
  },
];

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 text-white mb-4 shadow-lg shadow-primary-500/30">
            <Shield size={32} />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Create Account</h1>
          <p className="text-text-secondary mt-2">Choose registration type</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          <div className="space-y-3">
            {registerRoles.map((role) => {
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
      </div>
    </div>
  );
}
