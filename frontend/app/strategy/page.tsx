'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { api } from '@/app/lib/api';

type StrategyPayload = {
  strategy?: string;
  summary?: string;
  recommendations?: string[];
  currentAllocation?: Record<string, number>;
  targetAllocation?: Record<string, number>;
};

type SimulationPayload = {
  investmentAmount?: number;
  targetAsset?: string;
  estimatedUnits?: number;
  portfolioValueBefore?: number;
  portfolioValueAfter?: number;
  projectedAllocation?: Record<string, number>;
  summary?: string;
};

export default function StrategyPage() {
  const [mode, setMode] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [asset, setAsset] = useState('BTC');
  const [amount, setAmount] = useState(1000);
  const [strategy, setStrategy] = useState<StrategyPayload | null>(null);
  const [simulation, setSimulation] = useState<SimulationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        setLoading(true);
        const response = await api.getStrategy(mode);
        setStrategy(response.data || null);
      } catch (error) {
        console.error('Failed to load strategy data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategy();
  }, [mode]);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const response = await api.simulateStrategy({ asset, amount });
      setSimulation(response.data || null);
    } catch (error) {
      console.error('Failed to run strategy simulation', error);
    } finally {
      setSimulating(false);
    }
  };

  const currentEntries = useMemo(
    () => Object.entries(strategy?.currentAllocation || {}),
    [strategy]
  );

  const targetEntries = useMemo(
    () => Object.entries(strategy?.targetAllocation || {}),
    [strategy]
  );

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <div className="mb-8 rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl shadow-cyan-950/20">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Strategy Lab</p>
            <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">Test portfolio decisions before you trade.</h1>
            <p className="mt-4 max-w-3xl text-slate-300">
              This page turns the strategy engine into something visible: choose a risk mode, inspect the suggested allocation,
              and simulate a new investment against your current holdings.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-6">
              <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Strategy mode</h2>
                    <p className="text-sm text-slate-400">Switch between conservative, moderate, and aggressive profiles.</p>
                  </div>
                  <div className="inline-flex rounded-2xl border border-slate-700 bg-slate-800 p-1">
                    {(['conservative', 'moderate', 'aggressive'] as const).map((item) => (
                      <button
                        key={item}
                        onClick={() => setMode(item)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize ${mode === item ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {loading ? (
                    <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 text-slate-400 md:col-span-3">Loading strategy...</div>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 md:col-span-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current strategy</p>
                        <h3 className="mt-2 text-2xl font-bold text-white">{strategy?.strategy || 'Moderate'}</h3>
                        <p className="mt-2 text-sm text-slate-300">{strategy?.summary || 'Strategy insights will appear here after the engine runs.'}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-700 bg-slate-800/70 p-5 md:col-span-3">
                        <p className="mb-4 text-sm font-semibold text-white">Recommendations</p>
                        <div className="space-y-3">
                          {(strategy?.recommendations || ['Hold a diversified BTC/ETH core.', 'Use the simulator to test new capital.']).map((item) => (
                            <div key={item} className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-white">Current allocation</h3>
                  <div className="mt-4 space-y-3">
                    {currentEntries.length ? currentEntries.map(([symbol, value]) => (
                      <div key={symbol} className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>{symbol}</span>
                          <span>{(value * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-700">
                          <div className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600" style={{ width: `${Math.max(8, value * 100)}%` }} />
                        </div>
                      </div>
                    )) : <p className="text-sm text-slate-400">No allocation data yet.</p>}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-700 bg-slate-900/90 p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-white">Target allocation</h3>
                  <div className="mt-4 space-y-3">
                    {targetEntries.length ? targetEntries.map(([symbol, value]) => (
                      <div key={symbol} className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
                        <div className="flex items-center justify-between text-sm text-slate-300">
                          <span>{symbol}</span>
                          <span>{(value * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-700">
                          <div className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400" style={{ width: `${Math.max(8, value * 100)}%` }} />
                        </div>
                      </div>
                    )) : <p className="text-sm text-slate-400">No target allocation available.</p>}
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 md:p-8 shadow-xl">
                <h3 className="text-xl font-semibold text-white">Investment simulator</h3>
                <p className="mt-2 text-sm text-slate-400">Run a what-if scenario against the live portfolio.</p>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Asset</span>
                    <select value={asset} onChange={(event) => setAsset(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white">
                      <option>BTC</option>
                      <option>ETH</option>
                      <option>SOL</option>
                      <option>USDC</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Amount ($)</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(event) => setAmount(Number(event.target.value))}
                      className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                      min={1}
                    />
                  </label>

                  <button
                    onClick={handleSimulate}
                    disabled={simulating}
                    className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-950/20 disabled:opacity-60"
                  >
                    {simulating ? 'Simulating...' : 'Run simulation'}
                  </button>
                </div>

                {simulation && (
                  <div className="mt-6 space-y-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Before</p>
                        <p className="text-lg font-semibold text-white">${Number(simulation.portfolioValueBefore || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-500">After</p>
                        <p className="text-lg font-semibold text-white">${Number(simulation.portfolioValueAfter || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300">
                      {simulation.summary}
                    </div>
                    <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-sm text-slate-300">
                      Estimated units: {Number(simulation.estimatedUnits || 0).toFixed(4)} {simulation.targetAsset}
                    </div>
                    <div>
                      <p className="mb-3 text-sm font-semibold text-white">Projected allocation</p>
                      <div className="space-y-2">
                        {Object.entries(simulation.projectedAllocation || {}).map(([symbol, value]) => (
                          <div key={symbol} className="flex items-center justify-between rounded-xl bg-slate-800/70 px-4 py-2 text-sm text-slate-300">
                            <span>{symbol}</span>
                            <span>{(value * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}