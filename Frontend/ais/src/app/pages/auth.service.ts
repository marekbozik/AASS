import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { DecodedToken } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/';
  private userSubject = new BehaviorSubject<DecodedToken | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private routerService: Router
    ) { }

  // api call to try to login
  async login(email: string, password: string) {
    const body = { "email": email, "password": password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const res = await this.http.post(`${this.baseUrl}login`, JSON.stringify(body), { headers: headers, observe: 'response' });
    this.userSubject.next(body as any);
    return res;
  }

  logout(): void {
    this.setUser(null);
    this.routerService.navigate(['./login']);
    this.userSubject.next(null);
  }

  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
}
