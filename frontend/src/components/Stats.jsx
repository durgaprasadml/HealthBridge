export default function Stats() {
  const stats = [
    { label: "Users Registered", value: "10,000+" },
    { label: "Hospitals Connected", value: "250+" },
    { label: "Doctors Onboarded", value: "1,200+" },
    { label: "Secure Records", value: "1M+" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow-md p-6 text-center"
        >
          <p className="text-2xl font-bold text-primary">{s.value}</p>
          <p className="text-sm text-gray-600 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}