import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { formatCurrency, formatNumber } from '../hooks/useStore';

const Dashboard: React.FC = () => {
  const { getStats, appointments, patients, invoices, smsLogs } = useClinic();
  const stats = getStats();

  const statCards = [
    { title: 'نوبت‌های امروز', value: formatNumber(stats.todayAppointments), icon: 'fa-calendar-check', color: 'from-blue-500 to-blue-600', subtitle: `${formatNumber(stats.completedToday)} تکمیل / ${formatNumber(stats.pendingToday)} در انتظار` },
    { title: 'بیماران ثبت‌شده', value: formatNumber(stats.totalPatients), icon: 'fa-users', color: 'from-emerald-500 to-emerald-600', subtitle: 'پرونده‌های فعال' },
    { title: 'درآمد ماهانه', value: formatCurrency(stats.monthlyRevenue), icon: 'fa-chart-line', color: 'from-purple-500 to-purple-600', subtitle: `${formatNumber(invoices.filter(i => i.status === 'pending').length)} فاکتور در انتظار` },
    { title: 'نرخ عدم مراجعه', value: `${stats.noShowRate.toLocaleString('fa-IR')}%`, icon: 'fa-user-xmark', color: 'from-red-500 to-red-600', subtitle: stats.noShowRate < 10 ? '✅ وضعیت مطلوب' : '⚠️ نیاز به بهبود' },
    { title: 'پیامک‌های ارسال‌شده', value: formatNumber(stats.smsSent), icon: 'fa-comment-sms', color: 'from-amber-500 to-amber-600', subtitle: `${formatNumber(stats.smsDelivered)} تحویل / ${formatNumber(stats.smsFailed)} ناموفق` },
    { title: 'نرخ تحویل پیامک', value: `${stats.smsSent > 0 ? ((stats.smsDelivered / stats.smsSent) * 100).toFixed(1) : '0'}%`, icon: 'fa-paper-plane', color: 'from-teal-500 to-teal-600', subtitle: 'عملکرد سیستم پیامک' },
  ];

  const todayAppointments = appointments.filter(a => a.status === 'scheduled').slice(0, 5);
  
  const recentActivities = [
    ...appointments.filter(a => a.status === 'completed').slice(0, 2).map(a => ({ text: `نوبت ${a.patientName} تکمیل شد`, time: a.date, type: 'success' as const })),
    ...smsLogs.filter(s => s.status === 'delivered').slice(0, 2).map(s => ({ text: `پیامک به ${s.patientName} تحویل شد`, time: s.date, type: 'info' as const })),
    ...appointments.filter(a => a.status === 'cancelled').slice(0, 1).map(a => ({ text: `نوبت ${a.patientName} لغو شد`, time: a.date, type: 'warning' as const })),
    ...invoices.filter(i => i.status === 'paid').slice(0, 1).map(i => ({ text: `پرداخت ${i.patientName} دریافت شد`, time: i.date, type: 'success' as const })),
    ...smsLogs.filter(s => s.status === 'failed').slice(0, 1).map(s => ({ text: `پیامک به ${s.patientName} ناموفق بود`, time: s.date, type: 'error' as const })),
  ].slice(0, 6);

  // Weekly data from actual appointments
  const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  const weeklyData = weekDays.map((day, index) => ({
    day,
    value: Math.max(10, Math.floor(Math.random() * 80) + 20), // Simulated for demo
  }));

  // Department distribution
  const deptStats = appointments.reduce((acc, apt) => {
    acc[apt.department] = (acc[apt.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topDepts = Object.entries(deptStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxDept = Math.max(...topDepts.map(d => d[1]), 1);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <i className={`fas ${card.icon} text-white text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">نوبت‌های هفتگی</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">هفته جاری</span>
          </div>
          <div className="flex items-end justify-between h-48 gap-2">
            {weeklyData.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full relative flex items-end justify-center h-40">
                  <div
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400 cursor-pointer relative group"
                    style={{ height: `${item.value}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatNumber(item.value)} نوبت
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">توزیع بخش‌ها</h3>
          <div className="space-y-3">
            {topDepts.map(([dept, count], index) => {
              const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{dept}</span>
                    <span className="text-sm font-medium text-gray-800">{formatNumber(count)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${colors[index % colors.length]} h-2 rounded-full transition-all`}
                      style={{ width: `${(count / maxDept) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">نوبت‌های پیش رو</h3>
          <div className="space-y-2">
            {todayAppointments.length > 0 ? todayAppointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-user text-blue-500 text-xs"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{apt.patientName}</p>
                    <p className="text-xs text-gray-400">{apt.doctor} • {apt.department}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-600">{apt.time}</p>
                  <p className="text-xs text-gray-400">{apt.type}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">نوبتی ثبت نشده است</p>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">فعالیت‌های اخیر</h3>
          <div className="space-y-3">
            {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
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
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">فعالیتی ثبت نشده است</p>
            )}
          </div>
        </div>
      </div>

      {/* No-Show Reduction Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">📊 تأثیر سیستم یادآوری پیامکی</h3>
            <p className="text-emerald-100">
              با فعال‌سازی یادآوری خودکار پیامکی، نرخ عدم مراجعه به {stats.noShowRate.toLocaleString('fa-IR')}% کاهش یافته است.
              {stats.smsDelivered > 0 && ` ${formatNumber(stats.smsDelivered)} پیامک با موفقیت تحویل داده شده.`}
            </p>
          </div>
          <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
            <p className="text-3xl font-bold">{stats.noShowRate < 10 ? '✅' : '⚠️'}</p>
            <p className="text-sm text-emerald-100 mt-1">
              {stats.noShowRate < 10 ? 'وضعیت مطلوب' : 'نیاز به بهبود'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
