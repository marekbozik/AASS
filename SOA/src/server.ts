import express, { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SubjectService } from './subjectsManagement.service';
import { ClassificationService } from './classification.service';
import { DocumentService } from './document.service';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const authService = new AuthService();
const subjectService = new SubjectService();
const classificationService = new ClassificationService();
const documentService = new DocumentService();

app.use(cors());
app.use(bodyParser.json());

app.post('/register', (req: Request, res: Response) => {
  authService.registerUser(req, res);
});

app.post('/login', (req: Request, res: Response) => {
  authService.loginUser(req, res);
});

app.post('/addSubject', (req: Request, res: Response) => {
  subjectService.addSubject(req, res);
});

app.post('/getSubjects', (req: Request, res: Response) => {
  subjectService.getSubjects(req, res);
});

app.post('/getStudentRegistrations', (req: Request, res: Response) => {
  subjectService.getStudentRegistrations(req, res);
});

app.post('/subjectRegistration', (req: Request, res: Response) => {
  subjectService.subjectRegistration(req, res);
});

app.post('/subjectRegistrationKafka', (req: Request, res: Response) => {
  subjectService.subjectRegistrationKafka(req, res);
});

app.post('/addClassification', (req: Request, res: Response) => {
  classificationService.addClassification(req, res);
});

app.post('/getClassification', (req: Request, res: Response) => {
  classificationService.getSubjectClassification(req, res);
});

app.post('/addDocument', (req: Request, res: Response) => {
  documentService.addDocument(req, res);
});

app.post('/getDocuments', (req: Request, res: Response) => {
  documentService.getDocuments(req, res);
});

app.get('/getStudents', (req: Request, res: Response) => {
  authService.getStudents(req, res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
