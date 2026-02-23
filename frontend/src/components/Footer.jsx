export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
              🛡️
            </div>
            <span className="font-semibold text-lg">HealthBridge</span>
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