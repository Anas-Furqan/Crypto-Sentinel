'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { RotateCw } from 'lucide-react';
import { api } from '@/app/lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface HoldingsChartProps {
  refreshInterval?: number;
}

export default function HoldingsChart({ refreshInterval = 30000 }: HoldingsChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await api.getPortfolio();
        const holdings = response.data.holdings || {};
        const chartData = Object.entries(holdings).map(([name, value]) => ({
          name,
          value: Number(value),
        }));
        setData(chartData);
        setError(null);
      } catch (err) {
        setError('Failed to load portfolio data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Holdings Distribution</h3>
        <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <RotateCw size={18} className="text-slate-400" />
        </button>
      </div>

      {error ? (
        <div className="h-80 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : loading || data.length === 0 ? (
        <div className="h-80 flex items-center justify-center">
          <div className="text-slate-400">Loading...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value.toFixed(2)}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${Number(value ?? 0).toFixed(2)}`}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
