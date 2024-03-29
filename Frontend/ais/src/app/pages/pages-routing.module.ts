import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DasboardComponent } from './dasboard/dasboard.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { GradesComponent } from './grades/grades.component';
import { DocumentsComponent } from './documents/documents.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DasboardComponent },
  { path: 'subjects', component: SubjectsComponent },
  { path: 'grades', component: GradesComponent},
  { path: 'documents', component: DocumentsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
