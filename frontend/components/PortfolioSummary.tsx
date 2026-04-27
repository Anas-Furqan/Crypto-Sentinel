'use client';

import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';
import { api } from '@/app/lib/api';

interface PortfolioProps {
  totalValue?: number;
  profitLoss?: number;
  holdings?: Record<string, number>;
}

export default function PortfolioSummary() {
  const [portfolio, setPortfolio] = useState<PortfolioProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const response = await api.getPortfolio();
        setPortfolio(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load portfolio');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error)
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 text-red-500">
        {error}
      </div>
    );

  if (loading || !portfolio)
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 text-slate-400">
        Loading...
      </div>
    );

  const isProfitable = (portfolio.profitLoss || 0) >= 0;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign size={24} className="text-green-500" />
        <h3 className="text-lg font-semibold text-white">Portfolio Summary</h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-slate-400 text-sm mb-1">Total Value</p>
          <p className="text-3xl font-bold text-white">
            ${(portfolio.totalValue || 0).toLocaleString('en-US', {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Profit / Loss</span>
            <span
              className={`font-semibold ${
                isProfitable ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {isProfitable ? '+' : ''}
              {portfolio.profitLoss?.toFixed(2)}%
            </span>
          </div>
        </div>

        {portfolio.holdings && (
          <div className="pt-4 border-t border-slate-700">
            <p className="text-slate-400 text-sm mb-3">Holdings</p>
            <div className="space-y-2">
              {Object.entries(portfolio.holdings).map(([coin, amount]) => (
                <div
                  key={coin}
                  className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg"
                >
                  <span className="font-medium">{coin}</span>
                  <span className="text-slate-300">{Number(amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
