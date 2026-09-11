import React, { useState } from 'react';
import { useClinic, doctors, departments } from '../context/ClinicContext';
import { getTodayJalali } from '../hooks/useStore';

const Appointments: React.FC = () => {
  const { appointments, patients, addAppointment, updateAppointment, deleteAppointment, sendReminder } = useClinic();
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    doctor: '',
    department: '',
    date: '',
    time: '',
    type: 'ویزیت',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'no-show',
  });

  const filteredAppointments = appointments.filter(apt => {
    if (selectedDoctor !== 'all' && apt.doctor !== selectedDoctor) return false;
    if (selectedStatus !== 'all' && apt.status !== selectedStatus) return false;
    if (selectedDept !== 'all' && apt.department !== selectedDept) return false;
    if (searchTerm && !apt.patientName.includes(searchTerm) && !apt.id.includes(searchTerm)) return false;
    return true;
  });

  const handleDoctorChange = (doctorName: string) => {
    const doc = doctors.find(d => d.name === doctorName);
    setFormData(prev => ({
      ...prev,
      doctor: doctorName,
      department: doc?.department || prev.department,
    }));
  };

  const handleSubmit = () => {
    if (!formData.patientId || !formData.doctor || !formData.date || !formData.time) {
      return;
    }
    
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    if (editingId) {
      updateAppointment(editingId, {
        ...formData,
        patientName: patient.name,
      });
    } else {
      addAppointment({
        ...formData,
        patientName: patient.name,
        reminderSent: false,
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      doctor: '',
      department: '',
      date: '',
      time: '',
      type: 'ویزیت',
      status: 'scheduled',
    });
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (apt: typeof appointments[0]) => {
    setFormData({
      patientId: apt.patientId,
      doctor: apt.doctor,
      department: apt.department,
      date: apt.date,
      time: apt.time,
      type: apt.type,
      status: apt.status,
    });
    setEditingId(apt.id);
    setShowModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">برنامه‌ریزی شده</span>;
      case 'completed': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">تکمیل شده</span>;
      case 'cancelled': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">لغو شده</span>;
      case 'no-show': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">عدم مراجعه</span>;
      default: return null;
    }
  };

  const getStatusOptions = () => {
    return [
      { value: 'scheduled', label: 'برنامه‌ریزی شده', color: 'bg-blue-500' },
      { value: 'completed', label: 'تکمیل شده', color: 'bg-green-500' },
      { value: 'cancelled', label: 'لغو شده', color: 'bg-red-500' },
      { value: 'no-show', label: 'عدم مراجعه', color: 'bg-amber-500' },
    ];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مدیریت نوبت‌دهی</h2>
          <p className="text-sm text-gray-500 mt-1">مجموع {filteredAppointments.length} نوبت</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
            className="border border-gray-200 text-gray-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all"
          >
            <i className={`fas ${viewMode === 'table' ? 'fa-th-large' : 'fa-list'}`}></i>
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            نوبت جدید
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2">
            <div className="relative">
              <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="جستجوی بیمار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه پزشکان</option>
            {doctors.map((doc, i) => (
              <option key={i} value={doc.name}>{doc.name}</option>
            ))}
          </select>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه بخش‌ها</option>
            {departments.map((dep, i) => (
              <option key={i} value={dep}>{dep}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">همه وضعیت‌ها</option>
            <option value="scheduled">برنامه‌ریزی شده</option>
            <option value="completed">تکمیل شده</option>
            <option value="cancelled">لغو شده</option>
            <option value="no-show">عدم مراجعه</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">بیمار</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">پزشک</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">بخش</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">تاریخ</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">ساعت</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">نوع</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">وضعیت</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <i className="fas fa-user text-blue-500 text-xs"></i>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700 block">{apt.patientName}</span>
                          <span className="text-xs text-gray-400">{apt.patientId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{apt.doctor}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{apt.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{apt.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 font-medium">{apt.time}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{apt.type}</td>
                    <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {apt.status === 'scheduled' && (
                          <button
                            onClick={() => sendReminder(apt.id)}
                            className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="ارسال یادآوری"
                          >
                            <i className="fas fa-bell text-xs"></i>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(apt)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ویرایش"
                        >
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('آیا از حذف این نوبت مطمئن هستید؟')) {
                              deleteAppointment(apt.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredAppointments.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-calendar-xmark text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-400">نوبتی یافت نشد</p>
            </div>
          )}
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <i className="fas fa-user text-blue-500"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{apt.patientName}</p>
                    <p className="text-xs text-gray-400">{apt.patientId}</p>
                  </div>
                </div>
                {getStatusBadge(apt.status)}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-user-doctor text-xs text-gray-400 w-4"></i>
                  <span>{apt.doctor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-hospital text-xs text-gray-400 w-4"></i>
                  <span>{apt.department}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-calendar text-xs text-gray-400 w-4"></i>
                  <span>{apt.date} - {apt.time}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <i className="fas fa-tag text-xs text-gray-400 w-4"></i>
                  <span>{apt.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                {apt.status === 'scheduled' && (
                  <button
                    onClick={() => sendReminder(apt.id)}
                    className="flex-1 text-xs bg-amber-50 text-amber-600 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <i className="fas fa-bell ml-1"></i> یادآوری
                  </button>
                )}
                <button
                  onClick={() => handleEdit(apt)}
                  className="flex-1 text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <i className="fas fa-edit ml-1"></i> ویرایش
                </button>
                <button
                  onClick={() => {
                    if (confirm('آیا از حذف مطمئن هستید؟')) deleteAppointment(apt.id);
                  }}
                  className="text-xs bg-red-50 text-red-600 p-1.5 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {editingId ? 'ویرایش نوبت' : 'ثبت نوبت جدید'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">بیمار *</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">انتخاب بیمار...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">پزشک *</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب...</option>
                    {doctors.map((doc, i) => (
                      <option key={i} value={doc.name}>{doc.name} - {doc.department}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">بخش</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب...</option>
                    {departments.map((dep, i) => (
                      <option key={i} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">تاریخ *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder="1403/10/15"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">ساعت *</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">انتخاب...</option>
                    {['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">نوع ویزیت</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option>ویزیت</option>
                    <option>پیگیری</option>
                    <option>مشاوره</option>
                    <option>آزمایش</option>
                    <option>فیزیوتراپی</option>
                    <option>نوار قلب</option>
                    <option>اکو</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">وضعیت</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {getStatusOptions().map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all"
              >
                {editingId ? 'بروزرسانی' : 'ثبت نوبت'}
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

export default Appointments;
