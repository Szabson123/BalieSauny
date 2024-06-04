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
        dateClick: this.handleDateClick.bind(this),
        events: [] // Initial empty events
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
        } else {
            this.selectedDates = [arg.date];
        }

        // Update calendar events
        this.updateCalendarEvents();

        // Print date information if two dates are selected
        if (this.selectedDates.length === 2) {
            this.printDateInfo();
        }
    }

    updateCalendarEvents() {
        const events = this.selectedDates.map(date => ({
            title: 'Selected',
            start: date,
            allDay: true,
            display: 'background',
            backgroundColor: 'yellow'
        }));

        this.calendarOptions = {
            ...this.calendarOptions,
            events: events
        };
    }

    printDateInfo() {
        const startDate = this.selectedDates[0];
        const endDate = this.selectedDates[1];
        const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Including both start and end date

        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        console.log('Number of Days:', diffDays);
    }
}
