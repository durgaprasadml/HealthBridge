import { useEffect, useState } from "react";

function Counter({ end, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const interval = 20;
    const increment = end / (duration / interval);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, interval);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-primary">{count}+</div>
      <div className="text-gray-600 mt-1">{label}</div>
    </div>
  );
}

export default function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-16">
      <Counter end={25000} label="Users" />
      <Counter end={300} label="Hospitals" />
      <Counter end={1200} label="Doctors" />
      <Counter end={99} label="Secure Access %" />
    </div>
  );
}