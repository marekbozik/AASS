import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PagesService } from '../pages.service';
import { AuthService } from '../auth.service';
import { FSEntryGrades, TreeNode, User } from 'src/app/interfaces';
import { Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  customColumn = 'Subject';
  defaultColumns = [ 'Grade', 'Description', 'Teacher', 'Date', 'Is Final' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  myGrades: TreeNode<FSEntryGrades>[] = [];
  user: User = {
    Id: 0,
    FirstName: '',
    LastName: '',
    Email: '',
    PasswordHash: '',
    IsTeacher: false,
  };
  grade: number = 0;
  subjcet: string = '';
  student: string = '';
  description: string = '';
  isFinalGrade: boolean = false;
  allStudents: any = [];
  allSubjects: any = [];

  constructor(
    private pagesService: PagesService,
    private authService: AuthService,
    private dialogService: NbDialogService,
    private toastrService: ToastrService
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();

    if (this.user === null || this.user === undefined) {
      this.authService.logout();
      return;
    }

    if (this.user.IsTeacher) {
      await (await this.pagesService.getStudents()).subscribe(async (data: any) => {
        this.allStudents = data.body;
      });

      await (await this.pagesService.getSubjects(this.user.Id)).subscribe(async (data: any) => {
        this.allSubjects = data.body;
      });
    }
    await this.fetchAllGrades();
  }

  async fetchAllGrades() {
    (await this.pagesService.getStudentGrades(this.user.Id)).subscribe(async (data: any) => {
      
      this.myGrades = data.body?.map((grade: any) => {
        return { data: {
          Subject: 'AASS',
          Grade: grade.Grade,
          Description: grade.Description,
          Teacher: 'Eugen Molnar',
          Date: '01-01-2020',
          'Is Final': false,
        }}
      });

    });
  }

  addNewGrade(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: 'this is some additional data passed to dialog' });
  }

  async submitGrade(ref: any) {
    ref.close();

    const studentId = this.allStudents.find((student: any) => student.FirstName.toLowerCase() === this.student.toLowerCase() || student.LastName.toLowerCase() === this.student.toLowerCase())?.Id;
    const subjectId = this.allSubjects.find((subject: any) => subject.Code.toLowerCase() === this.subjcet.toLowerCase())?.Id;
    const grade =  Number(this.grade);

    await (await this.pagesService.addStudentGrade(this.user.Id, studentId, subjectId, grade, this.description, this.isFinalGrade)).subscribe(async (data: any) => {
      this.toastrService.success('Grade added successfully!');
      await this.fetchAllGrades();
    });
  }

}
