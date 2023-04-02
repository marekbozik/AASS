import express, { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SubjectService } from './subjectsManagement.service';
import { ClassificationService } from './classification.service';

const app = express();
const authService = new AuthService();
const subjectService = new SubjectService();
const classificationService = new ClassificationService();

app.use(express.json());

app.post('/register', (req: Request, res: Response) => {
  authService.registerUser(req, res);
});

app.post('/login', (req: Request, res: Response) => {
  authService.loginUser(req, res);
});

app.post('/addSubject', (req: Request, res: Response) => {
  subjectService.addSubject(req, res);
});

app.get('/getSubjects', (req: Request, res: Response) => {
  subjectService.getSubjects(req, res);
});

app.post('/subjectRegistration', (req: Request, res: Response) => {
  subjectService.subjectRegistration(req, res);
});

app.post('/addClassification', (req: Request, res: Response) => {
  classificationService.addClassification(req, res);
});

app.get('/getClassification', (req: Request, res: Response) => {
  classificationService.getSubjectClassification(req, res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
