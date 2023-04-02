import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { comparePassword, hashPassword } from './utils';


const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
  });

export class AuthService {
    async registerUser(request: Request, response: Response) {
        const { firstname, lastname, email, password, isTeacher } = request.body;

        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    Email: email
                }
            });
    
            if (existingUser) {
                return response.status(409).json({ message: 'User already exists' });
            }
    
            const passwordHash = await hashPassword(password);
    
            await prisma.user.create({
                data: {
                    FirstName: firstname,
                    LastName: lastname,
                    Email: email,
                    PasswordHash: passwordHash,
                    IsTeacher: isTeacher
                }
            });
    
            return await response.status(201).json({ message: 'User created' });
        }
        catch (err) {
            console.error(err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async loginUser(request: Request, response: Response) {
        const { email, password } = request.body;

        try {
            const user = await prisma.user.findUnique({
                where: {
                    Email: email
                }
            });
    
            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }
    
            if (!comparePassword(password, user.PasswordHash)) {
                return response.status(401).json({ message: 'Invalid password' });
            }
    
            return response.status(200).json({ message: 'User logged in' });
        } catch (err) {
            console.error(err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async isUserTeacher(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                Id: userId
            }
        });

        return user.IsTeacher;
    }
}
