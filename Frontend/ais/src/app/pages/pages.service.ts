import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const baseUrl = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}
    
    // api call to try to login
    async login(email: string, password: string) {
      const body = { "email": email, "password": password };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return await this.http.post(`${baseUrl}login`, JSON.stringify(body), { headers: headers, observe: 'response' })
    }
}
