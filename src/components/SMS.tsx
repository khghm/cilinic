import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { formatNumber } from '../hooks/useStore';

const SMS: React.FC = () => {
  const { smsLogs, patients, sendBulkSMS, sendSMS, getStats } = useClinic();
  const stats = getStats();
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCompose, setShowCompose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Compose form
  const [recipientType, setRecipientType] = useState('all');
  const [smsType, setSmsType] = useState<'reminder' | 'confirmation' | 'follow-up' | 'result'>('reminder');
  const [smsMessage, setSmsMessage] = useState('');
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  const filteredLogs = smsLogs.filter(log => {
    if (filterType !== 'all' && log.type !== filterType) return false;
    if (filterStatus !== 'all' && log.status !== filterStatus) return false;
    if (searchTerm && !log.patientName.includes(searchTerm) && !log.phone.includes(searchTerm)) return false;
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

  const getRecipients = () => {
    switch (recipientType) {
      case 'all': return patients.map(p => ({ phone: p.phone, name: p.name }));
      case 'has-appointment': {
        const todayApts = ['1403/10/10']; // Simplified
        return patients.filter(p => p.phone).map(p => ({ phone: p.phone, name: p.name }));
      }
      case 'selected': return selectedPatients.map(id => {
        const p = patients.find(pt => pt.id === id);
        return p ? { phone: p.phone, name: p.name } : null;
      }).filter(Boolean) as { phone: string; name: string }[];
      default: return [];
    }
  };

  const recipients = getRecipients();

  const handleSend = async () => {
    if (!smsMessage || recipients.length === 0) return;
    setSending(true);
    await sendBulkSMS(recipients, smsMessage, smsType);
    setSending(false);
    setShowCompose(false);
    setSmsMessage('');
    setSelectedPatients([]);
  };

  const handleSendSingle = async (patient: typeof patients[0]) => {
    if (!smsMessage) return;
    setSending(true);
    await sendSMS(patient.phone, smsMessage, patient.name, smsType);
    setSending(false);
    setShowCompose(false);
    setSmsMessage('');
  };

  const templates = {
    reminder: 'بیمار گرامی {name}، نوبت شما نزد دکتر ... فردا ساعت ... می‌باشد. لطفاً ۱۵ دقیقه قبل مراجعه فرمایید.\nکلینیک سلامت',
    confirmation: 'بیمار گرامی {name}، نوبت شما با موفقیت ثبت شد. تاریخ: ... ساعت: ...\nکلینیک سلامت',
    'follow-up': 'بیمار گرامی {name}، لطفاً جهت پیگیری درمان خود در اسرع وقت به کلینیک مراجعه فرمایید.\nکلینیک سلامت',
    result: 'بیمار گرامی {name}، نتیجه آزمایش‌های شما آماده است. لطفاً جهت دریافت نتیجه به کلینیک مراجعه فرمایید.\nکلینیک سلامت',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مدیریت پیامک</h2>
          <p className="text-sm text-gray-500 mt-1">مجموع {smsLogs.length} پیامک ارسال شده</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className="fas fa-paper-plane"></i>
          ارسال پیامک
        </button>
      </div>

      {/* SMS Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="fas fa-paper-plane text-blue-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">ارسال شده</p>
              <p className="text-lg font-bold text-gray-800">{formatNumber(stats.smsSent)}</p>
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
              <p className="text-lg font-bold text-gray-800">{formatNumber(stats.smsDelivered)}</p>
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
              <p className="text-lg font-bold text-gray-800">{formatNumber(stats.smsFailed)}</p>
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
              <p className="text-lg font-bold text-gray-800">
                {stats.smsSent > 0 ? ((stats.smsDelivered / stats.smsSent) * 100).toFixed(1) : '0'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'همه انواع' },
              { value: 'reminder', label: 'یادآوری' },
              { value: 'confirmation', label: 'تأیید' },
              { value: 'follow-up', label: 'پیگیری' },
              { value: 'result', label: 'نتیجه' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilterType(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === item.value ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'همه وضعیت‌ها' },
              { value: 'delivered', label: '✅ تحویل' },
              { value: 'sent', label: '📤 ارسال' },
              { value: 'failed', label: '❌ ناموفق' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilterStatus(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterStatus === item.value ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 pl-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SMS Logs */}
      <div className="space-y-3">
        {filteredLogs.length > 0 ? filteredLogs.map((log) => (
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
                {log.status === 'failed' && (
                  <button className="text-xs text-blue-500 hover:text-blue-700 mt-1">
                    <i className="fas fa-redo ml-1"></i> ارسال مجدد
                  </button>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <i className="fas fa-comment-sms text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-400">پیامکی یافت نشد</p>
          </div>
        )}
      </div>

      {/* Compose SMS Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">ارسال پیامک</h3>
              <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">گیرندگان</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">همه بیماران ({patients.length} نفر)</option>
                  <option value="has-appointment">بیماران دارای نوبت</option>
                  <option value="selected">انتخاب دستی</option>
                </select>
              </div>

              {recipientType === 'selected' && (
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-1">
                    {patients.map(p => (
                      <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-1 rounded">
                        <input
                          type="checkbox"
                          checked={selectedPatients.includes(p.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedPatients(prev => [...prev, p.id]);
                            else setSelectedPatients(prev => prev.filter(id => id !== p.id));
                          }}
                          className="w-4 h-4 text-amber-500 rounded"
                        />
                        <span>{p.name}</span>
                        <span className="text-gray-400 text-xs">({p.phone})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-gray-600 mb-1 block">نوع پیام</label>
                <select
                  value={smsType}
                  onChange={(e) => {
                    const type = e.target.value as typeof smsType;
                    setSmsType(type);
                    setSmsMessage(templates[type]);
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                >
                  <option value="reminder">یادآوری نوبت</option>
                  <option value="confirmation">تأیید نوبت</option>
                  <option value="follow-up">پیگیری درمان</option>
                  <option value="result">اطلاع‌رسانی نتیجه آزمایش</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">متن پیام</label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 h-32 resize-none"
                  placeholder="متن پیامک را وارد کنید..."
                ></textarea>
                <p className="text-xs text-gray-400 mt-1">{smsMessage.length} کاراکتر</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm text-blue-700">
                  <span><i className="fas fa-users ml-1"></i> تعداد گیرندگان:</span>
                  <strong>{formatNumber(recipients.length)} نفر</strong>
                </div>
                <div className="flex items-center justify-between text-sm text-blue-700 mt-1">
                  <span><i className="fas fa-coins ml-1"></i> هزینه تقریبی:</span>
                  <strong>{formatNumber(recipients.length * 500)} ریال</strong>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSend}
                disabled={sending || !smsMessage || recipients.length === 0}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {sending ? (
                  <><i className="fas fa-spinner fa-spin ml-2"></i> در حال ارسال...</>
                ) : (
                  <><i className="fas fa-paper-plane ml-2"></i> ارسال پیامک</>
                )}
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
