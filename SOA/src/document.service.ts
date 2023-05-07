import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './auth.service';
import { SubjectService } from './subjectsManagement.service';

const authService = new AuthService();
const subjectService = new SubjectService();
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

export class DocumentService {
    async addDocument(request: Request, response: Response) {
        const { title, documentText, subjectId, teacherId } = request.body;

        try {
            const isTeacher = await authService.isUserTeacher(teacherId);

            if (!isTeacher) {
                return response.status(401).json({ message: 'Unauthorized' });
            }

            const subject = await subjectService.getSubjects(request, null);

            if (!subject) {
                return response.status(404).json({ message: 'Subject not found' });
            }

            if (subject[0].TeacherId !== teacherId) {
                return response.status(401).json({ message: 'Unauthorized' });
            }

            const document = await prisma.document.create({
                data: {
                    Title: title,
                    DocumentText: documentText,
                    GroupId: subjectId,
                }
            });

            return await response.status(201).json({ message: 'Document created', document });
        }
        catch (err) {
            console.error(err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getDocuments(request: Request, response: Response) {
        let userId = request.body.userId;
        console.log('userId', userId);

        try {
            const studentSubjects = await prisma.groupMembers.findMany({
                where: {
                    UserId: userId,
                }
            });

            console.log('studentSubjects', studentSubjects);

            if (studentSubjects.length > 0) {
                const documents = await prisma.document.findMany({
                    where: {
                        GroupId: { in: studentSubjects.map(subject => subject.GroupId) }
                    }
                });

                return await response.status(201).json(documents);
            } else {
                if (await authService.isUserTeacher(userId)) {
                    const teacherSubjects = await prisma.group.findMany({
                        where: {
                            TeacherId: userId,
                        }
                    });

                    const documents = await prisma.document.findMany({
                        where: {
                            GroupId: { in: teacherSubjects.map(subject => subject.Id) }
                        }
                    });

                    return await response.status(201).json(documents);
                }

                return response.status(404).json({ message: 'Student not found' });
            }

        } catch (err) {
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
}