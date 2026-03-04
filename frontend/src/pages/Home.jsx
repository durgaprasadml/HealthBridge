import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Users, FileText, Bell, ArrowRight, CheckCircle, Activity, Heart, Clock, AlertCircle } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Unified Health ID",
    description: "One ID for all your medical records across hospitals and clinics seamlessly.",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: FileText,
    title: "Digital Records",
    description: "Access your complete medical history instantly, anywhere, anytime.",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss appointments or critical medications with automated alerts.",
    color: "bg-amber-100 text-amber-600"
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is end-to-end encrypted and only accessible with your strict consent.",
    color: "bg-indigo-100 text-indigo-600"
  },
];

const stats = [
  { label: "Active Patients", value: "10,000+", icon: Heart },
  { label: "Partner Doctors", value: "500+", icon: Activity },
  { label: "Network Hospitals", value: "100+", icon: Shield },
  { label: "Stored Records", value: "50,000+", icon: FileText },
];

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      if (role === "PATIENT") navigate("/patient");
      else if (role === "DOCTOR") navigate("/doctor");
      else if (role === "HOSPITAL") navigate("/hospital");
    }
  }, [navigate]);

  return (
    <main className="bg-background min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9fa] to-white z-0"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-200/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-300/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in stagger-1">
            <div className="inline-flex items-center gap-2 bg-white border border-primary-100 shadow-sm text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-slide-up hover:border-primary-300 transition-colors cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              Next-Gen Medical Identity
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-text-primary tracking-tight">
              Your Health <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                Secured & Unified
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-text-secondary mb-10 max-w-lg leading-relaxed font-medium">
              HealthBridge connects patients, doctors, and hospitals using one universal ID. Experience complete data transparency and emergency readiness like never before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                to="/register"
                className="bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-3 text-lg active:scale-95"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary-600 border border-primary-200 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 hover:border-primary-300 transition-all flex items-center justify-center shadow-sm text-lg active:scale-95"
              >
                Sign In to Portal
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                <span>Instant OTPs</span>
              </div>
            </div>
          </div>

          {/* Right Content - Floating UI Mockup */}
          <div className="hidden lg:block relative h-full min-h-[500px] animate-fade-in stagger-2">

            {/* Main Glass Mockup Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white/70 backdrop-blur-3xl border border-white p-8 rounded-[2rem] shadow-2xl shadow-primary-500/10 z-20 hover:-translate-y-6 transition-transform duration-500 cursor-default">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-md flex items-center justify-center mb-6 p-2">
                  <img src="/logo.png" alt="HealthBridge" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-1 tracking-tight">HealthBridge</h3>
                <p className="text-primary-600 font-medium mb-6 text-sm flex items-center gap-1 justify-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  Active & Protected
                </p>
                <div className="w-full bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-xl border border-primary-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-primary-500 tracking-wider">Health ID</span>
                  <span className="font-mono font-bold text-text-primary text-lg tracking-wider">HB-29XQ</span>
                </div>
              </div>
            </div>

            {/* Floating Elements Around Main Card */}
            <div className="absolute top-[10%] right-[0%] bg-white p-4 rounded-2xl shadow-xl border border-blue-50 flex items-center gap-3 z-30 animate-slide-up hover:scale-105 transition-transform" style={{ animationDuration: '3s', animationIterationCount: 'infinite', animationDirection: 'alternate' }}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Status</p>
                <p className="text-sm font-bold text-text-primary">Records Secure</p>
              </div>
            </div>

            <div className="absolute bottom-[20%] left-[0%] bg-white p-4 rounded-2xl shadow-xl border border-emerald-50 flex items-center gap-3 z-30 animate-slide-up hover:scale-105 transition-transform" style={{ animationDuration: '4s', animationIterationCount: 'infinite', animationDirection: 'alternate-reverse' }}>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Activity size={20} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Updates</p>
                <p className="text-sm font-bold text-text-primary">Tests Synced</p>
              </div>
            </div>

            <div className="absolute top-[60%] -right-[10%] bg-white p-4 rounded-2xl shadow-xl border border-amber-50 flex items-center gap-3 z-30 animate-slide-up hover:scale-105 transition-transform" style={{ animationDuration: '3.5s', animationIterationCount: 'infinite', animationDirection: 'alternate' }}>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Reminder</p>
                <p className="text-sm font-bold text-text-primary">Dr. Smith at 2PM</p>
              </div>
            </div>

            {/* Background glowing orb for the mockup */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-primary-400 to-blue-300 rounded-full blur-[80px] opacity-40 z-10 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-border py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={index} className="text-center px-4 hover:-translate-y-1 transition-transform">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center">
                      <StatIcon size={24} className="text-primary-500" />
                    </div>
                  </div>
                  <p className="text-4xl font-extrabold text-text-primary mb-1">{stat.value}</p>
                  <p className="text-text-secondary font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 relative z-10 bg-[#F6FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-xs text-primary-600 font-bold tracking-widest uppercase mb-3">Core Platform</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 tracking-tight">
              Powerful Features for Modern Healthcare
            </h3>
            <p className="text-xl text-text-secondary font-medium">
              We've redesigned the patient-doctor interaction loop to be completely seamless, transparent, and ultra-secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-[2rem] shadow-card hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-primary-100 group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.color}`}>
                    <Icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3">
                    {feature.title}
                  </h4>
                  <p className="text-text-secondary font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="m-6 mb-24 max-w-7xl mx-auto relative overflow-hidden rounded-[3rem]">
        {/* Abstract CTA Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-900/40 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2 mix-blend-overlay"></div>

        <div className="relative z-10 py-24 px-6 text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold tracking-wide mb-6 backdrop-blur-md border border-white/30 truncate">
            ✨ Join the Healthcare Revolution
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
            Ready to Take Control of Your Health Data?
          </h2>
          <p className="text-xl text-primary-100 mb-10 font-medium">
            Join thousands of patients, doctors, and hospital administrators building a better, unified healthcare network.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 text-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
