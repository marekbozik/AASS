import { Component } from '@angular/core';
import { PagesService } from '../pages.service';
import { ToastrService } from 'ngx-toastr';
import { User, ResponseCamunda, TreeNode, FSEntrySubjects } from 'src/app/interfaces';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss']
})
export class SubjectsComponent {
  customColumn = 'subjectName';
  defaultColumns = [ 'subjectCode', 'teacher' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  availableSubjectsAllColumns = [ this.customColumn, ...this.defaultColumns, 'actions' ];
  subjects: any = [];

  mySubjects: TreeNode<FSEntrySubjects>[] = [];
  availableSubjects: TreeNode<FSEntrySubjects>[] = [];
  subjectData: any = [];
  user: User = {
    Id: 0,
    FirstName: '',
    LastName: '',
    Email: '',
    PasswordHash: '',
    IsTeacher: false
  };


  constructor(
    private pagesService: PagesService,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) { }

  async ngOnInit() {
    this.user = this.authService.getUser();

    if (this.user === null || this.user === undefined) {
      this.authService.logout();
      return;
    }
    await this.fetchSubjects();
    await this.fetchAvailableSubjects();
  }

  async fetchSubjects() {
    await (await this.pagesService.getStudentSubjects(this.user.Id)).subscribe(async (data: any) => {
      this.subjects = data.subjectRegistrations;

      this.mySubjects = this.subjects.map((subject: any) => {
        const teacher = subject.teacher;
        const tmp = { data: { subjectName: subject.subjectName, subjectCode: subject.subjectCode, teacher: teacher.FirstName + ' ' + teacher.LastName } };
        return tmp;
      });
    });
  }

  async fetchAvailableSubjects() {
    await (await this.pagesService.getSubjects(this.user.Id)).subscribe(async (data: any) => {
      this.subjectData = data;
      this.availableSubjects = data.map((subject: any) => {
        const teacher = subject.Teacher;
        const tmp = { data: { subjectName: subject.Name, subjectCode: subject.Code, teacher: teacher.FirstName + ' ' + teacher.LastName } };
        return tmp;
      });
    });
  }

  async addSubject(subject: any) {
    const clickedSubject = subject.data;
    const subjectId = this.subjectData.find((s: any) => s.Code === subject.data.subjectCode).Id;
    let processInstanceId = "";

    const response = await (await this.pagesService.registerStudentToSubjectCamunda(subjectId, this.user.Id)).toPromise();
    let body = response?.body as ResponseCamunda;
    processInstanceId = body?.id;

    setTimeout(async () => {
      await (await this.pagesService.getCamundaProcessVariables(processInstanceId)).subscribe((data: any) => {
        const variables = data.body;
        const registrationSuccessful = variables.registrationSucessfull.value;

        if (registrationSuccessful === 1) {
          this.mySubjects.push({ data: { subjectName: clickedSubject.subjectName, subjectCode: clickedSubject.subjectCode, teacher: clickedSubject.teacher }});  
          this.toastrService.success('Subject added successfully', 'Success', {
            positionClass: 'toast-top-right'
          });

          this.fetchSubjects();
        } else {
          this.toastrService.error('Registration already exists', 'Error', {
            positionClass: 'toast-top-right'
          });
        }
      });
    }, 2000);
  }

}
