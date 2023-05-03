import { Component, TemplateRef } from '@angular/core';
import { PagesService } from '../pages.service';
import { NbDialogService } from '@nebular/theme';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface TreeNode<T> {
  data: T;
}

interface FSEntry {
  id: number;
  title: string;
  description: string;
}

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

  constructor(
    private pagesService: PagesService,
    private dialogService: NbDialogService,
    private toastrService: ToastrService
  ) {}

  async ngOnInit() {
    await this.fetchAllDocuments();
  }

  async fetchAllDocuments() {
    const userId = 42;//this.pagesService.authenticatedUser.Id || 42;
    await (await this.pagesService.getStudentDocuments(userId)).subscribe(async (data: any) => {
      this.documents = data[0];

      this.documents = data.map((document: any) => {
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

  openDocument(dialog: TemplateRef<any>, document: any) {
    console.log('document', document)
    this.dialogService.open(dialog, { context: document.data });
  }

  addNewDocument(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog);
  }

  async createNewDocument(ref: any) {
    console.log('haloo', this.title, this.textareaItemNgModel, this.class)
    ref.close({'title': this.title, 'description': this.textareaItemNgModel, 'class': this.class})

    const userId = 44;//this.pagesService.authenticatedUser.Id || 42;

    (await this.pagesService.addNewDocument(this.title, this.textareaItemNgModel, 4, userId)).subscribe(async (data: any) => {
      console.log('data', data)

      if (data.status === 201) {
        this.toastrService.success('Document created successfully', 'Success');
        await this.fetchAllDocuments();
      } else {
        this.toastrService.error('Document creation failed', 'Error');
      }
    });
  }
}
