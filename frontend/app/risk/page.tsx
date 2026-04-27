'use client';

import Sidebar from '@/components/Sidebar';
import RiskWidget from '@/components/RiskWidget';
import { AlertCircle } from 'lucide-react';

export default function Risk() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Risk Analysis</h1>
          <p className="text-slate-400 mb-8">Monitor and manage portfolio risk</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6">Risk Factors</h3>
                <div className="space-y-4">
                  {[
                    { factor: 'Market Volatility', level: 'High', color: 'text-red-500' },
                    { factor: 'Portfolio Concentration', level: 'Medium', color: 'text-yellow-500' },
                    { factor: 'Counterparty Risk', level: 'Low', color: 'text-green-500' },
                    { factor: 'Liquidity Risk', level: 'Low', color: 'text-green-500' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                    >
                      <span className="text-white">{item.factor}</span>
                      <span className={`font-semibold ${item.color}`}>{item.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6">Recommendations</h3>
                <ul className="space-y-3">
                  {[
                    'Diversify portfolio across more assets',
                    'Consider reducing BTC concentration',
                    'Set stop-loss orders for volatile assets',
                    'Review risk tolerance quarterly',
                  ].map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="text-blue-500 mt-1">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <RiskWidget />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
