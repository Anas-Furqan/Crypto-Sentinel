'use client';

import { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';
import { api } from '@/app/lib/api';

interface SentimentProps {
  fearGreedIndex?: number;
  status?: string;
  recommendation?: string;
}

export default function SentimentWidget() {
  const [sentiment, setSentiment] = useState<SentimentProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        setLoading(true);
        const response = await api.getSentiment();
        setSentiment(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load sentiment data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
    const interval = setInterval(fetchSentiment, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = (index: number | undefined) => {
    if (index === undefined) return '#94a3b8';
    if (index < 25) return '#ef4444';
    if (index < 45) return '#f97316';
    if (index < 55) return '#eab308';
    if (index < 75) return '#22c55e';
    return '#16a34a';
  };

  const getSentimentLabel = (index: number | undefined) => {
    if (index === undefined) return 'N/A';
    if (index < 25) return 'Extreme Fear';
    if (index < 45) return 'Fear';
    if (index < 55) return 'Neutral';
    if (index < 75) return 'Greed';
    return 'Extreme Greed';
  };

  if (error)
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 text-red-500">
        {error}
      </div>
    );

  if (loading || !sentiment)
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 text-slate-400">
        Loading...
      </div>
    );

  const fearGreedIndex = sentiment.fearGreedIndex || 50;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <Gauge size={24} className="text-purple-500" />
        <h3 className="text-lg font-semibold text-white">Market Sentiment</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="25%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="75%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#sentimentGradient)"
                strokeWidth="8"
                strokeDasharray={`${fearGreedIndex * 2.83} 283`}
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#475569"
                strokeWidth="8"
                opacity="0.5"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{fearGreedIndex}</div>
                <div className="text-xs text-slate-400">Fear/Greed</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>
            <span className="text-white font-semibold">{getSentimentLabel(fearGreedIndex)}</span>
          </div>
          {sentiment.recommendation && (
            <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
              <p className="text-sm text-slate-300">{sentiment.recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
