import { Component, OnInit } from '@angular/core';
import { PagesService } from '../pages.service';

interface TreeNode<T> {
  data: T;
}

interface FSEntry {
  subject: string;
  grade: number;
  description: string;
  teacher: string;
  date: string;
  isFinal: boolean;
}

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.scss'],
})
export class GradesComponent implements OnInit {
  customColumn = 'Subject';
  defaultColumns = [ 'Grade', 'Description', 'Teacher', 'Date', 'IsFinal' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  myGrades: TreeNode<FSEntry>[] = [];

  constructor(
    private pagesService: PagesService,
  ) {}

  async ngOnInit() {
    await this.fetchAllGrades();
  }

  async fetchAllGrades() {
    //make api call to get grades
    const userId = 42;//this.pagesService.authenticatedUser.Id || 42;
    (await this.pagesService.getStudentGrades(userId)).subscribe(async (data: any) => {
      console.log(data);
      
      this.myGrades = data.map((grade: any) => {
        return { data: {
          Subject: 'AASS',
          Grade: grade.Grade,
          Description: grade.Description,
          Teacher: 'Eugen Molnar',
          Date: '01-01-2020',
          IsFinal: false,
        }}
      });

      console.log(this.myGrades);
    });
  }
}
