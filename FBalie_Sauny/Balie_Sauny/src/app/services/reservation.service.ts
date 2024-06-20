import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = "http://127.0.0.1:8000/api/tubs/";

  constructor(private http: HttpClient) { }

  getReservationByTub(tubId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}${tubId}/check_reservations/`);
  }
  createReservation(tubId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}${tubId}/create_reservation/`, data);
  }
}