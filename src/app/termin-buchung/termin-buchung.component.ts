import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Appointment } from '../models/appointment.model';

@Component({
  selector: 'app-termin-buchung',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './termin-buchung.component.html',
  styleUrl: './termin-buchung.component.css'
})
export class TerminBuchungComponent {

  calendarDays: Date[] = [];
  selectedDay: Date = new Date();
  appointments: Appointment[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.generateCalendarDays();
    this.selectDay(this.selectedDay);
  }


  generateCalendarDays() {
    const today = new Date();
    this.calendarDays = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.calendarDays.push(date);
    }
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }

  selectDay(day: Date) {
    this.selectedDay = day;
    this.loadAppointmentsForDay(day);
  }


  buchen(termin: Appointment) {
    this.http.post<Appointment>('http://localhost:8080/api/appointments/', termin)
      .subscribe({
        next: (response) => {
          console.log('Termin erfolgreich gebucht:', response);
          alert('Termin erfolgreich gebucht!');
          this.loadAppointmentsForDay(this.selectedDay); // Termine neu laden, falls sich etwas geändert hat
        },
        error: (err) => {
          console.error('Fehler bei der Buchung:', err);
          // err.error ist das Objekt { "error": "Keine Plätze mehr verfügbar" }
          // err.error.error ist der String "Keine Plätze mehr verfügbar"
          const backendMessage = err?.error?.error || 'Fehler bei der Buchung. Bitte versuch es erneut.';
          alert(backendMessage);
        }
      });
  }

  loadAppointmentsForDay(day: Date) {
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const date = String(day.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${date}`;  // YYYY-MM-DD 
    this.http.get<Appointment[]>(`http://localhost:8080/api/appointments?date=${dateStr}`)
      .subscribe({
        next: (data) => {
          this.appointments = data;
        },
        error: (err) => {
          console.error('Fehler beim Laden der Termine:', err);
          this.appointments = [];  // Falls Fehler, keine Termine anzeigen
        }
      });
  }
}
