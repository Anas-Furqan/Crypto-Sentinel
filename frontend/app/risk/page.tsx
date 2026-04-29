'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import RiskWidget from '@/components/RiskWidget';
import { AlertCircle, TriangleAlert, ShieldAlert, RefreshCw } from 'lucide-react';
import { api } from '@/app/lib/api';

type RiskData = {
  concentrationRisk?: number;
  volatilityRisk?: number;
  diversificationScore?: number;
  overallRiskLevel?: string;
  recommendations?: string[];
  portfolioValue?: number;
  holdingsCount?: number;
  predictions?: Array<{
    symbol?: string;
    currentPrice?: number;
    quantity?: number;
    positionValue?: number;
    dailyVolatilityPct?: number;
    bands?: Array<{
      horizonDays?: number;
      expectedMovePct?: number;
      oneSigma?: {
        priceLow?: number;
        priceHigh?: number;
        valueLow?: number;
        valueHigh?: number;
      };
      twoSigma?: {
        priceLow?: number;
        priceHigh?: number;
        valueLow?: number;
        valueHigh?: number;
      };
    }>;
  }>;
};

export default function Risk() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchRisk = async (manual = false) => {
    try {
      if (manual) {
        setRunning(true);
      } else {
        setLoading(true);
      }
      const response = await api.getRisk();
      setRisk(response.data || null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to load risk data', error);
    } finally {
      setLoading(false);
      setRunning(false);
    }
  };

  useEffect(() => {
    fetchRisk();
    const interval = setInterval(() => {
      fetchRisk();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8 rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-cyan-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Risk Intelligence</p>
            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Understand why the portfolio is risky, not just what the score is.</h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              This view turns the backend risk engine into an explanation layer with concentration, volatility, and diversification breakdowns.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => fetchRisk(true)}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 disabled:opacity-60"
              >
                <RefreshCw size={16} className={running ? 'animate-spin' : ''} />
                {running ? 'Running analysis...' : 'Run Risk Analysis'}
              </button>
              <p className="text-xs text-slate-400">
                Auto-refresh: 30s {lastUpdated ? `| Last update: ${lastUpdated}` : ''}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Risk level</p>
                  <p className="mt-2 text-2xl font-bold text-white">{loading ? 'Loading...' : risk?.overallRiskLevel || 'N/A'}</p>
                </div>
                <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Portfolio value</p>
                  <p className="mt-2 text-2xl font-bold text-white">${Number(risk?.portfolioValue || 0).toLocaleString()}</p>
                </div>
                <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Holdings</p>
                  <p className="mt-2 text-2xl font-bold text-white">{risk?.holdingsCount || 0}</p>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Risk breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Concentration risk', value: risk?.concentrationRisk || 0, tone: 'from-red-500 to-orange-500' },
                    { label: 'Volatility risk', value: risk?.volatilityRisk || 0, tone: 'from-yellow-500 to-orange-400' },
                    { label: 'Diversification score', value: risk?.diversificationScore || 0, tone: 'from-emerald-500 to-cyan-500' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
                      <div className="flex items-center justify-between text-sm text-slate-300">
                        <span>{item.label}</span>
                        <span>{(item.value * 100).toFixed(1)}%</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-slate-700">
                        <div className={`h-2 rounded-full bg-gradient-to-r ${item.tone}`} style={{ width: `${Math.max(8, item.value * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Recommendations</h3>
                <div className="space-y-3">
                  {(risk?.recommendations || ['Diversify across more assets.', 'Reduce concentration in the largest position.', 'Review exposure regularly.']).map((rec) => (
                    <div key={rec} className="flex items-start gap-3 rounded-2xl border border-slate-700 bg-slate-800/70 p-4 text-slate-300">
                      <TriangleAlert className="mt-0.5 text-amber-400" size={18} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-6">Multi-horizon predictions (1d / 7d / 30d)</h3>
                <div className="space-y-3">
                  {(risk?.predictions || []).length ? (risk?.predictions || []).map((item) => (
                    <div key={item.symbol} className="rounded-2xl border border-slate-700 bg-slate-800/70 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <span className="font-semibold text-white">{item.symbol}</span>
                        <span className="text-slate-300">Daily volatility proxy: {Number(item.dailyVolatilityPct || 0).toFixed(2)}%</span>
                      </div>

                      <div className="mt-3 space-y-2">
                        {(item.bands || []).map((band) => (
                          <div key={`${item.symbol}-${band.horizonDays}`} className="rounded-xl border border-slate-700/70 bg-slate-900/50 p-3 text-xs text-slate-300">
                            <p className="font-semibold text-slate-200">
                              {band.horizonDays}d expected move: ±{Number(band.expectedMovePct || 0).toFixed(2)}%
                            </p>
                            <p className="mt-1">
                              68% band: ${Number(band.oneSigma?.priceLow || 0).toLocaleString()} - ${Number(band.oneSigma?.priceHigh || 0).toLocaleString()} | value ${Number(band.oneSigma?.valueLow || 0).toLocaleString()} - ${Number(band.oneSigma?.valueHigh || 0).toLocaleString()}
                            </p>
                            <p>
                              95% band: ${Number(band.twoSigma?.priceLow || 0).toLocaleString()} - ${Number(band.twoSigma?.priceHigh || 0).toLocaleString()} | value ${Number(band.twoSigma?.valueLow || 0).toLocaleString()} - ${Number(band.twoSigma?.valueHigh || 0).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-400">Run analysis to generate live multi-horizon bands.</p>
                  )}
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-5">
                  <ShieldAlert size={24} className="text-blue-500" />
                  <h3 className="text-lg font-semibold text-white">Live risk widget</h3>
                </div>
                <RiskWidget />
              </div>

              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle size={22} className="text-cyan-400" />
                  <h3 className="text-lg font-semibold text-white">How to read this page</h3>
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  High concentration means too much of the book depends on one asset. High volatility means the portfolio can move sharply.
                  The diversification score shows how many distinct positions are balancing the book.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
