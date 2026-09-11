import React, { useState } from 'react';
import { smsLogs, stats } from '../data/mockData';

const SMS: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [showCompose, setShowCompose] = useState(false);

  const filteredLogs = smsLogs.filter(log => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    return true;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'reminder': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">یادآوری</span>;
      case 'confirmation': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">تأیید</span>;
      case 'follow-up': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">پیگیری</span>;
      case 'result': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">نتیجه</span>;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <span className="text-green-500"><i className="fas fa-check-double"></i></span>;
      case 'sent': return <span className="text-blue-500"><i className="fas fa-check"></i></span>;
      case 'failed': return <span className="text-red-500"><i className="fas fa-times-circle"></i></span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">مدیریت پیامک</h2>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className="fas fa-paper-plane"></i>
          ارسال پیامک
        </button>
      </div>

      {/* SMS Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="fas fa-paper-plane text-blue-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">ارسال شده</p>
              <p className="text-lg font-bold text-gray-800">{stats.smsSent.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <i className="fas fa-check-double text-green-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">تحویل شده</p>
              <p className="text-lg font-bold text-gray-800">{stats.smsDelivered.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <i className="fas fa-times-circle text-red-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">ناموفق</p>
              <p className="text-lg font-bold text-gray-800">{stats.smsFailed.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <i className="fas fa-chart-pie text-emerald-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">نرخ تحویل</p>
              <p className="text-lg font-bold text-gray-800">{((stats.smsDelivered / stats.smsSent) * 100).toFixed(1).replace('.', '/')}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'همه' },
            { value: 'reminder', label: 'یادآوری' },
            { value: 'confirmation', label: 'تأیید' },
            { value: 'follow-up', label: 'پیگیری' },
            { value: 'result', label: 'نتیجه' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilterType(item.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === item.value
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* SMS Logs */}
      <div className="space-y-3">
        {filteredLogs.map((log) => (
          <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  log.type === 'reminder' ? 'bg-blue-100' :
                  log.type === 'confirmation' ? 'bg-green-100' :
                  log.type === 'follow-up' ? 'bg-purple-100' :
                  'bg-amber-100'
                }`}>
                  <i className={`fas ${
                    log.type === 'reminder' ? 'fa-bell text-blue-500' :
                    log.type === 'confirmation' ? 'fa-check text-green-500' :
                    log.type === 'follow-up' ? 'fa-redo text-purple-500' :
                    'fa-flask text-amber-500'
                  }`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-gray-800 text-sm">{log.patientName}</span>
                    <span className="text-xs text-gray-400">({log.phone})</span>
                    {getTypeBadge(log.type)}
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">{log.message}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-400">{log.date}</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(log.status)}
                  <span className={`text-xs ${
                    log.status === 'delivered' ? 'text-green-600' :
                    log.status === 'sent' ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {log.status === 'delivered' ? 'تحویل شده' : log.status === 'sent' ? 'ارسال شده' : 'ناموفق'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compose SMS Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">ارسال پیامک</h3>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">گیرنده</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500">
                  <option>همه بیماران</option>
                  <option>بیماران با نوبت فردا</option>
                  <option>بیماران بدون مراجعه</option>
                  <option>بیماران خاص</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">نوع پیام</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500">
                  <option>یادآوری نوبت</option>
                  <option>تأیید نوبت</option>
                  <option>پیگیری درمان</option>
                  <option>اطلاع‌رسانی نتیجه آزمایش</option>
                  <option>پیام دلخواه</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">متن پیام</label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 h-32 resize-none"
                  placeholder="متن پیامک را وارد کنید..."
                  defaultValue="بیمار گرامی، نوبت شما نزد دکتر ... فردا ساعت ... می‌باشد. لطفاً ۱۵ دقیقه قبل مراجعه فرمایید."
                ></textarea>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <i className="fas fa-info-circle"></i>
                  <span>تعداد گیرندگان: <strong>۶ نفر</strong></span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
                <i className="fas fa-paper-plane ml-2"></i>
                ارسال پیامک
              </button>
              <button onClick={() => setShowCompose(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMS;
