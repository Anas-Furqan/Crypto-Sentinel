'use client';

import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import PortfolioSummary from '@/components/PortfolioSummary';
import { Wallet } from 'lucide-react';

export default function Portfolio() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Portfolio</h1>
          <p className="text-slate-400 mb-8">Manage your cryptocurrency holdings</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6">Buy / Sell</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Select Asset
                    </label>
                    <select className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none">
                      <option>Bitcoin (BTC)</option>
                      <option>Ethereum (ETH)</option>
                      <option>Solana (SOL)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm font-medium mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 border border-slate-600 focus:border-blue-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Buy
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                      Sell
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-6">Portfolio History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400">Asset</th>
                        <th className="text-right py-3 px-4 text-slate-400">Amount</th>
                        <th className="text-right py-3 px-4 text-slate-400">Price</th>
                        <th className="text-right py-3 px-4 text-slate-400">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { asset: 'Bitcoin', amount: 0.4, price: 45000, value: 18000 },
                        { asset: 'Ethereum', amount: 2.0, price: 2500, value: 5000 },
                        { asset: 'Solana', amount: 15.0, price: 180, value: 2700 },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                          <td className="py-3 px-4 text-white font-medium">{row.asset}</td>
                          <td className="py-3 px-4 text-right text-slate-300">{row.amount}</td>
                          <td className="py-3 px-4 text-right text-slate-300">${row.price.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-green-500 font-semibold">${row.value.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <PortfolioSummary />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
