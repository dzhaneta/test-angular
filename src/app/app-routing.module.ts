import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersPageComponent } from './users-page/users-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: 'users', component: UsersPageComponent},
  { path: 'users/:id', component: UserPageComponent},
  { path: '', redirectTo: 'users', pathMatch: 'full'},
  { path: 'not-found', component: NotFoundPageComponent},
  { path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
