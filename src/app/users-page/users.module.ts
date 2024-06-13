import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { PaginationModule } from "../shared/pagination/pagination.module";
import { UsersRoutingModule } from "./users-routing.module";

import { UsersPageComponent } from "./users-page.component";
import { UserPageComponent } from "./user-page/user-page.component";

import { UsersDataService } from "../services/users-data.service";

import { ArraySortPipe } from "../shared/pipes/sort.pipe";
import { SafePipe } from "../shared/pipes/safe.pipe";
import { UsersApiService } from "../services/users-api.service";
import { FilterPipe } from "../shared/pipes/filter.pipe";
import { PaginationPipe } from "../shared/pipes/pagination.pipe";

@NgModule({
  declarations: [
    UsersPageComponent,
    UserPageComponent,
    ArraySortPipe,
    FilterPipe,
    PaginationPipe,
    SafePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginationModule,
    UsersRoutingModule
  ],
  providers: [
    UsersApiService,
    UsersDataService,
  ],
})
export class UsersModule {}
