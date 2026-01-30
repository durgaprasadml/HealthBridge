export default function About() {
  return (
    <section className="bg-background py-16 px-6 md:px-20">
      <h2 className="text-3xl font-bold text-primary text-center">
        About HealthBridge
      </h2>

      <p className="text-gray-600 max-w-3xl mx-auto mt-4 text-center">
        HealthBridge is a digital healthcare identity platform that enables
        secure, fast, and paperless access to medical records across hospitals,
        clinics, labs, and doctors.
      </p>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Unified Health ID</h3>
          <p className="text-gray-600 mt-2">
            One Health ID to access records anywhere.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Secure & Private</h3>
          <p className="text-gray-600 mt-2">
            OTP-based login and encrypted data.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg">Faster Healthcare</h3>
          <p className="text-gray-600 mt-2">
            No paperwork, instant access to history.
          </p>
        </div>
      </div>
    </section>
  );
}