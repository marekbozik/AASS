import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { group } from 'console';
import { AuthService } from './auth.service';

const authService = new AuthService();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

export class SubjectService {
    async addSubject(request: Request, response: Response) {
        const { name, code, teacherId } = request.body;

        try {
            const isTeacher = await authService.isUserTeacher(teacherId);

            if (!isTeacher) {
                return response.status(401).json({ message: 'Reference to teacher not valid' });
            }

            const existingSubject = await prisma.group.findUnique({
                where: {
                    Code: code
                }
            });

            if (existingSubject) {
                return response.status(409).json({ message: 'Subject already exists' });
            }

            const subject = await prisma.group.create({
                data: {
                    Name: name,
                    Code: code,
                    TeacherId: teacherId
                }
            });

            return await response.status(201).json({ message: 'Subject created', subject });
        }
        catch (err) {
            console.error(err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getSubjects(request: Request, response: Response) {
        try {
            const subjectId = request.body.subjectId;
            const subjects = subjectId
                ? await prisma.group.findMany({
                        where: {
                            Id: subjectId
                        }
                    }
                )
                : await prisma.group.findMany();

            return response
                ? await response.status(200).json({ subjects })
                : subjects;
        } catch (err) {
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getStudentRegistrations(request: Request, response: Response) {
        const { subjectId, studentId } = request.body;

        try {
            const registrations = await prisma.groupMembers.findMany({
                where: { UserId: studentId } 
            });

            return response? await response.status(200).json({ registrations }) : registrations;

        } catch (err) {
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }


    async subjectRegistration(request: Request, response: Response) {
        const { subjectId, studentId } = request.body;

        try {
            if (!authService.isUserTeacher(studentId)) {
                return response.status(409).json({ message: 'User is a teacher' });
            }

            const subject = this.getSubjects(request, null);

            if (!subject) {
                return response.status(404).json({ message: 'Subject not found' });
            }

            const studentRegistrations = await this.getStudentRegistrations(request, null);
            const existingRegistration = studentRegistrations.find(groupMember => groupMember.GroupId === subjectId);

            if (existingRegistration) {
                return response.status(409).json({ message: 'Registration already exists' });
            }

            const registration = await prisma.groupMembers.create({
                data: {
                    GroupId: subjectId,
                    UserId: studentId
                }
            });

            return await response.status(201).json({ message: 'Subject registration completed', registration });
        }
        catch (err) {
            console.error(err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
}