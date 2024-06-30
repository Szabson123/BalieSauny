import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-all-reservations',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin-all-reservations.component.html',
  styleUrl: './admin-all-reservations.component.css',
  providers: [ReservationService]
})
export class AdminAllReservationsComponent implements OnInit{
  allReservations: any[] = [];

  constructor(private reservationService: ReservationService) { }

  ngOnInit(): void {
    this.fetchallReservations();
  }

  fetchallReservations(): void {
    this.reservationService.getAllReservations().subscribe(
      data => {
        this.allReservations = data;
      },
      error => {
        console.error('Error fetching all reservations', error);
      }
    );
  }
}

