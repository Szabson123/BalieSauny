import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../services/reservation.service';
import { RouterModule } from '@angular/router';
import { TubService } from '../services/tub.service';
import { FullCalendarModule } from '@fullcalendar/angular'; // Import FullCalendar module
import { CalendarOptions } from '@fullcalendar/core'; // Import CalendarOptions
import dayGridPlugin from '@fullcalendar/daygrid'; // Import the dayGrid plugin
import interactionPlugin from '@fullcalendar/interaction'; // Import the interaction plugin

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [RouterModule, HttpClientModule, CommonModule, FullCalendarModule],
    providers: [ReservationService, TubService],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
    tubId!: number;
    reservation: any[] = [];
    Date1: Date = new Date();
    tub: any = {};
    selectedDates: Date[] = [];
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: this.handleDateClick.bind(this)
    };

    constructor(
        private route: ActivatedRoute,
        private reservationService: ReservationService,
        private tubService: TubService
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.tubId = +params.get('id')!;
            console.log('Tub ID:', this.tubId);
            this.loadReservations();
            this.loadTubinfo();
        });
    }

    loadReservations(): void {
        this.reservationService.getReservationByTub(this.tubId).subscribe(data => {
            this.reservation = data;
            console.log(this.reservation);
        });
    }

    loadTubinfo(): void {
        this.tubService.getTub(this.tubId).subscribe(data => {
            this.tub = data;
        });
    }

    handleDateClick(arg: any) {
        if (this.selectedDates.length < 2) {
            this.selectedDates.push(arg.date);
            console.log('Selected Dates:', this.selectedDates);
        } else {
            this.selectedDates = [arg.date];
            console.log('Selected Dates:', this.selectedDates);
        }
    }
}
