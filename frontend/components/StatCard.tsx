'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | null;
  trendValue?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl md:text-3xl font-bold text-white">{value}</h3>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold ${
                  trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend === 'up' ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {trendValue}
              </div>
            )}
          </div>
          {subtitle && <p className="text-slate-400 text-xs mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="p-3 bg-slate-700/50 rounded-lg text-blue-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
