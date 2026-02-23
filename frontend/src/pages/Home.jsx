import { Link } from "react-router-dom";
import { Shield, Users, FileText, Bell, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Unified Health ID",
    description: "One ID for all your medical records across hospitals and clinics",
  },
  {
    icon: FileText,
    title: "Digital Records",
    description: "Access your complete medical history instantly, anywhere",
  },
  {
    icon: Bell,
    title: "Reminders",
    description: "Never miss appointments or medications with smart reminders",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and only accessible with your consent",
  },
];

const stats = [
  { label: "Patients", value: "10,000+" },
  { label: "Doctors", value: "500+" },
  { label: "Hospitals", value: "100+" },
  { label: "Records", value: "50,000+" },
];

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-medium mb-6">
              <Shield size={16} />
              Privacy-First Healthcare Platform
            </span>

            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-text-primary">
              Digital Healthcare Identity Platform
            </h1>

            <p className="text-lg text-text-secondary mb-8 max-w-xl">
              Securely connect patients, doctors, and hospitals using one unified Health ID with consent transparency and emergency readiness.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link
                to="/signup"
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg font-medium hover:bg-primary/5 transition inline-flex items-center gap-2"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>OTP Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30">
                <div className="text-white text-center">
                  <Shield size={64} className="mx-auto mb-4" />
                  <p className="text-xl font-semibold">HealthBridge</p>
                  <p className="text-primary-100 text-sm">Your Health, Secured</p>
                </div>
              </div>
              {/* Floating Cards */}
              <div className="absolute -top-4 -right-8 bg-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={16} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Records Secure</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-8 bg-white p-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Why Choose HealthBridge?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              A modern platform designed to make healthcare accessible, secure, and efficient for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-card hover:shadow-lg transition duration-300"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of patients and doctors using HealthBridge for better healthcare.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Account
            </Link>
            <Link
              to="/emergency"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Emergency Access
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

