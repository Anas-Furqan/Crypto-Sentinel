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

interface PricePoint {
  time: string;
  BTC: number;
  ETH: number;
  SOL: number;
}

export default function PriceChart() {
  const [data, setData] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await api.getPrices();
        const prices = response.data || {};
        const now = new Date();
        const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const nextPoint: PricePoint = {
          time: timeLabel,
          BTC: Number(prices.BTC || 0),
          ETH: Number(prices.ETH || 0),
          SOL: Number(prices.SOL || 0),
        };

        setData((prev) => [...prev.slice(-23), nextPoint]);
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
              formatter={(value) => `$${Number(value ?? 0).toLocaleString()}`}
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
