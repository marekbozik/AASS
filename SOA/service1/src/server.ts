import express, { Request, Response } from 'express';
import { UserController } from './userController';
import { UserService } from './userService';

const app = express();
const userService = new UserService();
const userController = new UserController(userService);

app.use(express.json());

app.post('/users', (req: Request, res: Response) => {
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  userController.registerUser().then(() => {
    console.log('User created');
  }).catch((err) => {
      console.error(err);
  });
});