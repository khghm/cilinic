import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import type { Patient } from '../data/mockData';

const Patients: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient, sendSMS, appointments, invoices } = useClinic();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [showSMSPanel, setShowSMSPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'appointments' | 'invoices' | 'sms'>('info');

  // Form state
  const [formData, setFormData] = useState({
    name: '', phone: '', age: '', gender: 'male' as 'male' | 'female',
    nationalId: '', bloodType: 'A+', allergies: '', insurance: '', notes: '',
  });

  const [smsText, setSmsText] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.includes(searchTerm) || p.phone.includes(searchTerm) || p.nationalId.includes(searchTerm) || p.id.includes(searchTerm)
  );

  const resetForm = () => {
    setFormData({ name: '', phone: '', age: '', gender: 'male', nationalId: '', bloodType: 'A+', allergies: '', insurance: '', notes: '' });
    setEditingPatient(null);
    setShowAddModal(false);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.nationalId) return;

    if (editingPatient) {
      updatePatient(editingPatient.id, {
        name: formData.name,
        phone: formData.phone,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        nationalId: formData.nationalId,
        bloodType: formData.bloodType,
        allergies: formData.allergies.split('،').map(a => a.trim()).filter(Boolean),
        insurance: formData.insurance,
        notes: formData.notes,
      });
    } else {
      addPatient({
        name: formData.name,
        phone: formData.phone,
        age: parseInt(formData.age) || 0,
        gender: formData.gender,
        nationalId: formData.nationalId,
        bloodType: formData.bloodType,
        allergies: formData.allergies.split('،').map(a => a.trim()).filter(Boolean),
        insurance: formData.insurance,
        notes: formData.notes,
        lastVisit: '-',
      });
    }
    resetForm();
  };

  const handleEdit = (patient: Patient) => {
    setFormData({
      name: patient.name,
      phone: patient.phone,
      age: patient.age.toString(),
      gender: patient.gender,
      nationalId: patient.nationalId,
      bloodType: patient.bloodType,
      allergies: patient.allergies.join('، '),
      insurance: patient.insurance,
      notes: patient.notes,
    });
    setEditingPatient(patient);
    setShowAddModal(true);
  };

  const handleSendSMS = async () => {
    if (!selectedPatient || !smsText) return;
    await sendSMS(selectedPatient.phone, smsText, selectedPatient.name, 'follow-up');
    setSmsText('');
    setShowSMSPanel(false);
  };

  const patientAppointments = selectedPatient ? appointments.filter(a => a.patientId === selectedPatient.id) : [];
  const patientInvoices = selectedPatient ? invoices.filter(i => i.patientId === selectedPatient.id) : [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">پرونده الکترونیک بیماران</h2>
          <p className="text-sm text-gray-500 mt-1">مجموع {patients.length} بیمار ثبت‌شده</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className="fas fa-user-plus"></i>
          بیمار جدید
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="جستجو بر اساس نام، شماره تلفن، کد ملی یا کد بیمار..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => { setSelectedPatient(patient); setActiveTab('info'); }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${patient.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                <i className={`fas ${patient.gender === 'male' ? 'fa-male text-blue-500' : 'fa-female text-pink-500'} text-xl`}></i>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{patient.name}</h4>
                <p className="text-xs text-gray-500">{patient.id} • {patient.age} ساله</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(patient); }}
                  className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="ویرایش"
                >
                  <i className="fas fa-edit text-xs"></i>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`آیا از حذف ${patient.name} مطمئن هستید؟`)) {
                      deletePatient(patient.id);
                    }
                  }}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="حذف"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <i className="fas fa-phone text-xs text-gray-400 w-4"></i>
                <span className="text-xs">{patient.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <i className="fas fa-droplet text-xs text-gray-400 w-4"></i>
                <span className="text-xs">گروه خونی: {patient.bloodType}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <i className="fas fa-shield-halved text-xs text-gray-400 w-4"></i>
                <span className="text-xs">{patient.insurance}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <i className="fas fa-calendar text-xs text-gray-400 w-4"></i>
                <span className="text-xs">آخرین مراجعه: {patient.lastVisit}</span>
              </div>
            </div>
            {patient.allergies.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, i) => (
                    <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">
                      ⚠️ {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <i className="fas fa-users text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-400">بیماری یافت نشد</p>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-white/20`}>
                    <i className={`fas ${selectedPatient.gender === 'male' ? 'fa-male' : 'fa-female'} text-2xl`}></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                    <p className="text-emerald-100 text-sm">کد: {selectedPatient.id} • کد ملی: {selectedPatient.nationalId} • {selectedPatient.age} ساله</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSMSPanel(true)}
                    className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <i className="fas fa-comment-sms ml-1"></i> پیامک
                  </button>
                  <button onClick={() => setSelectedPatient(null)} className="text-white/70 hover:text-white">
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 mt-4">
                {[
                  { id: 'info', label: 'اطلاعات', icon: 'fa-info-circle' },
                  { id: 'appointments', label: `نوبت‌ها (${patientAppointments.length})`, icon: 'fa-calendar' },
                  { id: 'invoices', label: `فاکتورها (${patientInvoices.length})`, icon: 'fa-file-invoice' },
                  { id: 'sms', label: 'پیامک‌ها', icon: 'fa-comment' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      activeTab === tab.id ? 'bg-white text-emerald-700 font-medium' : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <i className={`fas ${tab.icon} ml-1`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">سن</p>
                      <p className="font-medium text-gray-700">{selectedPatient.age} سال</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">گروه خونی</p>
                      <p className="font-medium text-gray-700">{selectedPatient.bloodType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">تلفن</p>
                      <p className="font-medium text-gray-700">{selectedPatient.phone}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">بیمه</p>
                      <p className="font-medium text-gray-700">{selectedPatient.insurance}</p>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                      <i className="fas fa-notes-medical"></i> سوابق پزشکی
                    </h4>
                    <p className="text-sm text-amber-700">{selectedPatient.notes || 'سابقه‌ای ثبت نشده'}</p>
                  </div>
                  {selectedPatient.allergies.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i> حساسیت‌ها
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies.map((allergy, i) => (
                          <span key={i} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg font-medium">⚠️ {allergy}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'appointments' && (
                <div className="space-y-2">
                  {patientAppointments.length > 0 ? patientAppointments.map(apt => (
                    <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{apt.doctor} - {apt.department}</p>
                        <p className="text-xs text-gray-500">{apt.date} ساعت {apt.time} • {apt.type}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {apt.status === 'completed' ? 'تکمیل' : apt.status === 'scheduled' ? 'برنامه‌ریزی' : apt.status === 'cancelled' ? 'لغو' : 'عدم مراجعه'}
                      </span>
                    </div>
                  )) : <p className="text-sm text-gray-400 text-center py-4">نوبتی ثبت نشده</p>}
                </div>
              )}

              {activeTab === 'invoices' && (
                <div className="space-y-2">
                  {patientInvoices.length > 0 ? patientInvoices.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{inv.id}</p>
                        <p className="text-xs text-gray-500">{inv.date} • {inv.items.length} مورد خدمات</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-800">{inv.amount.toLocaleString('fa-IR')} ریال</p>
                        <span className={`text-xs ${inv.status === 'paid' ? 'text-green-600' : inv.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
                          {inv.status === 'paid' ? 'پرداخت شده' : inv.status === 'pending' ? 'در انتظار' : 'معوقه'}
                        </span>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-400 text-center py-4">فاکتوری ثبت نشده</p>}
                </div>
              )}

              {activeTab === 'sms' && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">ارسال پیامک مستقیم به بیمار:</p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <textarea
                      value={smsText}
                      onChange={(e) => setSmsText(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="متن پیامک را وارد کنید..."
                    ></textarea>
                    <button
                      onClick={handleSendSMS}
                      disabled={!smsText}
                      className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <i className="fas fa-paper-plane ml-1"></i> ارسال پیامک
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingPatient ? 'ویرایش اطلاعات بیمار' : 'ثبت بیمار جدید'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">نام و نام خانوادگی *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="نام بیمار" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">کد ملی *</label>
                  <input type="text" value={formData.nationalId} onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="کد ملی ۱۰ رقمی" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">تلفن همراه *</label>
                  <input type="text" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="09xxxxxxxxx" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">سن</label>
                  <input type="number" value={formData.age} onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">جنسیت</label>
                  <select value={formData.gender} onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                    <option value="male">مرد</option>
                    <option value="female">زن</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">گروه خونی</label>
                  <select value={formData.bloodType} onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                    {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bt => <option key={bt}>{bt}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">بیمه</label>
                <select value={formData.insurance} onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                  <option value="">انتخاب...</option>
                  <option>تأمین اجتماعی</option><option>سلامت</option><option>ایران</option><option>نیروهای مسلح</option><option>بدون بیمه</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">حساسیت‌ها (با کاما جدا کنید)</label>
                <input type="text" value={formData.allergies} onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="پنی‌سیلین، آسپرین" />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">سوابق پزشکی</label>
                <textarea value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 h-20 resize-none" placeholder="سوابق بیماری، داروهای مصرفی و..."></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
                {editingPatient ? 'بروزرسانی' : 'ثبت بیمار'}
              </button>
              <button onClick={resetForm} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all">
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
