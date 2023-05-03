import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseUrl = 'http://localhost:3000/';
const camundaUrl = 'http://localhost:8080/engine-rest/';

@Injectable({
  providedIn: 'root'
})
export class PagesService {

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
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this.http.post(`${baseUrl}getStudentRegistrations`, JSON.stringify(body), { headers: headers, observe: 'response' });
    }

    // api call to get all subjects
    async getSubjects(userId: number) {
      const body = { "subjectId": null, "studentId": userId };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this.http.post(`${baseUrl}getSubjects`, JSON.stringify(body), { headers: headers, observe: 'response' });
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
      return await this.http.get(
        `http://localhost:8080/engine-rest/process-instance/${processInstanceId}/variables`,
        { headers: headers, observe: 'response' }
      );
    }

    // api call get all student grades
    async getStudentGrades(userId: number) {
      const body = { "studentId": userId };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this.http.post(`${baseUrl}getClassification`, JSON.stringify(body), { headers: headers, observe: 'response' });
    }

    async getStudentDocuments(userId: number) {
      const body = { "userId": userId };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this.http.post(`${baseUrl}getDocuments`, JSON.stringify(body), { headers: headers, observe: 'response' });
    }

    async addNewDocument(title: string, documentText: string, subjectId: number, teacherId: number) {
      const body = { "title": title, "documentText": documentText, "subjectId": subjectId, "teacherId": teacherId };
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return await this.http.post(`${baseUrl}addDocument`, JSON.stringify(body), { headers: headers, observe: 'response' });
    }
}
