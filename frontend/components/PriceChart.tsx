'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/app/lib/api';

const mockPriceHistory = [
  { time: '00:00', BTC: 45000, ETH: 2500, SOL: 180 },
  { time: '04:00', BTC: 45300, ETH: 2520, SOL: 182 },
  { time: '08:00', BTC: 44800, ETH: 2480, SOL: 175 },
  { time: '12:00', BTC: 45500, ETH: 2550, SOL: 185 },
  { time: '16:00', BTC: 45200, ETH: 2530, SOL: 183 },
  { time: '20:00', BTC: 45800, ETH: 2570, SOL: 188 },
  { time: '23:59', BTC: 45600, ETH: 2560, SOL: 186 },
];

export default function PriceChart() {
  const [data, setData] = useState(mockPriceHistory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        await api.getPrices();
        // Using mock data for now
        setData(mockPriceHistory);
      } catch (err) {
        console.error('Failed to fetch prices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">24h Price Trend</h3>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-slate-400">
          Loading...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '8px',
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Bar dataKey="BTC" fill="#3b82f6" />
            <Bar dataKey="ETH" fill="#10b981" />
            <Bar dataKey="SOL" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
