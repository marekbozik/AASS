import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces';

const baseUrl = 'http://localhost:3000/';
const camundaUrl = 'http://localhost:8080/engine-rest/';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

  isAuthenticated = new BehaviorSubject<boolean>(false);
  authenticatedUser: User = {
    Id: 42,
    FirstName: "Adam",
    LastName: "Plnstak",
    Email: "adam@plnstak.com",
    PasswordHash: "sha1$2fcbec7b$1$eaee681cf39d2dc4fd37b02214f04d99f0d09ced",
    IsTeacher: false
  };
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

    // api call to get all student grades for a subject through camunda
    async registerStudentToSubjectCamunda(subjectId: number, studentId: number) {
      const body = {
        "variables": {
          "subjectId": {
            "value": subjectId,
            "type":"integer"
          },
          "studentId": {
            "value": studentId,
            "type": "integer"
          }
        }
      };
      let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', '*');


      return await this.http.post(camundaUrl + 'process-definition/key/subjectRegistration/start', JSON.stringify(body), { headers: headers, observe: 'response' })
    }

    // api call to get all process variables for a subject registration process instance
    async getCamundaProcessVariables(processInstanceId: string) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      console.log('halooo',processInstanceId);
      return await this.http.get(
        `http://localhost:8080/engine-rest/process-instance/${processInstanceId}/variables`,
        { headers: headers, observe: 'response' }
      );
    }

    // api call get all student grades
    async getStudentGrades(userId: number) {
      const body = { "studentId": userId };
      const options = { headers: new HttpHeaders().set('Content-Type', 'application/json'), body: JSON.stringify(body) };

      return this.http.get(`${baseUrl}getClassification`, options);
    }
}
