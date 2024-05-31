import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../services/reservation.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  providers: [ReservationService],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  tubId!: number;
  reservation: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tubId = +params.get('id')!; // Pobierz 'id' z parametrów URL i konwertuj na liczbę
      console.log('Tub ID:', this.tubId);
      this.loadReservations();
    });
  }

  loadReservations(): void {
    this.reservationService.getReservationByTub(this.tubId).subscribe(data => {
      this.reservation = data;
      console.log(this.reservation);
    });
  }
}