export default function Footer() {
  return (
    <footer className="glass-panel mt-20 rounded-t-3xl border-t border-white/40 mx-4 sm:mx-8 lg:mx-auto max-w-7xl mb-4 relative z-10 overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -z-10"></div>
      <div className="px-8 py-14 grid md:grid-cols-3 gap-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="HealthBridge Logo" className="w-10 h-10 object-contain mix-blend-multiply drop-shadow-sm" />
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800 tracking-tight">
              HealthBridge
            </span>
          </div>
          <p className="text-gray-600 text-sm">
            Securely connect patients, doctors, and hospitals using one unified
            Health ID — with consent, transparency, and emergency readiness.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Platform</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>How It Works</li>
            <li>Features</li>
            <li>Security</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm py-6 border-t">
        © 2026 HealthBridge. All rights reserved.
      </div>
    </footer>
  );
}