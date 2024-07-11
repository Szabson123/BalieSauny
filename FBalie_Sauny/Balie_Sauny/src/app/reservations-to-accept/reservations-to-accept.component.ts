import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { TubService } from '../services/tub.service';
import { ProfileService } from '../services/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reservations-to-accept',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './reservations-to-accept.component.html',
  styleUrls: ['./reservations-to-accept.component.css'],
  providers: [ReservationService, TubService, ProfileService]
})
export class ReservationsToAcceptComponent implements OnInit {
  pendingReservations: any[] = [];
  tubs: any[] = [];
  userProfiles: { [key: number]: any } = {};  // Cache for user profiles

  constructor(
    private reservationService: ReservationService,
    private tubService: TubService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadTubs();
    this.fetchPendingReservations();
  }

  loadTubs(): void {
    this.tubService.getTubs().subscribe(
      data => {
        this.tubs = data;
        console.log('Loaded tubs:', this.tubs);
      },
      error => {
        console.error('Error loading tubs', error);
      }
    );
  }

  fetchPendingReservations(): void {
    this.reservationService.getPendingReservations().subscribe(
      data => {
        this.pendingReservations = data.map((reservation: any) => {
          if (reservation.user && reservation.user.id) {
            this.loadUserProfile(reservation.user.id);
          }
          return {
            ...reservation,
            tubName: this.getTubName(reservation.tub),
          };
        });
        console.log('Pending reservations:', this.pendingReservations);
      },
      error => {
        console.error('Error fetching pending reservations', error);
      }
    );
  }

  loadUserProfile(userId: number): void {
    if (!this.userProfiles[userId]) {
      this.profileService.getSpecificUserProfile(userId).subscribe(
        data => {
          this.userProfiles[userId] = data;
          console.log(`Loaded profile for user ID ${userId}:`, data);
        },
        error => {
          console.error(`Error loading user profile for user ID ${userId}`, error);
        }
      );
    }
  }

  getTubName(tubId: number): string {
    const tub = this.tubs.find(t => t.id === tubId);
    return tub ? tub.name : 'Unknown';
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

  getStatus(reservation: any): string {
    if (reservation.accepted_status) {
      return 'Accepted';
    } else if (reservation.wait_status) {
      return 'Waiting';
    } else if (reservation.nobody_status) {
      return 'Nobody';
    } else {
      return 'Unknown';
    }
  }

  getUserProfile(userId: number): any {
    return this.userProfiles[userId] || {};
  }
}
