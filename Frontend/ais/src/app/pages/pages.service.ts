import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces';

const baseUrl = 'http://localhost:3000/';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  isAuthenticated = new BehaviorSubject<boolean>(false);
  authenticatedUser: User = {} as User;
  //user = new BehaviorSubject<User>({} as User);

  constructor(private http: HttpClient) {}
    
    // api call to try to login
    async login(email: string, password: string) {
      const body = { "email": email, "password": password };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return await this.http.post(`${baseUrl}login`, JSON.stringify(body), { headers: headers, observe: 'response' })
    }

    // api call to get student subjects
    async getStudentSubjects(userId: number) {
      const body = { "subjectId": null, "studentId": userId };
      const options = { headers: new HttpHeaders().set('Content-Type', 'application/json'), body: JSON.stringify(body) };

      return this.http.get(`${baseUrl}getStudentRegistrations`, options);
    }

    // api call to get all subjects
    async getSubjects(userId: number) {
      const body = { "subjectId": null, "studentId": userId };
      const options = { headers: new HttpHeaders().set('Content-Type', 'application/json'), body: JSON.stringify(body) };

      return this.http.get(`${baseUrl}getSubjects`, options);
    }

    // api call to register student to subject
    async registerStudentToSubject(subjectId: number, studentId: number) {
      const body = { "subjectId": subjectId, "studentId": studentId };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return await this.http.post(`${baseUrl}subjectRegistration`, JSON.stringify(body), { headers: headers, observe: 'response' })
    }
}
