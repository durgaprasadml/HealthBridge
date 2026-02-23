import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Building2, 
  LogOut, 
  Menu, 
  X,
  Bell,
  ChevronRight,
  Shield
} from "lucide-react";

const menuItems = {
  PATIENT: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/patient" },
    { icon: Shield, label: "Access Requests", path: "/patient" },
    { icon: Users, label: "My Records", path: "/patient/records" },
    { icon: Stethoscope, label: "Profile", path: "/patient/profile" },
  ],
  DOCTOR: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/doctor" },
    { icon: Stethoscope, label: "Add Record", path: "/doctor/add-record" },
  ],
  HOSPITAL: [
    { icon: LayoutDashboard, label: "Dashboard", path: "/hospital" },
  ],
};

export default function DashboardLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("userName") || "User";
  
  const items = menuItems[role] || menuItems.PATIENT;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-border transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">
              <Shield size={20} />
            </div>
            <span className="text-lg font-semibold text-text-primary">
              HealthBridge
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-5 py-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-50 text-primary-600 text-sm font-medium">
            {role === "PATIENT" && "Patient Portal"}
            {role === "DOCTOR" && "Doctor Portal"}
            {role === "HOSPITAL" && "Hospital Portal"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all duration-200
                  ${isActive 
                    ? "bg-primary-500 text-white shadow-md" 
                    : "text-text-secondary hover:bg-primary-50 hover:text-primary-600"
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight size={16} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{userName}</p>
              <p className="text-xs text-text-muted capitalize">{role?.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border sticky top-0 z-30">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell size={20} className="text-text-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
