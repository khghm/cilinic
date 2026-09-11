import React from 'react';
import { doctors } from '../data/mockData';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">تنظیمات سیستم</h2>

      {/* Clinic Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-hospital text-blue-500"></i>
          اطلاعات کلینیک
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">نام کلینیک</label>
            <input type="text" defaultValue="کلینیک تخصصی سلامت" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">تلفن کلینیک</label>
            <input type="text" defaultValue="021-12345678" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">آدرس</label>
            <input type="text" defaultValue="تهران، خیابان ولیعصر، پلاک ۱۲۳" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">ساعت کاری</label>
            <input type="text" defaultValue="شنبه تا چهارشنبه ۸:۰۰ - ۲۰:۰۰" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* SMS Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-comment-sms text-amber-500"></i>
          تنظیمات پیامک
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">یادآوری خودکار نوبت</p>
              <p className="text-xs text-gray-500">ارسال پیامک یادآوری ۲۴ ساعت قبل از نوبت</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">یادآوری صبح روز نوبت</p>
              <p className="text-xs text-gray-500">ارسال پیامک یادآوری ساعت ۸ صبح روز نوبت</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">اطلاع‌رسانی نتایج آزمایش</p>
              <p className="text-xs text-gray-500">ارسال پیامک خودکار پس از آماده شدن نتایج</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">پیگیری پس از عدم مراجعه</p>
              <p className="text-xs text-gray-500">ارسال پیامک پیگیری به بیمارانی که مراجعه نکرده‌اند</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Doctors */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="fas fa-user-doctor text-emerald-500"></i>
          پزشکان
        </h3>
        <div className="space-y-3">
          {doctors.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{doc.avatar}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.department}</p>
                </div>
              </div>
              <button className="text-blue-500 hover:text-blue-700 text-sm">
                <i className="fas fa-edit"></i>
              </button>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors">
          <i className="fas fa-plus ml-2"></i>
          افزودن پزشک جدید
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all">
          <i className="fas fa-save ml-2"></i>
          ذخیره تنظیمات
        </button>
      </div>
    </div>
  );
};

export default Settings;
