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

    async subjectRegistration(request: Request, response: Response) {
        const { subjectId, studentId } = request.body;

        try {
            
            const subjectCount = await prisma.group.count({
                where: {
                    Id: subjectId
                }
            });

            const isExistingSubject = subjectCount == 1 ? true : false;

            if (!isExistingSubject) {
                return response.status(404).json({ message: 'Subject not found' });
            }

            //TODO: rewrite to service call
            const user = await prisma.user.findUnique({
                where: {
                    Id: studentId
                }
            });

            if (!user || user.IsTeacher) {
                return response.status(409).json({ message: 'User is a teacher' });
            }

            const subjectRegistrations = await prisma.groupMembers.findMany({
                where: {
                    GroupId: subjectId,
                }
            });

            const existingRegistration = subjectRegistrations.find(groupMember => groupMember.UserId === studentId);


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