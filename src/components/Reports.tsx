import React, { useState } from 'react';
import { useClinic, doctors } from '../context/ClinicContext';
import { formatCurrency, formatNumber } from '../hooks/useStore';
import { useIsMobile } from '../hooks/useIsMobile';

const Reports: React.FC = () => {
  const { patients, appointments, invoices, smsLogs, getStats } = useClinic();
  const stats = getStats();
  const [reportType, setReportType] = useState<'overview' | 'appointments' | 'financial' | 'sms'>('overview');
  const isMobile = useIsMobile();

  // Appointment stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;
  const noShowAppointments = appointments.filter(a => a.status === 'no-show').length;
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
  const completionRate = totalAppointments > 0 ? ((completedAppointments / totalAppointments) * 100).toFixed(1) : '0';

  // Financial stats
  const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
  const paidRevenue = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const overdueRevenue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);
  const avgInvoice = invoices.length > 0 ? Math.round(totalRevenue / invoices.length) : 0;

  // Doctor performance
  const doctorStats = doctors.map(doc => {
    const docApts = appointments.filter(a => a.doctor === doc.name);
    const docCompleted = docApts.filter(a => a.status === 'completed').length;
    const docNoShows = docApts.filter(a => a.status === 'no-show').length;
    return {
      name: doc.name,
      department: doc.department,
      totalAppointments: docApts.length,
      completed: docCompleted,
      noShows: docNoShows,
      noShowRate: docApts.length > 0 ? ((docNoShows / docApts.length) * 100).toFixed(1) : '0',
    };
  });

  // Department stats
  const deptStats = appointments.reduce((acc, apt) => {
    if (!acc[apt.department]) acc[apt.department] = { total: 0, completed: 0, noShows: 0 };
    acc[apt.department].total++;
    if (apt.status === 'completed') acc[apt.department].completed++;
    if (apt.status === 'no-show') acc[apt.department].noShows++;
    return acc;
  }, {} as Record<string, { total: number; completed: number; noShows: number }>);

  // SMS effectiveness
  const reminderSMS = smsLogs.filter(s => s.type === 'reminder');
  const reminderDelivered = reminderSMS.filter(s => s.status === 'delivered').length;
  const reminderRate = reminderSMS.length > 0 ? ((reminderDelivered / reminderSMS.length) * 100).toFixed(1) : '0';

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: 'fa-chart-pie' },
    { id: 'appointments', label: 'نوبت‌دهی', icon: 'fa-calendar' },
    { id: 'financial', label: 'مالی', icon: 'fa-chart-line' },
    { id: 'sms', label: 'پیامک', icon: 'fa-comment-sms' },
  ];

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">گزارش‌ها و آمار</h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1">تحلیل عملکرد کلینیک</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                reportType === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className={`fas ${tab.icon}`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview */}
      {reportType === 'overview' && (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-2 md:mb-3">
                <i className="fas fa-users text-blue-500 text-lg md:text-xl"></i>
              </div>
              <p className="text-lg md:text-2xl font-bold text-gray-800">{formatNumber(stats.totalPatients)}</p>
              <p className="text-xs text-gray-500">کل بیماران</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-green-100 flex items-center justify-center mb-2 md:mb-3">
                <i className="fas fa-calendar-check text-green-500 text-lg md:text-xl"></i>
              </div>
              <p className="text-lg md:text-2xl font-bold text-gray-800">{formatNumber(totalAppointments)}</p>
              <p className="text-xs text-gray-500">کل نوبت‌ها</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-purple-100 flex items-center justify-center mb-2 md:mb-3">
                <i className="fas fa-money-bill-wave text-purple-500 text-lg md:text-xl"></i>
              </div>
              <p className="text-sm md:text-lg font-bold text-gray-800 truncate">{formatCurrency(paidRevenue)}</p>
              <p className="text-xs text-gray-500">درآمد دریافتی</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto rounded-xl bg-amber-100 flex items-center justify-center mb-2 md:mb-3">
                <i className="fas fa-comment-dots text-amber-500 text-lg md:text-xl"></i>
              </div>
              <p className="text-lg md:text-2xl font-bold text-gray-800">{formatNumber(stats.smsSent)}</p>
              <p className="text-xs text-gray-500">پیامک ارسال‌شده</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 md:p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-xs md:text-sm">نرخ تکمیل نوبت</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{completionRate}%</p>
                </div>
                <i className="fas fa-check-circle text-2xl md:text-3xl text-green-200"></i>
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-4 md:p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-xs md:text-sm">نرخ عدم مراجعه</p>
                  <p className="text-2xl md:text-3xl font-bold mt-1">{stats.noShowRate}%</p>
                </div>
                <i className="fas fa-user-xmark text-2xl md:text-3xl text-red-200"></i>
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${stats.noShowRate}%` }}></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 md:p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-xs md:text-sm">نرخ تحویل پیامک</p>
                  <p className="text-xl md:text-3xl font-bold mt-1">{stats.smsSent > 0 ? ((stats.smsDelivered / stats.smsSent) * 100).toFixed(1) : '0'}%</p>
                </div>
                <i className="fas fa-paper-plane text-2xl md:text-3xl text-blue-200"></i>
              </div>
              <div className="mt-3 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2" style={{ width: `${stats.smsSent > 0 ? (stats.smsDelivered / stats.smsSent) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3 md:mb-4">عملکرد بخش‌ها</h3>
            <div className="space-y-3">
              {Object.entries(deptStats).map(([dept, data]) => (
                <div key={dept} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm text-gray-600 sm:w-28 font-medium">{dept}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 relative overflow-hidden">
                    <div className="absolute inset-y-0 right-0 bg-green-400 rounded-full" style={{ width: `${(data.completed / data.total) * 100}%` }}></div>
                    <div className="absolute inset-y-0 bg-red-400 rounded-full" style={{ width: `${(data.noShows / data.total) * 100}%`, right: `${(data.completed / data.total) * 100}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-500 sm:w-16 text-left">{formatNumber(data.total)} نوبت</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 md:gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded"></span> تکمیل شده</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded"></span> عدم مراجعه</span>
            </div>
          </div>
        </div>
      )}

      {/* Appointments Report */}
      {reportType === 'appointments' && (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-gray-800">{formatNumber(totalAppointments)}</p>
              <p className="text-xs text-gray-500">کل</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-blue-600">{formatNumber(scheduledAppointments)}</p>
              <p className="text-xs text-gray-500">برنامه‌ریزی</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-green-600">{formatNumber(completedAppointments)}</p>
              <p className="text-xs text-gray-500">تکمیل شده</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-red-600">{formatNumber(cancelledAppointments)}</p>
              <p className="text-xs text-gray-500">لغو شده</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-4 text-center col-span-2 sm:col-span-1">
              <p className="text-xl md:text-2xl font-bold text-amber-600">{formatNumber(noShowAppointments)}</p>
              <p className="text-xs text-gray-500">عدم مراجعه</p>
            </div>
          </div>

          {/* Doctor Performance - Mobile Cards / Desktop Table */}
          {isMobile ? (
            /* Mobile Cards View */
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">عملکرد پزشکان</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {doctorStats.map((doc, i) => (
                  <div key={i} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-800">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.department}</p>
                      </div>
                      <div className="text-left">
                        <p className={`text-lg font-bold ${parseFloat(doc.noShowRate) < 10 ? 'text-green-600' : 'text-red-600'}`}>
                          {doc.noShowRate}%
                        </p>
                        <p className="text-xs text-gray-500">No-Show</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-gray-700">{formatNumber(doc.totalAppointments)}</p>
                        <p className="text-xs text-gray-500">کل</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-green-600">{formatNumber(doc.completed)}</p>
                        <p className="text-xs text-gray-500">تکمیل</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-2 text-center">
                        <p className="text-sm font-bold text-red-600">{formatNumber(doc.noShows)}</p>
                        <p className="text-xs text-gray-500">عدم مراجعه</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
          /* Desktop Table View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">عملکرد پزشکان</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">پزشک</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">بخش</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">کل نوبت‌ها</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">تکمیل شده</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">عدم مراجعه</th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">نرخ No-Show</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {doctorStats.map((doc, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">{doc.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{doc.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatNumber(doc.totalAppointments)}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{formatNumber(doc.completed)}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{formatNumber(doc.noShows)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${parseFloat(doc.noShowRate) < 10 ? 'text-green-600' : 'text-red-600'}`}>
                          {doc.noShowRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Financial Report */}
      {reportType === 'financial' && (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
              <p className="text-xs text-gray-500 mb-1">کل درآمد</p>
              <p className="text-sm md:text-lg font-bold text-gray-800 truncate">{formatCurrency(totalRevenue)}</p>
              <p className="text-xs text-gray-400">{formatNumber(invoices.length)} فاکتور</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
              <p className="text-xs text-gray-500 mb-1">دریافت شده</p>
              <p className="text-sm md:text-lg font-bold text-green-600 truncate">{formatCurrency(paidRevenue)}</p>
              <p className="text-xs text-green-500">{((paidRevenue / (totalRevenue || 1)) * 100).toFixed(0)}%</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
              <p className="text-xs text-gray-500 mb-1">در انتظار</p>
              <p className="text-sm md:text-lg font-bold text-amber-600 truncate">{formatCurrency(pendingRevenue)}</p>
              <p className="text-xs text-amber-500">{formatNumber(invoices.filter(i => i.status === 'pending').length)} فاکتور</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5">
              <p className="text-xs text-gray-500 mb-1">معوقه</p>
              <p className="text-sm md:text-lg font-bold text-red-600 truncate">{formatCurrency(overdueRevenue)}</p>
              <p className="text-xs text-red-500">{formatNumber(invoices.filter(i => i.status === 'overdue').length)} فاکتور</p>
            </div>
          </div>

          {/* Average Invoice */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">میانگین مبلغ هر فاکتور</p>
                <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1">{formatCurrency(avgInvoice)}</p>
              </div>
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-100 flex items-center justify-center">
                <i className="fas fa-calculator text-purple-500 text-lg md:text-xl"></i>
              </div>
            </div>
          </div>

          {/* Revenue by status chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="font-bold text-gray-800 mb-3 md:mb-4">توزیع درآمد بر اساس وضعیت</h3>
            <div className="flex items-center h-8 rounded-lg overflow-hidden">
              {totalRevenue > 0 && (
                <>
                  <div className="bg-green-500 h-full flex items-center justify-center text-white text-xs" style={{ width: `${(paidRevenue / totalRevenue) * 100}%` }}>
                    {((paidRevenue / totalRevenue) * 100).toFixed(0)}%
                  </div>
                  <div className="bg-amber-500 h-full flex items-center justify-center text-white text-xs" style={{ width: `${(pendingRevenue / totalRevenue) * 100}%` }}>
                    {((pendingRevenue / totalRevenue) * 100).toFixed(0)}%
                  </div>
                  <div className="bg-red-500 h-full flex items-center justify-center text-white text-xs" style={{ width: `${(overdueRevenue / totalRevenue) * 100}%` }}>
                    {((overdueRevenue / totalRevenue) * 100).toFixed(0)}%
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> پرداخت شده</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded"></span> در انتظار</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> معوقه</span>
            </div>
          </div>
        </div>
      )}

      {/* SMS Report */}
      {reportType === 'sms' && (
        <div className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <p className="text-lg md:text-2xl font-bold text-gray-800">{formatNumber(smsLogs.length)}</p>
              <p className="text-xs text-gray-500">کل پیامک‌ها</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <p className="text-lg md:text-2xl font-bold text-green-600">{formatNumber(stats.smsDelivered)}</p>
              <p className="text-xs text-gray-500">تحویل شده</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <p className="text-lg md:text-2xl font-bold text-blue-600">{formatNumber(smsLogs.filter(s => s.status === 'sent').length)}</p>
              <p className="text-xs text-gray-500">در حال ارسال</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 md:p-5 text-center">
              <p className="text-lg md:text-2xl font-bold text-red-600">{formatNumber(stats.smsFailed)}</p>
              <p className="text-xs text-gray-500">ناموفق</p>
            </div>
          </div>

          {/* SMS by type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="font-bold text-gray-800 mb-3 md:mb-4">پیامک‌ها بر اساس نوع</h3>
            <div className="space-y-3">
              {[
                { type: 'reminder', label: 'یادآوری', color: 'bg-blue-500', count: smsLogs.filter(s => s.type === 'reminder').length },
                { type: 'confirmation', label: 'تأیید', color: 'bg-green-500', count: smsLogs.filter(s => s.type === 'confirmation').length },
                { type: 'follow-up', label: 'پیگیری', color: 'bg-purple-500', count: smsLogs.filter(s => s.type === 'follow-up').length },
                { type: 'result', label: 'نتیجه', color: 'bg-amber-500', count: smsLogs.filter(s => s.type === 'result').length },
              ].map(item => (
                <div key={item.type} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-sm text-gray-600 sm:w-20 font-medium">{item.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 relative overflow-hidden">
                    <div className={`${item.color} h-full rounded-full flex items-center justify-end px-2`} style={{ width: `${smsLogs.length > 0 ? (item.count / smsLogs.length) * 100 : 0}%` }}>
                      {item.count > 0 && <span className="text-white text-xs">{formatNumber(item.count)}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reminder Effectiveness */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 md:p-6 text-white">
            <h3 className="text-base md:text-lg font-bold mb-3">📊 تأثیر یادآوری پیامکی</h3>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div>
                <p className="text-emerald-100 text-xs md:text-sm">یادآوری‌های ارسال‌شده</p>
                <p className="text-lg md:text-2xl font-bold">{formatNumber(reminderSMS.length)}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-xs md:text-sm">تحویل شده</p>
                <p className="text-lg md:text-2xl font-bold">{formatNumber(reminderDelivered)}</p>
              </div>
              <div>
                <p className="text-emerald-100 text-xs md:text-sm">نرخ تحویل</p>
                <p className="text-lg md:text-2xl font-bold">{reminderRate}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
