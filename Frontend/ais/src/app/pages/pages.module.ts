import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesService } from './pages.service';

import { LoginComponent } from './login/login.component';
import { DasboardComponent } from './dasboard/dasboard.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { GradesComponent } from './grades/grades.component';
import { DocumentsComponent } from './documents/documents.component';

import {
  NbThemeModule,
  NbLayoutModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbCardModule,
  NbTreeGridModule,
  NbIconModule,
} from '@nebular/theme';

@NgModule({
  declarations: [
    LoginComponent,
    DasboardComponent,
    SubjectsComponent,
    GradesComponent,
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbTreeGridModule,
    NbIconModule,
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    PagesService
  ]
})
export class PagesModule { }
