export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  nationalId: string;
  lastVisit: string;
  notes: string;
  bloodType: string;
  allergies: string[];
  insurance: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  type: string;
  reminderSent: boolean;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface SMSLog {
  id: string;
  patientName: string;
  phone: string;
  message: string;
  date: string;
  status: 'sent' | 'delivered' | 'failed';
  type: 'reminder' | 'confirmation' | 'follow-up' | 'result';
}

export const patients: Patient[] = [
  { id: 'P001', name: 'علی محمدی', phone: '09121234567', age: 35, gender: 'male', nationalId: '0012345678', lastVisit: '1403/09/15', notes: 'فشار خون بالا', bloodType: 'A+', allergies: ['پنی‌سیلین'], insurance: 'تأمین اجتماعی' },
  { id: 'P002', name: 'فاطمه احمدی', phone: '09131234567', age: 28, gender: 'female', nationalId: '0023456789', lastVisit: '1403/09/18', notes: 'دیابت نوع ۲', bloodType: 'B+', allergies: [], insurance: 'سلامت' },
  { id: 'P003', name: 'رضا کریمی', phone: '09141234567', age: 45, gender: 'male', nationalId: '0034567890', lastVisit: '1403/09/20', notes: 'آرتروز زانو', bloodType: 'O+', allergies: ['آسپرین'], insurance: 'تأمین اجتماعی' },
  { id: 'P004', name: 'مریم حسینی', phone: '09151234567', age: 52, gender: 'female', nationalId: '0045678901', lastVisit: '1403/09/22', notes: 'کم‌خونی', bloodType: 'AB+', allergies: [], insurance: 'ایران' },
  { id: 'P005', name: 'حسن رضایی', phone: '09161234567', age: 60, gender: 'male', nationalId: '0056789012', lastVisit: '1403/09/25', notes: 'بیماری قلبی', bloodType: 'A-', allergies: ['سولفا'], insurance: 'تأمین اجتماعی' },
  { id: 'P006', name: 'زهرا نوری', phone: '09171234567', age: 33, gender: 'female', nationalId: '0067890123', lastVisit: '1403/09/28', notes: 'میگرن مزمن', bloodType: 'B-', allergies: [], insurance: 'سلامت' },
  { id: 'P007', name: 'محمد عباسی', phone: '09181234567', age: 41, gender: 'male', nationalId: '0078901234', lastVisit: '1403/10/01', notes: 'دیسک کمر', bloodType: 'O-', allergies: ['ایبوپروفن'], insurance: 'نیروهای مسلح' },
  { id: 'P008', name: 'سارا جعفری', phone: '09191234567', age: 25, gender: 'female', nationalId: '0089012345', lastVisit: '1403/10/03', notes: 'آسم', bloodType: 'A+', allergies: ['گرد و غبار'], insurance: 'تأمین اجتماعی' },
];

export const appointments: Appointment[] = [
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

export const invoices: Invoice[] = [
  { id: 'INV001', patientId: 'P001', patientName: 'علی محمدی', date: '1403/10/09', amount: 850000, status: 'paid', items: [{ description: 'ویزیت متخصص قلب', amount: 350000 }, { description: 'نوار قلب', amount: 250000 }, { description: 'آزمایش خون', amount: 250000 }] },
  { id: 'INV002', patientId: 'P002', patientName: 'فاطمه احمدی', date: '1403/10/08', amount: 520000, status: 'paid', items: [{ description: 'ویزیت متخصص غدد', amount: 350000 }, { description: 'آزمایش قند خون', amount: 170000 }] },
  { id: 'INV003', patientId: 'P003', patientName: 'رضا کریمی', date: '1403/10/07', amount: 1200000, status: 'pending', items: [{ description: 'ویزیت ارتوپد', amount: 350000 }, { description: 'MRI زانو', amount: 850000 }] },
  { id: 'INV004', patientId: 'P004', patientName: 'مریم حسینی', date: '1403/10/05', amount: 680000, status: 'overdue', items: [{ description: 'ویزیت متخصص قلب', amount: 350000 }, { description: 'اکوکاردیوگرافی', amount: 330000 }] },
  { id: 'INV005', patientId: 'P005', patientName: 'حسن رضایی', date: '1403/10/04', amount: 950000, status: 'paid', items: [{ description: 'ویزیت متخصص قلب', amount: 350000 }, { description: 'نوار قلب', amount: 250000 }, { description: 'مشاوره تغذیه', amount: 350000 }] },
  { id: 'INV006', patientId: 'P006', patientName: 'زهرا نوری', date: '1403/10/03', amount: 450000, status: 'paid', items: [{ description: 'ویزیت متخصص مغز و اعصاب', amount: 350000 }, { description: 'نسخه دارو', amount: 100000 }] },
  { id: 'INV007', patientId: 'P007', patientName: 'محمد عباسی', date: '1403/10/01', amount: 1500000, status: 'pending', items: [{ description: 'ویزیت ارتوپد', amount: 350000 }, { description: 'فیزیوتراپی (۵ جلسه)', amount: 750000 }, { description: 'عکس رادیولوژی', amount: 400000 }] },
  { id: 'INV008', patientId: 'P008', patientName: 'سارا جعفری', date: '1403/09/28', amount: 380000, status: 'paid', items: [{ description: 'ویزیت متخصص ریه', amount: 350000 }, { description: 'اسپیرومتری', amount: 30000 }] },
];

export const smsLogs: SMSLog[] = [
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
  { name: 'دکتر صادقی', department: 'قلب و عروق', avatar: '👨‍⚕️' },
  { name: 'دکتر موسوی', department: 'غدد', avatar: '👨‍⚕️' },
  { name: 'دکتر رحیمی', department: 'ارتوپدی', avatar: '👨‍⚕️' },
  { name: 'دکتر کاظمی', department: 'مغز و اعصاب', avatar: '👩‍⚕️' },
  { name: 'دکتر امینی', department: 'ریه', avatar: '👨‍⚕️' },
];

export const departments = ['قلب و عروق', 'غدد', 'ارتوپدی', 'مغز و اعصاب', 'ریه', 'عمومی'];

export const stats = {
  todayAppointments: 8,
  completedToday: 1,
  pendingToday: 5,
  cancelledToday: 1,
  noShowRate: 8.5,
  totalPatients: 1247,
  monthlyRevenue: 456000000,
  smsSent: 342,
  smsDelivered: 328,
  smsFailed: 14,
};
