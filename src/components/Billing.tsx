import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { formatCurrency, printElement } from '../hooks/useStore';
import type { InvoiceItem } from '../data/mockData';

const Billing: React.FC = () => {
  const { invoices, patients, addInvoice, updateInvoice, deleteInvoice, markAsPaid, sendSMS } = useClinic();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    items: [{ description: '', amount: 0 }] as InvoiceItem[],
    status: 'pending' as 'paid' | 'pending' | 'overdue',
  });

  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
    if (searchTerm && !inv.patientName.includes(searchTerm) && !inv.id.includes(searchTerm)) return false;
    return true;
  });

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  const addItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { description: '', amount: 0 }] }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const totalAmount = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0);

  const handleSubmit = () => {
    if (!formData.patientId || formData.items.length === 0) return;
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    const validItems = formData.items.filter(item => item.description && item.amount > 0);
    if (validItems.length === 0) return;

    const amount = validItems.reduce((sum, item) => sum + item.amount, 0);
    const today = new Intl.DateTimeFormat('fa-IR-u-nu-latn').format(new Date()).replace(/\//g, '/');

    if (editingId) {
      updateInvoice(editingId, { items: validItems, amount, status: formData.status });
    } else {
      addInvoice({
        patientId: formData.patientId,
        patientName: patient.name,
        date: today,
        amount,
        status: formData.status,
        items: validItems,
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ patientId: '', items: [{ description: '', amount: 0 }], status: 'pending' });
    setEditingId(null);
    setShowModal(false);
  };

  const handleSendInvoiceSMS = async (invoice: typeof invoices[0]) => {
    const patient = patients.find(p => p.id === invoice.patientId);
    if (!patient) return;
    const message = `بیمار گرامی ${patient.name}، صورتحساب شما به مبلغ ${formatCurrency(invoice.amount)} صادر شده است. لطفاً جهت پرداخت مراجعه فرمایید. کد فاکتور: ${invoice.id}`;
    await sendSMS(patient.phone, message, patient.name, 'confirmation');
  };

  const invoiceDetail = selectedInvoice ? invoices.find(i => i.id === selectedInvoice) : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">مدیریت صورتحساب</h2>
          <p className="text-sm text-gray-500 mt-1">مجموع {invoices.length} فاکتور</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
        >
          <i className="fas fa-file-invoice-dollar"></i>
          صدور فاکتور
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <i className="fas fa-check-circle text-white"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">پرداخت شده</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(totalPaid)}</p>
              <p className="text-xs text-green-600">{invoices.filter(i => i.status === 'paid').length} فاکتور</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
              <i className="fas fa-clock text-white"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">در انتظار پرداخت</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(totalPending)}</p>
              <p className="text-xs text-amber-600">{invoices.filter(i => i.status === 'pending').length} فاکتور</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
              <i className="fas fa-exclamation-circle text-white"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">معوقه</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(totalOverdue)}</p>
              <p className="text-xs text-red-600">{invoices.filter(i => i.status === 'overdue').length} فاکتور</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 flex-wrap">
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
                  filterStatus === item.value ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">شماره</th>
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
                    <span className="text-sm font-bold text-gray-800">{formatCurrency(invoice.amount)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {invoice.status === 'paid' ? 'پرداخت شده' : invoice.status === 'pending' ? 'در انتظار' : 'معوقه'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedInvoice(invoice.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg" title="مشاهده">
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      {invoice.status !== 'paid' && (
                        <button onClick={() => markAsPaid(invoice.id)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg" title="تأیید پرداخت">
                          <i className="fas fa-check text-xs"></i>
                        </button>
                      )}
                      <button onClick={() => handleSendInvoiceSMS(invoice)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg" title="ارسال پیامک">
                        <i className="fas fa-comment-sms text-xs"></i>
                      </button>
                      <button onClick={() => printElement(`invoice-${invoice.id}`)} className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg" title="چاپ">
                        <i className="fas fa-print text-xs"></i>
                      </button>
                      <button onClick={() => { if (confirm('حذف فاکتور؟')) deleteInvoice(invoice.id); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="حذف">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-file-invoice text-4xl text-gray-300 mb-3"></i>
            <p className="text-gray-400">فاکتوری یافت نشد</p>
          </div>
        )}
      </div>

      {/* Hidden invoice details for printing */}
      {invoices.map(invoice => (
        <div key={invoice.id} id={`invoice-${invoice.id}`} className="hidden">
          <h2 style={{textAlign:'center',marginBottom:'20px'}}>کلینیک تخصصی سلامت</h2>
          <table>
            <thead><tr><th>شرح خدمات</th><th>مبلغ (ریال)</th></tr></thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i}><td>{item.description}</td><td>{item.amount.toLocaleString('fa-IR')}</td></tr>
              ))}
              <tr><td><strong>جمع کل</strong></td><td><strong>{invoice.amount.toLocaleString('fa-IR')} ریال</strong></td></tr>
            </tbody>
          </table>
          <p style={{marginTop:'20px',fontSize:'12px'}}>بیمار: {invoice.patientName} | تاریخ: {invoice.date} | شماره: {invoice.id}</p>
        </div>
      ))}

      {/* Invoice Detail Modal */}
      {invoiceDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">جزئیات فاکتور {invoiceDetail.id}</h3>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">بیمار:</span>
                <span className="font-medium">{invoiceDetail.patientName}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">تاریخ:</span>
                <span className="font-medium">{invoiceDetail.date}</span>
              </div>
            </div>
            <table className="w-full mb-4">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-3 py-2 text-sm font-medium text-gray-600">شرح خدمات</th>
                  <th className="text-left px-3 py-2 text-sm font-medium text-gray-600">مبلغ (ریال)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoiceDetail.items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-sm text-gray-700">{item.description}</td>
                    <td className="px-3 py-2 text-sm text-left font-medium">{item.amount.toLocaleString('fa-IR')}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-purple-50">
                  <td className="px-3 py-2 text-sm font-bold text-gray-800">جمع کل</td>
                  <td className="px-3 py-2 text-sm text-left font-bold text-purple-700">{invoiceDetail.amount.toLocaleString('fa-IR')} ریال</td>
                </tr>
              </tfoot>
            </table>
            <div className="flex gap-2">
              <button onClick={() => { printElement(`invoice-${invoiceDetail.id}`); setSelectedInvoice(null); }} className="flex-1 bg-purple-100 text-purple-700 py-2 rounded-lg text-sm font-medium hover:bg-purple-200">
                <i className="fas fa-print ml-1"></i> چاپ
              </button>
              <button onClick={() => { handleSendInvoiceSMS(invoiceDetail); setSelectedInvoice(null); }} className="flex-1 bg-amber-100 text-amber-700 py-2 rounded-lg text-sm font-medium hover:bg-amber-200">
                <i className="fas fa-comment-sms ml-1"></i> ارسال پیامک
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{editingId ? 'ویرایش فاکتور' : 'صدور فاکتور جدید'}</h3>
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
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">انتخاب بیمار...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-600 font-medium">اقلام فاکتور</label>
                  <button onClick={addItem} className="text-xs text-purple-600 hover:text-purple-700">
                    <i className="fas fa-plus ml-1"></i> افزودن
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        placeholder="شرح خدمات"
                      />
                      <input
                        type="number"
                        value={item.amount || ''}
                        onChange={(e) => updateItem(index, 'amount', parseInt(e.target.value) || 0)}
                        className="w-32 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        placeholder="مبلغ"
                      />
                      {formData.items.length > 1 && (
                        <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 p-1">
                          <i className="fas fa-times"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-left text-sm font-bold text-purple-700">
                  جمع کل: {totalAmount.toLocaleString('fa-IR')} ریال
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">وضعیت</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
                >
                  <option value="pending">در انتظار پرداخت</option>
                  <option value="paid">پرداخت شده</option>
                  <option value="overdue">معوقه</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 rounded-xl font-medium hover:shadow-lg transition-all">
                {editingId ? 'بروزرسانی' : 'صدور فاکتور'}
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

export default Billing;
