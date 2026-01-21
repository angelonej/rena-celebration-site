import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { AdminDashboard } from '../components/AdminDashboard';
import { NotificationSystem } from '../components/NotificationSystem';
import { QRCodeGenerator } from '../components/QRCodeGenerator';
import { ArrowLeft, LogOut, Shield, Mail, QrCode, BarChart } from 'lucide-react';
export function AdminPage() {
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'notifications' | 'qr' | 'analytics'>('dashboard');
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const tabs = [{
    id: 'dashboard' as const,
    label: 'Content Moderation',
    icon: <Shield className="w-4 h-4" />
  }, {
    id: 'notifications' as const,
    label: 'Send Invitations',
    icon: <Mail className="w-4 h-4" />
  }, {
    id: 'qr' as const,
    label: 'QR Code',
    icon: <QrCode className="w-4 h-4" />
  }, {
    id: 'analytics' as const,
    label: 'Analytics',
    icon: <BarChart className="w-4 h-4" />
  }];
  return <div className="min-h-screen bg-gradient-to-br from-[#FFF5EE] via-[var(--sunset-pink)]/20 to-[var(--sunset-gold)]/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-[var(--sunset-orange)] transition-colors font-serif">
              <ArrowLeft className="w-5 h-5" />
              Back to Memorial
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--sunset-orange)]/10 rounded-full">
                <Shield className="w-4 h-4 text-[var(--sunset-orange)]" />
                <span className="text-sm font-serif text-[var(--sunset-orange)] font-bold">
                  Admin
                </span>
              </div>
              <span className="text-sm text-gray-600 font-serif hidden sm:inline">
                {user?.name}
              </span>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-serif text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl script-font text-[var(--sunset-orange)] mb-3">
            Memorial Administration
          </h1>
          <p className="text-lg text-gray-600 font-serif">
            Manage content, send invitations, and oversee the memorial
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/50">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 rounded-lg font-serif text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[var(--sunset-orange)] text-white shadow-lg' : 'text-gray-600 hover:bg-white/50'}`}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>)}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }}>
          {activeTab === 'dashboard' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
              <AdminDashboard />
            </div>}

          {activeTab === 'notifications' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
              <NotificationSystem />
            </div>}

          {activeTab === 'qr' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
              <div className="max-w-2xl mx-auto">
                <QRCodeGenerator url={window.location.origin} title="Rena's Memorial" />
              </div>
            </div>}

          {activeTab === 'analytics' && <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/50">
              <div className="text-center py-12">
                <BarChart className="w-16 h-16 text-[var(--sunset-orange)] mx-auto mb-4" />
                <h3 className="text-2xl script-font text-[var(--sunset-orange)] mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600 font-serif mb-6">
                  Track engagement, views, and contributions
                </p>
                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="p-6 bg-white/60 rounded-xl border border-white/50">
                    <div className="text-3xl font-bold text-[var(--sunset-orange)] mb-1">
                      1,247
                    </div>
                    <div className="text-sm text-gray-600 font-serif">
                      Total Views
                    </div>
                  </div>
                  <div className="p-6 bg-white/60 rounded-xl border border-white/50">
                    <div className="text-3xl font-bold text-[var(--wildflower-purple)] mb-1">
                      89
                    </div>
                    <div className="text-sm text-gray-600 font-serif">
                      Contributors
                    </div>
                  </div>
                  <div className="p-6 bg-white/60 rounded-xl border border-white/50">
                    <div className="text-3xl font-bold text-[var(--nature-green)] mb-1">
                      342
                    </div>
                    <div className="text-sm text-gray-600 font-serif">
                      Media Items
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </motion.div>
      </main>
    </div>;
}