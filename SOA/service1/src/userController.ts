


















import { UserService } from "./userService";
import {Request, Response} from 'express';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn'],
});

export class UserController {
    private readonly userService: UserService;
  
    constructor(userService: UserService) {
      this.userService = userService;
    }
    async getAllUsers() {
      try {
        const users: User[] = await prisma.user.findMany();
        console.log(users);
        await prisma.$disconnect();
      }
      catch (err) {
        console.error(err);
      }
    }

    async registerUser() {
      try {
        const user: User = await prisma.user.create({
          data: {
            FirstName: 'Jakobs',
            LastName: 'Blaho',
            Email: 'jakobs@blaho.com',
            PasswordHash: '123456',
            IsTeacher: false
          }
        });

        console.log(user);

        await prisma.$disconnect();
      }
      catch (err) {
        console.error(err);
        //res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }