import React, { useState } from 'react';
import { appointments, doctors, departments } from '../data/mockData';

const Appointments: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const filteredAppointments = appointments.filter(apt => {
    if (selectedDoctor !== 'all' && apt.doctor !== selectedDoctor) return false;
    if (selectedStatus !== 'all' && apt.status !== selectedStatus) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">برنامه‌ریزی شده</span>;
      case 'completed': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">تکمیل شده</span>;
      case 'cancelled': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">لغو شده</span>;
      case 'no-show': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">عدم مراجعه</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">مدیریت نوبت‌دهی</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          نوبت جدید
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-500 mb-1 block">پزشک</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه پزشکان</option>
              {doctors.map((doc, i) => (
                <option key={i} value={doc.name}>{doc.name} - {doc.department}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm text-gray-500 mb-1 block">وضعیت</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">همه</option>
              <option value="scheduled">برنامه‌ریزی شده</option>
              <option value="completed">تکمیل شده</option>
              <option value="cancelled">لغو شده</option>
              <option value="no-show">عدم مراجعه</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
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
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">یادآوری</th>
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
                      <span className="text-sm font-medium text-gray-700">{apt.patientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.doctor}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.time}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{apt.type}</td>
                  <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
                  <td className="px-4 py-3">
                    {apt.reminderSent ? (
                      <span className="text-green-500"><i className="fas fa-check-circle"></i></span>
                    ) : (
                      <span className="text-gray-300"><i className="fas fa-clock"></i></span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">ثبت نوبت جدید</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">نام بیمار</label>
                <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="نام بیمار را وارد کنید" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">پزشک</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    {doctors.map((doc, i) => (
                      <option key={i} value={doc.name}>{doc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">بخش</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    {departments.map((dep, i) => (
                      <option key={i} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">تاریخ</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="1403/10/15" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">ساعت</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="09:00" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">نوع ویزیت</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                  <option>ویزیت</option>
                  <option>پیگیری</option>
                  <option>مشاوره</option>
                  <option>آزمایش</option>
                  <option>فیزیوتراپی</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sendReminder" defaultChecked className="w-4 h-4 text-blue-500 rounded" />
                <label htmlFor="sendReminder" className="text-sm text-gray-600">ارسال یادآوری پیامکی</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
                ثبت نوبت
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all">
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
