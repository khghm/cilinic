import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useLocalStorage, useNotifications, getTodayJalali, generateId, simulateSMS } from '../hooks/useStore';
import type { Patient, Appointment, Invoice, InvoiceItem, SMSLog } from '../data/mockData';

// Initial data
const initialPatients: Patient[] = [
  { id: 'P001', name: 'علی محمدی', phone: '09121234567', age: 35, gender: 'male', nationalId: '0012345678', lastVisit: '1403/09/15', notes: 'فشار خون بالا - تحت درمان با آملودیپین ۵ میلی‌گرم', bloodType: 'A+', allergies: ['پنی‌سیلین'], insurance: 'تأمین اجتماعی' },
  { id: 'P002', name: 'فاطمه احمدی', phone: '09131234567', age: 28, gender: 'female', nationalId: '0023456789', lastVisit: '1403/09/18', notes: 'دیابت نوع ۲ - HbA1c: 7.2', bloodType: 'B+', allergies: [], insurance: 'سلامت' },
  { id: 'P003', name: 'رضا کریمی', phone: '09141234567', age: 45, gender: 'male', nationalId: '0034567890', lastVisit: '1403/09/20', notes: 'آرتروز زانو - نیاز به فیزیوتراپی', bloodType: 'O+', allergies: ['آسپرین'], insurance: 'تأمین اجتماعی' },
  { id: 'P004', name: 'مریم حسینی', phone: '09151234567', age: 52, gender: 'female', nationalId: '0045678901', lastVisit: '1403/09/22', notes: 'کم‌خونی فقر آهن - ferritin: 8', bloodType: 'AB+', allergies: [], insurance: 'ایران' },
  { id: 'P005', name: 'حسن رضایی', phone: '09161234567', age: 60, gender: 'male', nationalId: '0056789012', lastVisit: '1403/09/25', notes: 'بیماری قلبی ایسکمیک - EF: 45%', bloodType: 'A-', allergies: ['سولفا'], insurance: 'تأمین اجتماعی' },
  { id: 'P006', name: 'زهرا نوری', phone: '09171234567', age: 33, gender: 'female', nationalId: '0067890123', lastVisit: '1403/09/28', notes: 'میگرن مزمن - حملات ۳ بار در ماه', bloodType: 'B-', allergies: [], insurance: 'سلامت' },
  { id: 'P007', name: 'محمد عباسی', phone: '09181234567', age: 41, gender: 'male', nationalId: '0078901234', lastVisit: '1403/10/01', notes: 'دیسک کمر L4-L5 - تحت فیزیوتراپی', bloodType: 'O-', allergies: ['ایبوپروفن'], insurance: 'نیروهای مسلح' },
  { id: 'P008', name: 'سارا جعفری', phone: '09191234567', age: 25, gender: 'female', nationalId: '0089012345', lastVisit: '1403/10/03', notes: 'آسم خفیف - FEV1: 85%', bloodType: 'A+', allergies: ['گرد و غبار'], insurance: 'تأمین اجتماعی' },
];

const initialAppointments: Appointment[] = [
  { id: 'A001', patientId: 'P001', patientName: 'علی محمدی', doctor: 'دکتر صادقی', department: 'قلب و عروق', date: '1403/10/10', time: '09:00', status: 'scheduled', type: 'ویزیت', reminderSent: true },
  { id: 'A002', patientId: 'P002', patientName: 'فاطمه احمدی', doctor: 'دکتر موسوی', department: 'غدد', date: '1403/10/10', time: '09:30', status: 'scheduled', type: 'پیگیری', reminderSent: true },
  { id: 'A003', patientId: 'P003', patientName: 'رضا کریمی', doctor: 'دکتر رحیمی', department: 'ارتوپدی', date: '1403/10/10', time: '10:00', status: 'scheduled', type: 'ویزیت', reminderSent: false },
  { id: 'A004', patientId: 'P004', patientName: 'مریم حسینی', doctor: 'دکتر صادقی', department: 'قلب و عروق', date: '1403/10/10', time: '10:30', status: 'completed', type: 'ویزیت', reminderSent: true },
  { id: 'A005', patientId: 'P005', patientName: 'حسن رضایی', doctor: 'دکتر صادقی', department: 'قلب و عروق', date: '1403/10/10', time: '11:00', status: 'scheduled', type: 'مشاوره', reminderSent: true },
  { id: 'A006', patientId: 'P006', patientName: 'زهرا نوری', doctor: 'دکتر کاظمی', department: 'مغز و اعصاب', date: '1403/10/10', time: '11:30', status: 'cancelled', type: 'ویزیت', reminderSent: true },
  { id: 'A007', patientId: 'P007', patientName: 'محمد عباسی', doctor: 'دکتر رحیمی', department: 'ارتوپدی', date: '1403/10/10', time: '14:00', status: 'scheduled', type: 'فیزیوتراپی', reminderSent: false },
  { id: 'A008', patientId: 'P008', patientName: 'سارا جعفری', doctor: 'دکتر امینی', department: 'ریه', date: '1403/10/10', time: '14:30', status: 'scheduled', type: 'ویزیت', reminderSent: true },
  { id: 'A009', patientId: 'P001', patientName: 'علی محمدی', doctor: 'دکتر صادقی', department: 'قلب و عروق', date: '1403/10/09', time: '09:00', status: 'completed', type: 'ویزیت', reminderSent: true },
  { id: 'A010', patientId: 'P003', patientName: 'رضا کریمی', doctor: 'دکتر رحیمی', department: 'ارتوپدی', date: '1403/10/09', time: '10:00', status: 'no-show', type: 'ویزیت', reminderSent: false },
  { id: 'A011', patientId: 'P002', patientName: 'فاطمه احمدی', doctor: 'دکتر موسوی', department: 'غدد', date: '1403/10/11', time: '09:00', status: 'scheduled', type: 'آزمایش', reminderSent: true },
  { id: 'A012', patientId: 'P005', patientName: 'حسن رضایی', doctor: 'دکتر صادقی', department: 'قلب و عروق', date: '1403/10/11', time: '10:00', status: 'scheduled', type: 'نوار قلب', reminderSent: false },
];

const initialInvoices: Invoice[] = [
  { id: 'INV001', patientId: 'P001', patientName: 'علی محمدی', date: '1403/10/09', amount: 850000, status: 'paid', items: [{ description: 'ویزیت متخصص قلب', amount: 350000 }, { description: 'نوار قلب', amount: 250000 }, { description: 'آزمایش خون', amount: 250000 }] },
  { id: 'INV002', patientId: 'P002', patientName: 'فاطمه احمدی', date: '1403/10/08', amount: 520000, status: 'paid', items: [{ description: 'ویزیت متخصص غدد', amount: 350000 }, { description: 'آزمایش قند خون', amount: 170000 }] },
  { id: 'INV003', patientId: 'P003', patientName: 'رضا کریمی', date: '1403/10/07', amount: 1200000, status: 'pending', items: [{ description: 'ویزیت ارتوپد', amount: 350000 }, { description: 'MRI زانو', amount: 850000 }] },
  { id: 'INV004', patientId: 'P004', patientName: 'مریم حسینی', date: '1403/10/05', amount: 680000, status: 'overdue', items: [{ description: 'ویزیت متخصص قلب', amount: 350000 }, { description: 'اکوکاردیوگرافی', amount: 330000 }] },
  { id: 'INV005', patientId: 'P005', patientName: 'حسن رضایی', date: '1403/10/04', amount: 950000, status: 'paid', items: [{ description: 'ویزیت متخصص قلب', amount: 350000 }, { description: 'نوار قلب', amount: 250000 }, { description: 'مشاوره تغذیه', amount: 350000 }] },
  { id: 'INV006', patientId: 'P006', patientName: 'زهرا نوری', date: '1403/10/03', amount: 450000, status: 'paid', items: [{ description: 'ویزیت متخصص مغز و اعصاب', amount: 350000 }, { description: 'نسخه دارو', amount: 100000 }] },
  { id: 'INV007', patientId: 'P007', patientName: 'محمد عباسی', date: '1403/10/01', amount: 1500000, status: 'pending', items: [{ description: 'ویزیت ارتوپد', amount: 350000 }, { description: 'فیزیوتراپی (۵ جلسه)', amount: 750000 }, { description: 'عکس رادیولوژی', amount: 400000 }] },
  { id: 'INV008', patientId: 'P008', patientName: 'سارا جعفری', date: '1403/09/28', amount: 380000, status: 'paid', items: [{ description: 'ویزیت متخصص ریه', amount: 350000 }, { description: 'اسپیرومتری', amount: 30000 }] },
];

const initialSMSLogs: SMSLog[] = [
  { id: 'S001', patientName: 'علی محمدی', phone: '09121234567', message: 'بیمار گرامی، نوبت شما نزد دکتر صادقی فردا ساعت ۹:۰۰ می‌باشد. لطفاً ۱۵ دقیقه قبل مراجعه فرمایید.', date: '1403/10/09', status: 'delivered', type: 'reminder' },
  { id: 'S002', patientName: 'فاطمه احمدی', phone: '09131234567', message: 'بیمار گرامی، نوبت شما نزد دکتر موسوی فردا ساعت ۹:۳۰ می‌باشد. لطفاً ۱۵ دقیقه قبل مراجعه فرمایید.', date: '1403/10/09', status: 'delivered', type: 'reminder' },
  { id: 'S003', patientName: 'مریم حسینی', phone: '09151234567', message: 'بیمار گرامی، نوبت شما نزد دکتر صادقی امروز ساعت ۱۰:۳۰ می‌باشد.', date: '1403/10/10', status: 'delivered', type: 'reminder' },
  { id: 'S004', patientName: 'حسن رضایی', phone: '09161234567', message: 'بیمار گرامی، نوبت شما نزد دکتر صادقی فردا ساعت ۱۱:۰۰ می‌باشد.', date: '1403/10/09', status: 'sent', type: 'reminder' },
  { id: 'S005', patientName: 'زهرا نوری', phone: '09171234567', message: 'بیمار گرامی، نوبت شما نزد دکتر کاظمی فردا ساعت ۱۱:۳۰ می‌باشد.', date: '1403/10/09', status: 'delivered', type: 'reminder' },
  { id: 'S006', patientName: 'سارا جعفری', phone: '09191234567', message: 'بیمار گرامی، نوبت شما نزد دکتر امینی فردا ساعت ۱۴:۳۰ می‌باشد.', date: '1403/10/09', status: 'delivered', type: 'reminder' },
  { id: 'S007', patientName: 'علی محمدی', phone: '09121234567', message: 'بیمار گرامی، نتیجه آزمایش‌های شما آماده است. لطفاً برای دریافت نتیجه به کلینیک مراجعه فرمایید.', date: '1403/10/08', status: 'delivered', type: 'result' },
  { id: 'S008', patientName: 'رضا کریمی', phone: '09141234567', message: 'بیمار گرامی، لطفاً جهت پیگیری درمان خود در اسرع وقت به کلینیک مراجعه فرمایید.', date: '1403/10/07', status: 'failed', type: 'follow-up' },
  { id: 'S009', patientName: 'محمد عباسی', phone: '09181234567', message: 'بیمار گرامی، نوبت فیزیوتراپی شما فردا ساعت ۱۴:۰۰ ثبت شده است.', date: '1403/10/09', status: 'delivered', type: 'confirmation' },
  { id: 'S010', patientName: 'فاطمه احمدی', phone: '09131234567', message: 'بیمار گرامی، لطفاً قبل از آزمایش قند خون، ۸ ساعت ناشتا باشید.', date: '1403/10/10', status: 'delivered', type: 'reminder' },
];

export const doctors = [
  { name: 'دکتر صادقی', department: 'قلب و عروق', avatar: '👨‍⚕️', schedule: 'شنبه تا چهارشنبه' },
  { name: 'دکتر موسوی', department: 'غدد', avatar: '👨‍⚕️', schedule: 'شنبه، دوشنبه، چهارشنبه' },
  { name: 'دکتر رحیمی', department: 'ارتوپدی', avatar: '👨‍⚕️', schedule: 'یکشنبه، سه‌شنبه، پنجشنبه' },
  { name: 'دکتر کاظمی', department: 'مغز و اعصاب', avatar: '👩‍⚕️', schedule: 'شنبه تا سه‌شنبه' },
  { name: 'دکتر امینی', department: 'ریه', avatar: '👨‍⚕️', schedule: 'دوشنبه و چهارشنبه' },
];

export const departments = ['قلب و عروق', 'غدد', 'ارتوپدی', 'مغز و اعصاب', 'ریه', 'عمومی'];

// Context types
interface ClinicContextType {
  // Data
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  smsLogs: SMSLog[];
  
  // Patient operations
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  getPatientById: (id: string) => Patient | undefined;
  
  // Appointment operations
  addAppointment: (apt: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, data: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  sendReminder: (appointmentId: string) => Promise<void>;
  
  // Invoice operations
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  
  // SMS operations
  sendSMS: (phone: string, message: string, patientName: string, type: SMSLog['type']) => Promise<void>;
  sendBulkSMS: (phones: { phone: string; name: string }[], message: string, type: SMSLog['type']) => Promise<void>;
  
  // Notifications
  notifications: any[];
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
  
  // Stats
  getStats: () => {
    todayAppointments: number;
    completedToday: number;
    pendingToday: number;
    cancelledToday: number;
    noShowRate: number;
    totalPatients: number;
    monthlyRevenue: number;
    smsSent: number;
    smsDelivered: number;
    smsFailed: number;
  };
}

const ClinicContext = createContext<ClinicContextType | null>(null);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useLocalStorage<Patient[]>('clinic_patients', initialPatients);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('clinic_appointments', initialAppointments);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('clinic_invoices', initialInvoices);
  const [smsLogs, setSmsLogs] = useLocalStorage<SMSLog[]>('clinic_sms', initialSMSLogs);
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Patient operations
  const addPatient = useCallback((patient: Omit<Patient, 'id'>) => {
    const newPatient: Patient = { ...patient, id: generateId('P') };
    setPatients(prev => [...prev, newPatient]);
    addNotification(`بیمار ${patient.name} با موفقیت ثبت شد`, 'success');
  }, [setPatients, addNotification]);

  const updatePatient = useCallback((id: string, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    addNotification('اطلاعات بیمار بروزرسانی شد', 'success');
  }, [setPatients, addNotification]);

  const deletePatient = useCallback((id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    addNotification('بیمار حذف شد', 'info');
  }, [setPatients, addNotification]);

  const getPatientById = useCallback((id: string) => {
    return patients.find(p => p.id === id);
  }, [patients]);

  // Appointment operations
  const addAppointment = useCallback((apt: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = { ...apt, id: generateId('A') };
    setAppointments(prev => [...prev, newApt]);
    addNotification(`نوبت جدید برای ${apt.patientName} ثبت شد`, 'success');
  }, [setAppointments, addNotification]);

  const updateAppointment = useCallback((id: string, data: Partial<Appointment>) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    addNotification('وضعیت نوبت بروزرسانی شد', 'success');
  }, [setAppointments, addNotification]);

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    addNotification('نوبت حذف شد', 'info');
  }, [setAppointments, addNotification]);

  const sendReminder = useCallback(async (appointmentId: string) => {
    const apt = appointments.find(a => a.id === appointmentId);
    if (!apt) return;
    
    const patient = patients.find(p => p.id === apt.patientId);
    if (!patient) return;

    const message = `بیمار گرامی ${patient.name}، نوبت شما نزد ${apt.doctor} در تاریخ ${apt.date} ساعت ${apt.time} می‌باشد. لطفاً ۱۵ دقیقه قبل مراجعه فرمایید.`;
    
    const result = await simulateSMS(patient.phone, message);
    
    const smsLog: SMSLog = {
      id: result.messageId,
      patientName: patient.name,
      phone: patient.phone,
      message,
      date: getTodayJalali(),
      status: result.success ? 'delivered' : 'failed',
      type: 'reminder'
    };
    
    setSmsLogs(prev => [smsLog, ...prev]);
    setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, reminderSent: true } : a));
    
    if (result.success) {
      addNotification(`یادآوری به ${patient.name} ارسال شد`, 'success');
    } else {
      addNotification(`ارسال پیامک به ${patient.name} ناموفق بود`, 'error');
    }
  }, [appointments, patients, setSmsLogs, setAppointments, addNotification]);

  // Invoice operations
  const addInvoice = useCallback((invoice: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = { ...invoice, id: generateId('INV') };
    setInvoices(prev => [...prev, newInvoice]);
    addNotification(`صورتحساب جدید صادر شد`, 'success');
  }, [setInvoices, addNotification]);

  const updateInvoice = useCallback((id: string, data: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    addNotification('صورتحساب بروزرسانی شد', 'success');
  }, [setInvoices, addNotification]);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    addNotification('صورتحساب حذف شد', 'info');
  }, [setInvoices, addNotification]);

  const markAsPaid = useCallback((id: string) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' as const } : i));
    addNotification('صورتحساب به عنوان پرداخت شده علامت‌گذاری شد', 'success');
  }, [setInvoices, addNotification]);

  // SMS operations
  const sendSMS = useCallback(async (phone: string, message: string, patientName: string, type: SMSLog['type']) => {
    const result = await simulateSMS(phone, message);
    
    const smsLog: SMSLog = {
      id: result.messageId,
      patientName,
      phone,
      message,
      date: getTodayJalali(),
      status: result.success ? 'delivered' : 'failed',
      type
    };
    
    setSmsLogs(prev => [smsLog, ...prev]);
    
    if (result.success) {
      addNotification(`پیامک به ${patientName} ارسال شد`, 'success');
    } else {
      addNotification(`ارسال پیامک به ${patientName} ناموفق بود`, 'error');
    }
  }, [setSmsLogs, addNotification]);

  const sendBulkSMS = useCallback(async (recipients: { phone: string; name: string }[], message: string, type: SMSLog['type']) => {
    let successCount = 0;
    let failCount = 0;
    
    for (const recipient of recipients) {
      const result = await simulateSMS(recipient.phone, message);
      
      const smsLog: SMSLog = {
        id: result.messageId,
        patientName: recipient.name,
        phone: recipient.phone,
        message,
        date: getTodayJalali(),
        status: result.success ? 'delivered' : 'failed',
        type
      };
      
      setSmsLogs(prev => [smsLog, ...prev]);
      
      if (result.success) successCount++;
      else failCount++;
    }
    
    addNotification(`${successCount} پیامک با موفقیت ارسال شد${failCount > 0 ? ` و ${failCount} پیامک ناموفق` : ''}`, successCount > 0 ? 'success' : 'warning');
  }, [setSmsLogs, addNotification]);

  // Stats
  const getStats = useCallback(() => {
    const today = getTodayJalali();
    const todayApts = appointments.filter(a => a.date === today);
    const totalApts = appointments.length;
    const noShows = appointments.filter(a => a.status === 'no-show').length;
    const noShowRate = totalApts > 0 ? (noShows / totalApts) * 100 : 0;
    
    return {
      todayAppointments: todayApts.length,
      completedToday: todayApts.filter(a => a.status === 'completed').length,
      pendingToday: todayApts.filter(a => a.status === 'scheduled').length,
      cancelledToday: todayApts.filter(a => a.status === 'cancelled').length,
      noShowRate: Math.round(noShowRate * 10) / 10,
      totalPatients: patients.length,
      monthlyRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
      smsSent: smsLogs.length,
      smsDelivered: smsLogs.filter(s => s.status === 'delivered').length,
      smsFailed: smsLogs.filter(s => s.status === 'failed').length,
    };
  }, [appointments, patients, invoices, smsLogs]);

  const value = useMemo(() => ({
    patients,
    appointments,
    invoices,
    smsLogs,
    addPatient,
    updatePatient,
    deletePatient,
    getPatientById,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    sendReminder,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    sendSMS,
    sendBulkSMS,
    notifications,
    addNotification,
    removeNotification,
    getStats,
  }), [patients, appointments, invoices, smsLogs, addPatient, updatePatient, deletePatient, getPatientById, addAppointment, updateAppointment, deleteAppointment, sendReminder, addInvoice, updateInvoice, deleteInvoice, markAsPaid, sendSMS, sendBulkSMS, notifications, addNotification, removeNotification, getStats]);

  return (
    <ClinicContext.Provider value={value}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within ClinicProvider');
  return context;
};
