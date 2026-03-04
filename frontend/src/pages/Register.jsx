import { useNavigate } from "react-router-dom";
import { User, Stethoscope, Building2, Shield, ArrowRight } from "lucide-react";

const registerRoles = [
  {
    id: "patient",
    label: "Patient",
    description: "Create Health ID and start managing your records",
    icon: User,
    containerClass: "bg-emerald-50/50 hover:bg-emerald-100/50 text-emerald-800",
    iconClass: "text-emerald-600",
    path: "/register/patient",
  },
  {
    id: "doctor",
    label: "Doctor",
    description: "Doctor accounts are created by hospitals",
    icon: Stethoscope,
    containerClass: "bg-blue-50/50 hover:bg-blue-100/50 text-blue-800",
    iconClass: "text-blue-600",
    path: "/register/doctor",
  },
  {
    id: "hospital",
    label: "Hospital",
    description: "Enroll your hospital and onboard care teams",
    icon: Building2,
    containerClass: "bg-purple-50/50 hover:bg-purple-100/50 text-purple-800",
    iconClass: "text-purple-600",
    path: "/register/hospital",
  },
];

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute top-[40%] left-[10%] w-[35rem] h-[35rem] bg-primary-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-lg animate-scale-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 text-white mb-6 shadow-2xl shadow-primary-500/40 relative group">
            <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Shield size={40} className="transform transition-transform group-hover:scale-110" />
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-emerald-700 tracking-tight">Create Account</h1>
          <p className="text-text-secondary mt-3 font-medium text-lg">Choose registration type</p>
        </div>

        <div className="glass-panel p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-400 z-20"></div>
          <div className="space-y-4">
            {registerRoles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => navigate(role.path)}
                  className={`
                    group w-full flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 border border-white/60 shadow-sm hover:-translate-y-1 hover:shadow-md
                    ${role.containerClass}
                  `}
                  style={{ backdropFilter: 'blur(12px)' }}
                >
                  <div className={`p-3 rounded-xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon size={28} className={role.iconClass} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-text-primary text-lg">{role.label}</p>
                    <p className="text-sm text-text-secondary font-medium">{role.description}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm transition-transform duration-300 group-hover:translate-x-2`}>
                    <ArrowRight size={18} className={role.iconClass} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
