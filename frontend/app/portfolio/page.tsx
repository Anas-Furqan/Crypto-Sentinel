'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import PortfolioSummary from '@/components/PortfolioSummary';
import HoldingsChart from '@/components/HoldingsChart';
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import { api } from '@/app/lib/api';

interface PortfolioData {
  totalValue?: number;
  totalInvested?: number;
  profitLoss?: number;
  holdings?: Record<string, number>;
  assetAllocation?: Record<string, number>;
  holdingsCount?: number;
  transactions?: Array<{
    type?: string;
    symbol?: string;
    quantity?: number;
    price?: number;
    timestamp?: number | string;
  }>;
}

interface PriceMap {
  [symbol: string]: number;
}

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData>({});
  const [prices, setPrices] = useState<PriceMap>({});
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [portfolioResponse, pricesResponse] = await Promise.all([
        api.getPortfolio(),
        api.getPrices(),
      ]);
      setPortfolio(portfolioResponse.data || {});
      setPrices(pricesResponse.data || {});
    } catch (error) {
      console.error('Failed to fetch portfolio data', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const executeTrade = async (side: 'buy' | 'sell') => {
    if (!amount || amount <= 0) {
      setStatus('Enter an amount greater than zero.');
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = side === 'buy'
        ? await api.buyOrder(selectedAsset, amount)
        : await api.sellOrder(selectedAsset, amount);

      setStatus(
        response.data?.message
          ? `${response.data.message}${response.data.price ? ` at $${Number(response.data.price).toLocaleString()}` : ''}`
          : `${side === 'buy' ? 'Buy' : 'Sell'} order completed.`
      );
      setAmount(0);
      await fetchData();
    } catch (error) {
      console.error(error);
      setStatus(`Unable to execute ${side} order right now.`);
    } finally {
      setSubmitting(false);
    }
  };

  const rows = useMemo(
    () =>
      Object.entries(portfolio.holdings || {}).map(([symbol, amount]) => {
        const livePrice = Number(prices[symbol] || 0);
        return {
          asset: symbol,
          amount: Number(amount),
          price: livePrice,
          value: Number(amount) * livePrice,
        };
      }),
    [portfolio.holdings, prices]
  );

  const allocationRows = useMemo(
    () => Object.entries(portfolio.assetAllocation || {}),
    [portfolio.assetAllocation]
  );

  const transactionRows = useMemo(
    () => (portfolio.transactions || []).map((transaction) => ({
      type: transaction.type || 'UNKNOWN',
      symbol: transaction.symbol || '-',
      quantity: Number(transaction.quantity || 0),
      price: Number(transaction.price || 0),
      timestamp: transaction.timestamp ? new Date(Number(transaction.timestamp) * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : '-',
    })),
    [portfolio.transactions]
  );

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8 rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-cyan-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Portfolio Manager</p>
            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Manage positions, trade, and revalue the book in real time.</h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              This page now acts like a control desk: you can place simulated buy and sell orders, inspect live holdings, and see allocation drift.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-white">Trade desk</h3>
                  <button
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200"
                  >
                    <RefreshCw size={16} /> Refresh
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Asset</span>
                    <select
                      value={selectedAsset}
                      onChange={(event) => setSelectedAsset(event.target.value)}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                    >
                      <option>BTC</option>
                      <option>ETH</option>
                      <option>SOL</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Amount</span>
                    <input
                      type="number"
                      value={amount || ''}
                      onChange={(event) => setAmount(Number(event.target.value))}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                      placeholder="0.00"
                    />
                  </label>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => executeTrade('buy')}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    <ArrowDownLeft size={18} /> Buy
                  </button>
                  <button
                    onClick={() => executeTrade('sell')}
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    <ArrowUpRight size={18} /> Sell
                  </button>
                </div>

                {status && (
                  <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-slate-200">
                    {status}
                  </div>
                )}
              </div>

              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Holdings</h3>
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
                      {rows.map((row, i) => (
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

              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Trade History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400">Type</th>
                        <th className="text-left py-3 px-4 text-slate-400">Asset</th>
                        <th className="text-right py-3 px-4 text-slate-400">Amount</th>
                        <th className="text-right py-3 px-4 text-slate-400">Price</th>
                        <th className="text-right py-3 px-4 text-slate-400">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionRows.length ? transactionRows.map((row, i) => (
                        <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                          <td className="py-3 px-4 text-white font-medium">{row.type}</td>
                          <td className="py-3 px-4 text-slate-300">{row.symbol}</td>
                          <td className="py-3 px-4 text-right text-slate-300">{row.quantity}</td>
                          <td className="py-3 px-4 text-right text-slate-300">${row.price.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-slate-300">{row.timestamp}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td className="py-4 px-4 text-slate-400" colSpan={5}>
                            No transactions yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-4">Allocation drift</h3>
                <div className="space-y-3">
                  {allocationRows.length ? allocationRows.map(([symbol, value]) => (
                    <div key={symbol} className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>{symbol}</span>
                        <span>{(value * 100).toFixed(1)}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-700">
                        <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${Math.max(8, value * 100)}%` }} />
                      </div>
                    </div>
                  )) : <p className="text-sm text-slate-400">No allocation data yet.</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <PortfolioSummary />
              <HoldingsChart />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
