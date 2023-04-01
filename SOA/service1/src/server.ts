import express, { Request, Response } from 'express';
import { AuthService } from './auth.service';

const app = express();
const authService = new AuthService();

app.use(express.json());

app.post('/register', (req: Request, res: Response) => {
  authService.registerUser(req, res);
});

app.post('/login', (req: Request, res: Response) => {
  authService.loginUser(req, res);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
