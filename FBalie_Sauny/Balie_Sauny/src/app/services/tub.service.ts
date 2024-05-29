import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TubService {
  private apiUrl = 'http://127.0.0.1:8000/api/tubs/';

  constructor(private http: HttpClient) { }

  getTubs(): Observable<any>{
    return this.http.get(this.apiUrl)
  }

  getTub(id: number): Observable<any>{
    return this.http.get(`${this.apiUrl}${id}/`)
  }

}
