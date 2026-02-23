import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue,
  color = "primary" 
}) {
  const colorClasses = {
    primary: "bg-primary-50 text-primary-500",
    success: "bg-emerald-50 text-emerald-500",
    warning: "bg-amber-50 text-amber-500",
    error: "bg-red-50 text-red-500",
    info: "bg-blue-50 text-blue-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {Icon && <Icon size={24} />}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-text-secondary font-medium">{title}</p>
        <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
      </div>
    </div>
  );
}

