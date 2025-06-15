import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdminAppointment } from '../models/admin.appointment.model';


@Component({
  selector: 'app-termin-uebersicht',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './termin-uebersicht.component.html',
  styleUrl: './termin-uebersicht.component.css'
})
export class TerminUebersichtComponent {

  appointments: AdminAppointment[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<AdminAppointment[]>('http://localhost:8080/api/appointments/admin/appointment-overview')
      .subscribe({
        next: (data) => this.appointments = data,
        error: (err) => console.error('Fehler beim Laden:', err)
      });
  }
}
