'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import PriceChart from '@/components/PriceChart';
import HoldingsChart from '@/components/HoldingsChart';
import RiskWidget from '@/components/RiskWidget';
import SentimentWidget from '@/components/SentimentWidget';
import PortfolioSummary from '@/components/PortfolioSummary';
import { Wallet, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { api } from '@/app/lib/api';

export default function Dashboard() {
  const [serverStatus, setServerStatus] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.health();
        setServerStatus(response.status === 200);
      } catch (err) {
        setServerStatus(false);
      }
    };

    const fetchPortfolio = async () => {
      try {
        const response = await api.getPortfolio();
        setPortfolio(response.data);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
      }
    };

    checkHealth();
    fetchPortfolio();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">
              Welcome back to CryptoSentinel • 
              <span className={`ml-2 font-semibold ${serverStatus ? 'text-green-500' : 'text-red-500'}`}>
                Backend: {serverStatus ? '🟢 Connected' : '🔴 Offline'}
              </span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Balance"
              value={`$${(portfolio?.totalValue || 0).toLocaleString()}`}
              trend="up"
              trendValue={`+${portfolio?.profitLoss || 0}%`}
              icon={<Wallet size={24} />}
            />
            <StatCard
              title="Portfolio Value"
              value={`$${(portfolio?.totalValue || 12000).toLocaleString()}`}
              icon={<BarChart3 size={24} />}
            />
            <StatCard
              title="24h Change"
              value={`+${portfolio?.profitLoss || 8.4}%`}
              trend="up"
              trendValue="Strong"
              icon={<TrendingUp size={24} />}
            />
            <StatCard
              title="Active Alerts"
              value="3"
              icon={<AlertCircle size={24} />}
            />
          </div>

          {/* Charts and Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              <PriceChart />
              <HoldingsChart />
            </div>

            {/* Right Column - Widgets */}
            <div className="space-y-6">
              <PortfolioSummary />
              <RiskWidget />
              <SentimentWidget />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Bought 0.5 BTC', time: '2 hours ago', value: '+$22,500' },
                { action: 'Sold 2.0 ETH', time: '5 hours ago', value: '-$5,000' },
                { action: 'Portfolio Rebalanced', time: '1 day ago', value: 'Completed' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                  <span className="font-semibold text-green-500">{activity.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

