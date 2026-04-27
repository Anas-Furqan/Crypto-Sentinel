'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BarChart3, Wallet, TrendingUp, AlertCircle, Settings, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { href: '/', icon: BarChart3, label: 'Dashboard', active: true },
    { href: '/portfolio', icon: Wallet, label: 'Portfolio' },
    { href: '/prices', icon: TrendingUp, label: 'Market' },
    { href: '/risk', icon: AlertCircle, label: 'Risk Analysis' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 transition-transform duration-300 z-40 w-64 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 p-6`}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white">
            CS
          </div>
          <h1 className="text-xl font-bold text-white">CryptoSentinel</h1>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-700/50'
              }`}
              onClick={() => setIsOpen(false)}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-6 left-6 right-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400">v1.0.0 • Premium Edition</p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
