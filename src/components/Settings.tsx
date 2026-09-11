import React, { useState } from 'react';
import { useClinic, doctors } from '../context/ClinicContext';
import { useLocalStorage } from '../hooks/useStore';

interface ClinicSettings {
  clinicName: string;
  phone: string;
  address: string;
  workingHours: string;
  autoReminder: boolean;
  morningReminder: boolean;
  resultNotification: boolean;
  followUpAfterNoShow: boolean;
  reminderHours: number;
}

const defaultSettings: ClinicSettings = {
  clinicName: 'کلینیک تخصصی سلامت',
  phone: '021-12345678',
  address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳',
  workingHours: 'شنبه تا چهارشنبه ۸:۰۰ - ۲۰:۰۰ | پنجشنبه ۸:۰۰ - ۱۴:۰۰',
  autoReminder: true,
  morningReminder: true,
  resultNotification: true,
  followUpAfterNoShow: true,
  reminderHours: 24,
};

const Settings: React.FC = () => {
  const { patients, appointments, invoices, smsLogs, addNotification } = useClinic();
  const [settings, setSettings] = useLocalStorage<ClinicSettings>('clinic_settings', defaultSettings);
  const [activeSection, setActiveSection] = useState('clinic');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    addNotification('تنظیمات با موفقیت ذخیره شد', 'success');
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleExportData = () => {
    const data = {
      patients,
      appointments,
      invoices,
      smsLogs,
      settings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinic-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('فایل پشتیبان دانلود شد', 'success');
  };

  const sections = [
    { id: 'clinic', label: 'اطلاعات کلینیک', icon: 'fa-hospital' },
    { id: 'sms', label: 'تنظیمات پیامک', icon: 'fa-comment-sms' },
    { id: 'doctors', label: 'پزشکان', icon: 'fa-user-doctor' },
    { id: 'data', label: 'مدیریت داده‌ها', icon: 'fa-database' },
    { id: 'about', label: 'درباره سیستم', icon: 'fa-info-circle' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800">تنظیمات سیستم</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`fas ${section.icon} w-5 text-center`}></i>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection === 'clinic' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-hospital text-blue-500"></i>
                اطلاعات کلینیک
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">نام کلینیک</label>
                  <input
                    type="text"
                    value={settings.clinicName}
                    onChange={(e) => setSettings(prev => ({ ...prev, clinicName: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">تلفن کلینیک</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">آدرس</label>
                  <input
                    type="text"
                    value={settings.address}
                    onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">ساعت کاری</label>
                  <input
                    type="text"
                    value={settings.workingHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, workingHours: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sms' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-comment-sms text-amber-500"></i>
                تنظیمات پیامک
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">یادآوری خودکار نوبت</p>
                    <p className="text-xs text-gray-500">ارسال پیامک یادآوری {settings.reminderHours} ساعت قبل از نوبت</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoReminder}
                      onChange={(e) => setSettings(prev => ({ ...prev, autoReminder: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                {settings.autoReminder && (
                  <div className="mr-8">
                    <label className="text-sm text-gray-600 mb-1 block">زمان یادآوری (ساعت قبل از نوبت)</label>
                    <input
                      type="number"
                      value={settings.reminderHours}
                      onChange={(e) => setSettings(prev => ({ ...prev, reminderHours: parseInt(e.target.value) || 24 }))}
                      className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">یادآوری صبح روز نوبت</p>
                    <p className="text-xs text-gray-500">ارسال پیامک یادآوری ساعت ۸ صبح روز نوبت</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.morningReminder}
                      onChange={(e) => setSettings(prev => ({ ...prev, morningReminder: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">اطلاع‌رسانی نتایج آزمایش</p>
                    <p className="text-xs text-gray-500">ارسال پیامک خودکار پس از آماده شدن نتایج</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.resultNotification}
                      onChange={(e) => setSettings(prev => ({ ...prev, resultNotification: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">پیگیری پس از عدم مراجعه</p>
                    <p className="text-xs text-gray-500">ارسال پیامک پیگیری به بیمارانی که مراجعه نکرده‌اند</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.followUpAfterNoShow}
                      onChange={(e) => setSettings(prev => ({ ...prev, followUpAfterNoShow: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'doctors' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-user-doctor text-emerald-500"></i>
                پزشکان فعال
              </h3>
              <div className="space-y-3">
                {doctors.map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{doc.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.department} • {doc.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">فعال</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'data' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-database text-purple-500"></i>
                  آمار داده‌ها
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-blue-700">{patients.length}</p>
                    <p className="text-xs text-blue-600">بیمار</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-green-700">{appointments.length}</p>
                    <p className="text-xs text-green-600">نوبت</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-purple-700">{invoices.length}</p>
                    <p className="text-xs text-purple-600">فاکتور</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-amber-700">{smsLogs.length}</p>
                    <p className="text-xs text-amber-600">پیامک</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">پشتیبان‌گیری و بازیابی</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-download text-blue-500"></i>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">خروجی پشتیبان (JSON)</p>
                        <p className="text-xs text-gray-500">دانلود تمام اطلاعات سیستم</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-left text-gray-400"></i>
                  </button>

                  <label className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <i className="fas fa-upload text-green-500"></i>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">بازیابی از فایل پشتیبان</p>
                        <p className="text-xs text-gray-500">بارگذاری فایل JSON</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-left text-gray-400"></i>
                    <input type="file" accept=".json" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        try {
                          const data = JSON.parse(ev.target?.result as string);
                          if (data.patients) localStorage.setItem('clinic_patients', JSON.stringify(data.patients));
                          if (data.appointments) localStorage.setItem('clinic_appointments', JSON.stringify(data.appointments));
                          if (data.invoices) localStorage.setItem('clinic_invoices', JSON.stringify(data.invoices));
                          if (data.smsLogs) localStorage.setItem('clinic_sms', JSON.stringify(data.smsLogs));
                          addNotification('داده‌ها با موفقیت بازیابی شدند', 'success');
                          setTimeout(() => window.location.reload(), 1000);
                        } catch {
                          addNotification('فایل نامعتبر است', 'error');
                        }
                      };
                      reader.readAsText(file);
                    }} />
                  </label>

                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <i className="fas fa-trash text-red-500"></i>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">بازنشانی کامل</p>
                        <p className="text-xs text-gray-500">حذف تمام داده‌ها و بازگشت به حالت اولیه</p>
                      </div>
                    </div>
                    <i className="fas fa-chevron-left text-gray-400"></i>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'about' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-500"></i>
                درباره سیستم
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4">
                    <i className="fas fa-heartbeat text-white text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">ClinicPro</h4>
                  <p className="text-sm text-gray-500 mt-1">سیستم مدیریت یکپارچه کلینیک</p>
                  <p className="text-xs text-gray-400 mt-2">نسخه ۲.۰</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">امکانات سیستم:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> نوبت‌دهی هوشمند با یادآوری خودکار</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> پرونده الکترونیک بیمار</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> صدور و مدیریت صورتحساب</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> سیستم پیامک یکپارچه</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> گزارش‌گیری و آمار</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> ذخیره‌سازی ابری (localStorage)</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> پشتیبان‌گیری و بازیابی</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-green-500"></i> رابط کاربری واکنش‌گرا</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
              <i className="fas fa-save ml-2"></i>
              ذخیره تنظیمات
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">بازنشانی کامل</h3>
            <p className="text-sm text-gray-500 mb-6">آیا مطمئن هستید؟ تمام داده‌ها حذف و به حالت اولیه بازمی‌گردد.</p>
            <div className="flex gap-3">
              <button onClick={handleResetData} className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-medium hover:bg-red-600">
                بله، حذف شود
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
