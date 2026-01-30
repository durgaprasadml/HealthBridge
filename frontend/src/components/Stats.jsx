export default function Stats() {
  const stats = [
    { value: "10,000+", label: "Users Registered" },
    { value: "250+", label: "Hospitals Connected" },
    { value: "1,200+", label: "Doctors Onboarded" },
    { value: "1M+", label: "Secure Records" },
  ];

  return (
    <section className="bg-white py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div
            key={i}
            className="p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-gray-600 mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}