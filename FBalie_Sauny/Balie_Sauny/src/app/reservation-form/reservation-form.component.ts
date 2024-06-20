import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../services/reservation.service';
import { TubService } from '../services/tub.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css'],
  providers: [ReservationService, TubService]
})
export class ReservationFormComponent implements OnInit {
  reservationForm: FormGroup;
  tubId: number = 0;
  startDate: string = '';
  endDate: string = '';
  totalPrice: number = 0;
  tub: any = {}; // Dodanie właściwości tub

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private tubService: TubService, // Dodanie serwisu tub
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.reservationForm = this.fb.group({
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tubId = +params.get('id')!;
      this.loadTubInfo(); // Pobieranie informacji o tubie
    });

    this.route.queryParamMap.subscribe(params => {
      this.startDate = params.get('start_date')!;
      this.endDate = params.get('end_date')!;
      this.calculateTotalPrice(); // Ponowne obliczenie ceny po ustawieniu dat
    });
  }

  loadTubInfo(): void {
    this.tubService.getTub(this.tubId).subscribe(data => {
      this.tub = data;
      console.log('Tub data loaded:', this.tub); // Dodane logowanie
      this.calculateTotalPrice(); // Obliczanie ceny po pobraniu danych o tubie
    });
  }

  calculateTotalPrice() {
    if (!this.startDate || !this.endDate || !this.tub.price_per_day) {
      console.log('Missing data for price calculation'); // Dodane logowanie
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    this.totalPrice = diffDays * parseFloat(this.tub.price_per_day); // Obliczanie całkowitej ceny
    console.log('Total price calculated:', this.totalPrice); // Dodane logowanie
  }

  onSubmit() {
    if (this.reservationForm.valid) {
      const formData = this.reservationForm.value;
      formData.start_date = this.startDate;
      formData.end_date = this.endDate;
      formData.price = this.totalPrice;

      this.reservationService.createReservation(this.tubId, formData).subscribe(
        response => {
          console.log('Reservation created successfully', response);
          this.router.navigate(['/reservations']); // Przekierowanie po utworzeniu rezerwacji
        },
        error => {
          console.error('Error creating reservation', error);
        }
      );
    }
  }
}
