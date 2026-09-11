import React, { useState } from 'react';
import { ClinicProvider } from './context/ClinicContext';
import NotificationToast from './components/NotificationToast';
import Dashboard from './components/Dashboard';
import Appointments from './components/Appointments';
import Patients from './components/Patients';
import Billing from './components/Billing';
import SMS from './components/SMS';
import Reports from './components/Reports';
import Settings from './components/Settings';

type Page = 'dashboard' | 'appointments' | 'patients' | 'billing' | 'sms' | 'reports' | 'settings';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as Page, label: 'داشبورد', icon: 'fa-chart-line' },
    { id: 'appointments' as Page, label: 'نوبت‌دهی', icon: 'fa-calendar-check' },
    { id: 'patients' as Page, label: 'بیماران', icon: 'fa-users' },
    { id: 'billing' as Page, label: 'صورتحساب', icon: 'fa-file-invoice-dollar' },
    { id: 'sms' as Page, label: 'پیامک', icon: 'fa-comment-sms' },
    { id: 'reports' as Page, label: 'گزارش‌ها', icon: 'fa-chart-bar' },
    { id: 'settings' as Page, label: 'تنظیمات', icon: 'fa-gear' },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'appointments': return <Appointments />;
      case 'patients': return <Patients />;
      case 'billing': return <Billing />;
      case 'sms': return <SMS />;
      case 'reports': return <Reports />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  const today = new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <NotificationToast />
      
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        bg-gradient-to-b from-slate-800 to-slate-900 text-white
        transition-all duration-300 flex flex-col
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <i className="fas fa-heartbeat text-white text-lg"></i>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg leading-tight">ClinicPro</h1>
                <p className="text-xs text-slate-400">سیستم مدیریت کلینیک</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentPage === item.id
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <i className={`fas ${item.icon} w-5 text-center ${currentPage === item.id ? 'text-emerald-400' : ''}`}></i>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-3 border-t border-slate-700 hidden lg:block">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm"
          >
            <i className={`fas ${sidebarOpen ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            {sidebarOpen && <span>بستن منو</span>}
          </button>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium">مدیر سیستم</p>
                <p className="text-xs text-slate-400">admin@clinicpro.ir</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-4 lg:px-6 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {menuItems.find(m => m.id === currentPage)?.label}
                </h2>
                <p className="text-xs text-gray-400 hidden sm:block">{today}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                <i className="fas fa-bell text-lg"></i>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">۳</span>
              </button>
              {/* SMS Status */}
              <div className="hidden md:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-medium">
                <i className="fas fa-signal"></i>
                <span>پیامک فعال</span>
              </div>
              {/* Date */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <i className="fas fa-calendar-alt"></i>
                <span>{today}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-100 px-6 py-3 text-center">
          <p className="text-xs text-gray-400">
            سیستم مدیریت کلینیک ClinicPro | نسخه ۲.۰ | تمامی حقوق محفوظ است © ۱۴۰۳
          </p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
};

export default App;
