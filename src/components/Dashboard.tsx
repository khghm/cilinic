import React from 'react';
import { stats } from '../data/mockData';

const Dashboard: React.FC = () => {
  const statCards = [
    { title: 'نوبت‌های امروز', value: stats.todayAppointments, icon: 'fa-calendar-check', color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
    { title: 'بیماران فعال', value: stats.totalPatients.toLocaleString('fa-IR'), icon: 'fa-users', color: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50' },
    { title: 'درآمد ماهانه', value: `${(stats.monthlyRevenue / 1000000).toLocaleString('fa-IR')}M`, icon: 'fa-chart-line', color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50' },
    { title: 'نرخ عدم مراجعه', value: `${stats.noShowRate.toLocaleString('fa-IR')}%`, icon: 'fa-user-xmark', color: 'from-red-500 to-red-600', bgLight: 'bg-red-50' },
    { title: 'پیامک‌های ارسال‌شده', value: stats.smsSent.toLocaleString('fa-IR'), icon: 'fa-comment-sms', color: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50' },
    { title: 'نرخ تحویل پیامک', value: `${((stats.smsDelivered / stats.smsSent) * 100).toFixed(1).replace('.', '/')}%`, icon: 'fa-paper-plane', color: 'from-teal-500 to-teal-600', bgLight: 'bg-teal-50' },
  ];

  const recentActivities = [
    { text: 'نوبت علی محمدی تکمیل شد', time: '۱۰ دقیقه پیش', type: 'success' },
    { text: 'یادآوری پیامکی برای ۶ بیمار ارسال شد', time: '۳۰ دقیقه پیش', type: 'info' },
    { text: 'نوبت زهرا نوری لغو شد', time: '۱ ساعت پیش', type: 'warning' },
    { text: 'صورتحساب جدید برای رضا کریمی صادر شد', time: '۲ ساعت پیش', type: 'info' },
    { text: 'پرونده جدید برای سارا جعفری ایجاد شد', time: '۳ ساعت پیش', type: 'success' },
    { text: 'پیامک به رضا کریمی ارسال نشد', time: '۴ ساعت پیش', type: 'error' },
  ];

  const weeklyChart = [
    { day: 'شنبه', value: 65 },
    { day: 'یکشنبه', value: 80 },
    { day: 'دوشنبه', value: 45 },
    { day: 'سه‌شنبه', value: 90 },
    { day: 'چهارشنبه', value: 70 },
    { day: 'پنجشنبه', value: 55 },
    { day: 'جمعه', value: 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <i className={`fas ${card.icon} text-white text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">نوبت‌های هفتگی</h3>
          <div className="flex items-end justify-between h-48 gap-2">
            {weeklyChart.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full relative flex items-end justify-center h-40">
                  <div
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400"
                    style={{ height: `${item.value}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">فعالیت‌های اخیر</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-amber-500' :
                  activity.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* No-Show Reduction Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">📊 کاهش نرخ عدم مراجعه</h3>
            <p className="text-emerald-100">با ارسال یادآوری خودکار پیامکی، نرخ عدم مراجعه از ۱۵% به ۸.۵% کاهش یافته است.</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">-۴۳%</p>
            <p className="text-sm text-emerald-100">بهبود</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
