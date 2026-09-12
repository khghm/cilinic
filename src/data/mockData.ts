// Types only - data is managed in ClinicContext
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
