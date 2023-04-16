import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';
import { PagesService } from './pages.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbCardModule, NbTreeGridModule, NbIconModule } from '@nebular/theme';
import { DasboardComponent } from './dasboard/dasboard.component';
import { SubjectsComponent } from './subjects/subjects.component';

@NgModule({
  declarations: [
    LoginComponent,
    DasboardComponent,
    SubjectsComponent
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
    NbIconModule
  ],
  exports: [
    LoginComponent
  ],
  providers: [
    PagesService
  ]
})
export class PagesModule { }
