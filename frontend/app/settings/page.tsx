'use client';

import Sidebar from '@/components/Sidebar';
import { Bell, Lock, Moon, Volume2 } from 'lucide-react';

export default function Settings() {
  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400 mb-8">Manage your preferences and account</p>

          <div className="max-w-2xl space-y-6">
            {/* Notifications */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Bell size={24} className="text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Price Alerts', desc: 'Get notified when prices change' },
                  { label: 'Risk Warnings', desc: 'Alert when portfolio risk increases' },
                  { label: 'Daily Digest', desc: 'Receive daily market summary' },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-xs text-slate-400">{setting.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Lock size={24} className="text-green-500" />
                <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Enable 2FA for extra security' },
                  { label: 'API Keys', desc: 'Manage API access and permissions' },
                ].map((setting, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{setting.label}</p>
                      <p className="text-xs text-slate-400">{setting.desc}</p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium">
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Display */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Moon size={24} className="text-purple-500" />
                <h3 className="text-lg font-semibold text-white">Display</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-xs text-slate-400">Always on</p>
                  </div>
                  <span className="text-green-500 font-semibold">Active</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-800/10 rounded-lg p-6 border border-red-700/30">
              <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
              <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
