'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { api } from '@/app/lib/api';

interface RiskProps {
  overallRiskLevel?: string;
  concentrationRisk?: number;
  diversificationScore?: number;
}

export default function RiskWidget() {
  const [risk, setRisk] = useState<RiskProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        setLoading(true);
        const response = await api.getRisk();
        setRisk(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load risk data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
    const interval = setInterval(fetchRisk, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'text-red-500 bg-red-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-slate-400 bg-slate-700/10';
    }
  };

  if (error)
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 text-red-500">
        {error}
      </div>
    );

  if (loading || !risk)
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 text-slate-400">
        Loading...
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle size={24} className="text-blue-500" />
        <h3 className="text-lg font-semibold text-white">Risk Analysis</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Risk Level</span>
          <span
            className={`px-3 py-1 rounded-full font-semibold text-sm ${getRiskColor(
              risk.overallRiskLevel || ''
            )}`}
          >
            {risk.overallRiskLevel || 'N/A'}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Concentration Risk</span>
            <span className="text-white font-semibold">
              {((risk.concentrationRisk || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
              style={{ width: `${(risk.concentrationRisk || 0) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">Diversification Score</span>
            <span className="text-white font-semibold">
              {((risk.diversificationScore || 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
              style={{ width: `${(risk.diversificationScore || 0) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
