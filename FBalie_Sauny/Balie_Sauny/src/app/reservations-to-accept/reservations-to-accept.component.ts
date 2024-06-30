import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reservations-to-accept',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './reservations-to-accept.component.html',
  styleUrls: ['./reservations-to-accept.component.css'],
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
        console.error('Error fetching pending reservations', error);
      }
    );
  }

  acceptReservation(reservationId: number): void {
    this.reservationService.acceptReservation(reservationId).subscribe(
      response => {
        console.log('Reservation accepted', response);
        this.fetchPendingReservations(); 
      },
      error => {
        console.error('Error accepting reservation', error);
      }
    );
  }

  deleteReservation(reservationId: number): void {
    this.reservationService.deleteReservation(reservationId).subscribe(
      response => {
        console.log('Reservation deleted', response);
        this.fetchPendingReservations(); 
      },
      error => {
        console.error('Error deleting reservation', error);
      }
    );
  }
}
