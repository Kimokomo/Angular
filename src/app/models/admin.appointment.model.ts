export interface AdminAppointment {
  id: number;
  userId: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  age: number;
  appointmentId: number;
  appointmentDateTime: string;
  description: string;
  note: string;
  appointmentStatus: string;
  confirmationStatus: string;
}