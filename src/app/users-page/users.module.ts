import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { PaginationModule } from "../shared/pagination/pagination.module";
import { UsersRoutingModule } from "./users-routing.module";

import { UsersPageComponent } from "./users-page.component";
import { UserPageComponent } from "./user-page/user-page.component";

import { UsersService } from "../services/users.service";
import { UsersFilterService } from "../services/users-filter.service";
import { UsersSortService } from "../services/users-sort.service";
import { PaginationService } from "../services/pagination.service";

import { ArraySortPipe } from "../shared/pipes/sort.pipe";

@NgModule({
  declarations: [
    UsersPageComponent,
    UserPageComponent,
    ArraySortPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationModule,
    UsersRoutingModule
  ],
  providers: [
    UsersService,
    UsersFilterService,
    UsersSortService,
    PaginationService
  ],
})
export class UsersModule {}
