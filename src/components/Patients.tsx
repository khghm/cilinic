import React, { useState } from 'react';
import { patients, type Patient } from '../data/mockData';

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPatients = patients.filter(p =>
    p.name.includes(searchTerm) || p.phone.includes(searchTerm) || p.nationalId.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">پرونده الکترونیک بیماران</h2>
        <button
          onClick={() => setShowAddModal(true)}
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
            placeholder="جستجو بر اساس نام، شماره تلفن یا کد ملی..."
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
            onClick={() => setSelectedPatient(patient)}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${patient.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                <i className={`fas ${patient.gender === 'male' ? 'fa-male text-blue-500' : 'fa-female text-pink-500'} text-xl`}></i>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{patient.name}</h4>
                <p className="text-xs text-gray-500">{patient.id} • {patient.age} ساله</p>
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

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">پرونده بیمار</h3>
              <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Patient Info */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${selectedPatient.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'}`}>
                  <i className={`fas ${selectedPatient.gender === 'male' ? 'fa-male text-blue-500' : 'fa-female text-pink-500'} text-2xl`}></i>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h4>
                  <p className="text-sm text-gray-500">کد بیمار: {selectedPatient.id} • کد ملی: {selectedPatient.nationalId}</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
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

            {/* Medical Notes */}
            <div className="mb-6">
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <i className="fas fa-notes-medical text-emerald-500"></i>
                سوابق پزشکی
              </h4>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">{selectedPatient.notes}</p>
              </div>
            </div>

            {/* Allergies */}
            {selectedPatient.allergies.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle text-red-500"></i>
                  حساسیت‌ها
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.allergies.map((allergy, i) => (
                    <span key={i} className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg font-medium">
                      ⚠️ {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Last Visit */}
            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <i className="fas fa-calendar-check text-blue-500"></i>
                آخرین مراجعه
              </h4>
              <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">{selectedPatient.lastVisit}</p>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
                ویرایش پرونده
              </button>
              <button className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all">
                ارسال پیامک
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">ثبت بیمار جدید</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">نام</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">کد ملی</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">تلفن</label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">سن</label>
                  <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">جنسیت</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                    <option>مرد</option>
                    <option>زن</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">گروه خونی</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">بیمه</label>
                <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                  <option>تأمین اجتماعی</option><option>سلامت</option><option>ایران</option><option>نیروهای مسلح</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">سوابق پزشکی</label>
                <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 h-20 resize-none"></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
                ثبت بیمار
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all">
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
