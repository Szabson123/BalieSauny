import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService } from '../services/reservation.service';
import { RouterModule } from '@angular/router';
import { TubService } from '../services/tub.service';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import { CalendarOptions } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 

interface CalendarEvent {
    title: string;
    start: Date;
    end?: Date;
    allDay: boolean;
    display: string;
    backgroundColor: string;
    classNames?: string[];
}

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
    currentStartDate!: Date;
    currentEndDate!: Date;
    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin],
        dateClick: this.handleDateClick.bind(this),
        events: [],
        datesSet: this.handleDatesSet.bind(this) // Handle date changes
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
            this.updateCalendarReservations(this.normalizeDate(new Date()), this.normalizeDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)));
        });
    }

    loadTubinfo(): void {
        this.tubService.getTub(this.tubId).subscribe(data => {
            this.tub = data;
        });
    }

    handleDateClick(arg: any) {
        if (this.selectedDates.length < 2) {
            this.selectedDates.push(this.normalizeDate(arg.date));
        } else {
            this.selectedDates = [this.normalizeDate(arg.date)];
        }

        // Update calendar events to show selected dates
        this.updateCalendarReservations(this.currentStartDate!, this.currentEndDate!);

        // Print date information if two dates are selected
        if (this.selectedDates.length === 2) {
            this.printDateInfo();
        }
    }

    handleDatesSet(arg: any) {
        this.currentStartDate = arg.start;
        this.currentEndDate = arg.end;
        this.updateCalendarReservations(arg.start, arg.end);
    }

    updateCalendarReservations(startDate: Date, endDate: Date) {
        let reservationEvents: CalendarEvent[] = [];

        this.reservation.forEach(res => {
            const start = this.normalizeDate(new Date(res.start_date));
            const end = this.normalizeDate(new Date(res.end_date));
            end.setDate(end.getDate() + 1); // Add one day to include the end date

            reservationEvents.push({
                title: '',
                start: start,
                end: end,
                allDay: true,
                display: 'background',
                backgroundColor: 'lightcoral',
                classNames: ['fc-event-lightcoral']
            });
        });

        const allDaysInView = this.getAllDaysInView(startDate, endDate);

        let freeDays = allDaysInView.filter(day => 
            !reservationEvents.some(event => 
                event.start <= day && event.end! > day
            )
        );

        let freeEvents: CalendarEvent[] = freeDays.map(day => ({
            title: '',
            start: day,
            allDay: true,
            display: 'background',
            backgroundColor: 'lightgreen',
            classNames: ['fc-event-lightgreen']
        }));

        // Add selected dates on top of other events
        let selectedEvents: CalendarEvent[] = this.selectedDates.map(date => ({
            title: 'Selected',
            start: date,
            allDay: true,
            display: 'background',
            backgroundColor: 'yellow',
            classNames: ['fc-event-selected']
        }));

        this.calendarOptions = {
            ...this.calendarOptions,
            events: [...reservationEvents, ...freeEvents, ...selectedEvents]
        };
    }

    getAllDaysInView(startDate: Date, endDate: Date): Date[] {
        let dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    normalizeDate(date: Date): Date {
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        return normalizedDate;
    }

    printDateInfo() {
        const startDate = this.selectedDates[0];
        const endDate = this.selectedDates[1];
        const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 

        console.log('Start Date:', startDate);
        console.log('End Date:', endDate);
        console.log('Number of Days:', diffDays);
    }
}
