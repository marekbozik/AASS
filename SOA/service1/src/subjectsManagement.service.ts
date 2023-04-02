import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

export class SubjectService {
    async addSubject(request: Request, response: Response) {
        const { name, code, teacherId } = request.body;

        try {
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
            const subjectRegistrations = await prisma.groupMembers.findMany({
                where: {
                    GroupId: subjectId,
                }
            });

            const existingRegistration = subjectRegistrations.find((user) => user.UserId === studentId);


            if (existingRegistration) {
                return response.status(409).json({ message: 'Registration already exists' });
            }

            const user = await prisma.user.findUnique({
                where: {
                    Id: studentId
                }
            });

            if (user.IsTeacher) {
                return response.status(409).json({ message: 'User is a teacher' });
            }

            const subject = await prisma.group.findUnique({
                where: {
                    Id: subjectId
                }
            });

            if (!subject) {
                return response.status(404).json({ message: 'Subject not found' });
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