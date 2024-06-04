import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UsersPageComponent } from "./users-page.component";
import { UserPageComponent } from "./user-page/user-page.component";

const usersRoutes: Routes = [
  { path: '', component: UsersPageComponent},
  { path: ':id', component: UserPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
