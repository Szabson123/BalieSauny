import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TubService } from '../services/tub.service';
import { ReservationService } from '../services/reservation.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterModule, HttpClientModule, CommonModule],
  providers: [TubService, ReservationService],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit{
  @Input() tubId!: number;

  reservation: any[] = []

  constructor(private reservationService: ReservationService) {}


  ngOnInit(): void {
    this.reservationService.getReservationByTub(this.tubId).subscribe(data => {
      this.reservation = data;
      console.log(this.reservation)
    })
  }
}
