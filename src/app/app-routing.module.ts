import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NotesComponent } from './notes/notes.component';
import { OverviewComponent } from './overview/overview.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'projects' },
  { path: 'projects', component: ProjectsComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'notes', component: NotesComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
