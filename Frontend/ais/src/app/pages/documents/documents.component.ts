import { Component, TemplateRef } from '@angular/core';
import { PagesService } from '../pages.service';
import { NbDialogService } from '@nebular/theme';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { User, TreeNode, FSEntry } from 'src/app/interfaces';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {
  inputItemNgModel = '';
  textareaItemNgModel = '';
  inputItemFormControl = new FormControl();
  textareaItemFormControl = new FormControl();

  customColumn = 'Title';
  defaultColumns = ['Id', 'Added At', 'Added By'];
  allColumns = [ this.customColumn, ...this.defaultColumns ];

  documents: TreeNode<FSEntry>[] | any = [];

  title: string = '';
  description: string = '';
  class: string = '';

  user: User = {
    Id: 0,
    FirstName: '',
    LastName: '',
    Email: '',
    PasswordHash: '',
    IsTeacher: false
  };
  subjectData: any = [];
  selectedDocumentType: string = '';
  form: FormGroup;
  subjectOptions: any;

  constructor(
    private pagesService: PagesService,
    private dialogService: NbDialogService,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subject: ['', Validators.required],
    });
  }


  async ngOnInit() {
    this.user = await this.authService.getUser();

    if (this.user === null || this.user === undefined) {
      this.authService.logout();
      return;
    }
    await this.fetchAllDocuments();
    await this.fetchAvailableSubjects();
    
  }

  async fetchAllDocuments() {
    await (await this.pagesService.getStudentDocuments(this.user.Id)).subscribe(async (data: any) => {
      this.documents = data[0];

      this.documents = data.body?.map((document: any) => {
        const { Id, Title, DocumentText, CreatedAt } = document;

        return { data: {
          Id,
          Title,
          Description: DocumentText,
          'Added By': 'Eugen Molnar',
          'Added At': CreatedAt.split('T')[0]
        }}
      });
    });
  }

  async fetchAvailableSubjects() {
    await (await this.pagesService.getSubjects(this.user.Id)).subscribe(async (data: any) => {
      this.subjectData = data.body;
    });
  }

  openDocument(dialog: TemplateRef<any>, document: any) {
    this.dialogService.open(dialog, { context: document.data });
  }

  addNewDocument(dialog: TemplateRef<any>) {
    this.subjectOptions = this.subjectData.find((subject: any) => subject.TeacherId === this.user.Id);
    this.dialogService.open(dialog, { context: { subjectOptions: this.subjectOptions } });
  }

  async createNewDocument(ref: any) {
    ref.close({'title': this.title, 'description': this.textareaItemNgModel, 'class': this.class})
    const subjectId = this.subjectData.find((subject: any) => subject.Code.toLowerCase() === this.class.toLowerCase())?.Id;

    if (subjectId === undefined) {
      this.toastrService.error('Subject not found', 'Error');
      return;
    }

    (await this.pagesService.addNewDocument(this.title, this.textareaItemNgModel, subjectId, this.user.Id)).subscribe(async (data: any) => {

      if (data.status === 201) {
        this.toastrService.success('Document created successfully', 'Success');
        await this.fetchAllDocuments();
      } else {
        this.toastrService.error('Document creation failed', 'Error');
      }
    });
  }
}
