'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import RiskWidget from '@/components/RiskWidget';
import { AlertCircle, TriangleAlert, ShieldAlert } from 'lucide-react';
import { api } from '@/app/lib/api';

type RiskData = {
  concentrationRisk?: number;
  volatilityRisk?: number;
  diversificationScore?: number;
  overallRiskLevel?: string;
  recommendations?: string[];
  portfolioValue?: number;
  holdingsCount?: number;
};

export default function Risk() {
  const [risk, setRisk] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRisk = async () => {
      try {
        setLoading(true);
        const response = await api.getRisk();
        setRisk(response.data || null);
      } catch (error) {
        console.error('Failed to load risk data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRisk();
    const interval = setInterval(fetchRisk, 30000);
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
