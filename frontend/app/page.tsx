'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import StatCard from '@/components/StatCard';
import PriceChart from '@/components/PriceChart';
import HoldingsChart from '@/components/HoldingsChart';
import RiskWidget from '@/components/RiskWidget';
import SentimentWidget from '@/components/SentimentWidget';
import PortfolioSummary from '@/components/PortfolioSummary';
import { Wallet, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { api } from '@/app/lib/api';
import { useAuth } from './providers';

export default function Dashboard() {
  const [serverStatus, setServerStatus] = useState(false);
  const [portfolio, setPortfolio] = useState<{
    totalValue?: number;
    profitLoss?: number;
  } | null>(null);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [strategyNote, setStrategyNote] = useState('Loading strategy guidance...');
  const [sentimentNote, setSentimentNote] = useState('Loading market sentiment...');
  const [riskNote, setRiskNote] = useState('Loading risk engine...');
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const refreshDashboard = async () => {
      try {
        const [health, portfolioResponse, alertsResponse, strategyResponse, sentimentResponse, riskResponse] = await Promise.all([
          api.health(),
          api.getPortfolio(),
          api.getAlerts(),
          api.getStrategy(),
          api.getSentiment(),
          api.getRisk(),
        ]);

        setServerStatus(health.status === 200);
        setPortfolio(portfolioResponse.data);
        setUnreadAlerts(alertsResponse.data?.unreadCount || 0);
        setStrategyNote(strategyResponse.data?.recommendations?.[0] || strategyResponse.data?.summary || 'Strategy engine is online.');
        setSentimentNote(sentimentResponse.data?.recommendation || sentimentResponse.data?.status || 'Sentiment engine is online.');
        setRiskNote(riskResponse.data?.recommendations?.[0] || 'Risk engine is online.');
      } catch {
        setServerStatus(false);
      }
    };

    refreshDashboard();
    const interval = setInterval(refreshDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8 rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-cyan-950/20">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">CryptoSentinel Control Room</p>
                <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
                  {isAuthenticated && user ? `Welcome back, ${user.username}.` : 'Your crypto intelligence dashboard.'}
                </h1>
                <p className="mt-4 text-slate-300">
                  Live portfolio monitoring, risk analysis, strategy guidance, and sentiment in one operational view.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/portfolio" className="rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20">
                    Open Portfolio Manager
                  </Link>
                  <Link href="/strategy" className="rounded-2xl border border-slate-600 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-white">
                    Run Strategy Simulator
                  </Link>
                  {!isAuthenticated && (
                    <Link href="/auth" className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-200">
                      Sign in
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[340px]">
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Backend</p>
                  <p className={`mt-2 text-lg font-semibold ${serverStatus ? 'text-emerald-400' : 'text-red-400'}`}>
                    {serverStatus ? 'Connected' : 'Offline'}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Alerts</p>
                  <p className="mt-2 text-lg font-semibold text-white">{unreadAlerts} active</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Risk note</p>
                  <p className="mt-2 text-sm font-medium text-white">{riskNote}</p>
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Sentiment</p>
                  <p className="mt-2 text-sm font-medium text-white">{sentimentNote}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/70 p-4 text-sm text-slate-300">
              Strategy insight: {strategyNote}
            </div>
          </div>

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
              value={`$${(portfolio?.totalValue || 0).toLocaleString()}`}
              icon={<BarChart3 size={24} />}
            />
            <StatCard
              title="24h Change"
              value={`+${portfolio?.profitLoss || 0}%`}
              trend="up"
              trendValue="Strong"
              icon={<TrendingUp size={24} />}
            />
            <StatCard
              title="Active Alerts"
              value={String(unreadAlerts)}
              icon={<AlertCircle size={24} />}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PriceChart />
              <HoldingsChart />
            </div>

            <div className="space-y-6">
              <PortfolioSummary />
              <RiskWidget />
              <SentimentWidget />
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">What this app is doing</h3>
            <div className="grid gap-4 md:grid-cols-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="font-semibold text-white mb-2">1. Live portfolio engine</p>
                <p>Loads holdings, revalues them with live market data, and keeps P/L current.</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="font-semibold text-white mb-2">2. Risk intelligence</p>
                <p>Calculates concentration, volatility, diversification, and actionable recommendations.</p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="font-semibold text-white mb-2">3. Strategy and sentiment</p>
                <p>Turns market mood and allocation policy into a simulation-friendly decision layer.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

