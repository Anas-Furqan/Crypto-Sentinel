'use client';

import Sidebar from '@/components/Sidebar';
import PriceChart from '@/components/PriceChart';
import { TrendingUp } from 'lucide-react';

export default function Prices() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Market Prices</h1>
          <p className="text-slate-400 mb-8">Real-time cryptocurrency prices and trends</p>

          <div className="space-y-6">
            <PriceChart />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Bitcoin', symbol: 'BTC', price: 45600, change: 2.5 },
                { name: 'Ethereum', symbol: 'ETH', price: 2560, change: 3.2 },
                { name: 'Solana', symbol: 'SOL', price: 186, change: 4.1 },
              ].map((coin, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">{coin.name}</p>
                      <p className="text-2xl font-bold text-white">${coin.price.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <TrendingUp size={24} className="text-blue-500" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500 font-semibold">+{coin.change}%</span>
                    <span className="text-slate-400">24h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
