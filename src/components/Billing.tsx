import React, { useState } from 'react';
import { invoices } from '../data/mockData';

const Billing: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    return true;
  });

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">پرداخت شده</span>;
      case 'pending': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">در انتظار</span>;
      case 'overdue': return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">معوقه</span>;
      default: return null;
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('fa-IR') + ' ریال';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">مدیریت صورتحساب</h2>
        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <i className="fas fa-file-invoice-dollar"></i>
          صورتحساب جدید
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <i className="fas fa-check-circle text-green-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">پرداخت شده</p>
              <p className="text-lg font-bold text-gray-800">{formatAmount(totalPaid)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <i className="fas fa-clock text-amber-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">در انتظار پرداخت</p>
              <p className="text-lg font-bold text-gray-800">{formatAmount(totalPending)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <i className="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">معوقه</p>
              <p className="text-lg font-bold text-gray-800">{formatAmount(totalOverdue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'همه' },
            { value: 'paid', label: 'پرداخت شده' },
            { value: 'pending', label: 'در انتظار' },
            { value: 'overdue', label: 'معوقه' },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilterStatus(item.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterStatus === item.value
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">شماره فاکتور</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">بیمار</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">تاریخ</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">مبلغ</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">وضعیت</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-purple-600">{invoice.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{invoice.patientName}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{invoice.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-gray-800">{formatAmount(invoice.amount)}</span>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(invoice.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-500 hover:text-blue-700 text-sm" title="مشاهده">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-green-500 hover:text-green-700 text-sm" title="چاپ">
                        <i className="fas fa-print"></i>
                      </button>
                      <button className="text-purple-500 hover:text-purple-700 text-sm" title="ارسال پیامک">
                        <i className="fas fa-comment-sms"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Items Detail */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">جزئیات آخرین فاکتور</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-purple-50">
              <tr>
                <th className="text-right px-4 py-2 text-sm font-medium text-purple-700">شرح خدمات</th>
                <th className="text-right px-4 py-2 text-sm font-medium text-purple-700">مبلغ (ریال)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices[0].items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.description}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.amount.toLocaleString('fa-IR')}</td>
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-bold text-gray-800">جمع کل</td>
                <td className="px-4 py-3 text-sm font-bold text-purple-700">{invoices[0].amount.toLocaleString('fa-IR')} ریال</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Billing;
