export default function StatsRow() {
  return (
    <section className="border-y bg-white py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        <Stat value="25,000+" label="Users" />
        <Stat value="300+" label="Hospitals" />
        <Stat value="1,200+" label="Doctors" />
        <Stat value="99%" label="Secure Access Compliance" />
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <div className="text-4xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-600 mt-2">{label}</div>
    </div>
  );
}