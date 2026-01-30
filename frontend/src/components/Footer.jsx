export default function Footer() {
  return (
    <footer className="bg-primary text-white py-8 mt-auto">
      <div className="text-center">
        <h3 className="font-semibold text-lg">HealthBridge</h3>
        <p className="text-sm mt-2 opacity-80">
          Digital Healthcare Identity Platform
        </p>

        <p className="text-xs mt-4 opacity-70">
          © {new Date().getFullYear()} HealthBridge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}