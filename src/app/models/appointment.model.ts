export interface Appointment {
  id: number;
  dateTime: string;       
  date: string;           
  time: string;
  description: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'CANCELED' | 'RESERVED';
  spotsLeft?: number;
  note?: string;
}
