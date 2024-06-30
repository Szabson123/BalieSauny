import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reservations-to-accept',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './allreservations.component.html',
  styleUrls: ['./allreservations.component.css'],
  providers: [ReservationService]
})
export class ReservationsToAcceptComponent implements OnInit {
  pendingReservations: any[] = [];

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.fetchPendingReservations();
  }

  fetchPendingReservations(): void {
    this.reservationService.getPendingReservations().subscribe(
      data => {
        this.pendingReservations = data;
      },
      error => {
        console.error('Error fetching all reservations', error);
      }
    );
  }
}