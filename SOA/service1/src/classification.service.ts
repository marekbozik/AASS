import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn'],
});

export class ClassificationService {
    async addClassification(request: Request, response: Response) {
        const { teacherId, studentId, subjectId, grade, description, createdAt, isFinalGrade } = request.body;

        try {
            const subjectStudents = await prisma.groupMembers.findMany({
                where: {
                    GroupId: subjectId
                }
            });

            const student = subjectStudents.find(student => student.UserId === studentId);

            if (!student) {
                return response.status(404).json({ message: 'Student not found' });
            }

            const newGrade = await prisma.grade.create({
                data: {
                    TeacherId: teacherId,
                    StudentId: studentId,
                    GroupId: subjectId,
                    Grade: grade,
                    Description: description,
                    CreatedAt: createdAt,
                    IsFinalGrade: isFinalGrade
                }
            });

            return await response.status(201).json({ message: 'Classification created', newGrade });
        }
        catch (err) {
            console.error(err);
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getSubjectClassification(request: Request, response: Response) {
        const { subjectId, studentId } = request.body;

        try {
            const allStudentGrades = await prisma.grade.findMany({
                where: {
                    StudentId: studentId
                }
            });

            const subjectGrades = allStudentGrades.filter(grade => grade.GroupId === subjectId);

            return await response.status(201).json({ subjectGrades });
        } catch (err) {
            return response.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
}