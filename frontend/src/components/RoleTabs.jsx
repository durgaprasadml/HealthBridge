import { Link, useLocation } from "react-router-dom";
import { User, Stethoscope, Building2 } from "lucide-react";

export default function RoleTabs() {
  const { pathname } = useLocation();

  const tabs = [
    { 
      label: "Patient", 
      path: "/login/patient",
      icon: User,
    },
    { 
      label: "Doctor", 
      path: "/login/doctor",
      icon: Stethoscope,
    },
    { 
      label: "Hospital", 
      path: "/login/hospital",
      icon: Building2,
    },
  ];

  return (
    <div className="flex bg-gray-100 rounded-xl p-1.5 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.path;
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`
              flex items-center justify-center gap-2 flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-white shadow-md text-primary-500"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/50"
              }`}
          >
            <Icon size={16} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}

