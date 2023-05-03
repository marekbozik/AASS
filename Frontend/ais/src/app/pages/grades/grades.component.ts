import { Component, OnInit } from '@angular/core';
import { PagesService } from '../pages.service';
import { AuthService } from '../auth.service';
import { FSEntryGrades, TreeNode, User } from 'src/app/interfaces';

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

  constructor(
    private pagesService: PagesService,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.user = this.authService.getUser();

    if (this.user === null || this.user === undefined) {
      this.authService.logout();
      return;
    }
    await this.fetchAllGrades();
  }

  async fetchAllGrades() {
    (await this.pagesService.getStudentGrades(this.user.Id)).subscribe(async (data: any) => {
      
      this.myGrades = data.map((grade: any) => {
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
}
