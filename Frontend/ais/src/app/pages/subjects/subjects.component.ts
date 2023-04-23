import { ChangeDetectorRef, Component } from '@angular/core';
import { PagesService } from '../pages.service';
import { ToastrService } from 'ngx-toastr';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  subjectName: string;
  subjectCode: string;
  teacher: string;
}

interface ResponseCamunda {
  id: string;
  links: any[];
  definitionId: string;
  businessKey: string;
  caseInstanceId: string;
  ended: boolean;
  suspended: boolean;
  tenantId: string;
}

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

  mySubjects: TreeNode<FSEntry>[] = [];
  availableSubjects: TreeNode<FSEntry>[] = [];
  subjectData: any = [];
  userId: number = 42;
  uid: number = 0;


  constructor(
    private pagesService: PagesService,
    private toastrService: ToastrService
  ) { }

  async ngOnInit() {
    //make api call to get subjects
    //this.userId = this.pagesService.authenticatedUser.Id;
    this.uid = this.pagesService.authenticatedUser.Id;
    await this.fetchSubjects();
    await this.fetchAvailableSubjects();
  }

  async fetchSubjects() {
    await (await this.pagesService.getStudentSubjects(this.userId)).subscribe(async (data: any) => {
      this.subjects = data.subjectRegistrations;

      this.mySubjects = this.subjects.map((subject: any) => {
        const teacher = subject.teacher;
        const tmp = { data: { subjectName: subject.subjectName, subjectCode: subject.subjectCode, teacher: teacher.FirstName + ' ' + teacher.LastName } };
        return tmp;
      });
    });
  }

  async fetchAvailableSubjects() {
    await (await this.pagesService.getSubjects(this.userId)).subscribe(async (data: any) => {
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

    const response = await (await this.pagesService.registerStudentToSubjectCamunda(subjectId, this.userId)).toPromise();
    let body = response?.body as ResponseCamunda;
    processInstanceId = body?.id;

    await (await this.pagesService.getCamundaProcessVariables(processInstanceId)).subscribe((data: any) => {
      console.log('process variables', data);
    });

    (await this.pagesService.registerStudentToSubject(subjectId, this.userId)).subscribe((data: any) => {
      if (data.status === 201) {
        this.mySubjects.push({ data: { subjectName: clickedSubject.subjectName, subjectCode: clickedSubject.subjectCode, teacher: clickedSubject.teacher }});  

        //make success toast
        this.toastrService.success('Subject added successfully', 'Success', {
          positionClass: 'toast-top-right'
        });

        this.fetchSubjects();

      } else {
        //make error toast
        this.toastrService.error('Registration already exists', 'Error', {
          positionClass: 'toast-top-right'
        });
      }

    });
  }

}
