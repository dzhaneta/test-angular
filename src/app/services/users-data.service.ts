import { Injectable } from "@angular/core";

import { Observable, map } from "rxjs";

import { UsersApiService } from "./users-api/users-api.service";

import { FetchedUserInterface, UserInterface } from "../../types/user.interface";
import { FetchedTaskInterface, TaskInterface } from "../../types/user-task.interface";

@Injectable()
export class UsersDataService {

  constructor(private usersApiService: UsersApiService) {}

  getUsers(): Observable<UserInterface[]> {
    return this.usersApiService.fetchUsers()
      .pipe(
        map((users: FetchedUserInterface[]) => {
          return users.map((user: FetchedUserInterface) => ({
            ...user,
            address: user.address.city + ', ' + user.address.street + ', ' + user.address.suite,
            company: user.company.name,
          }));
        })
      );
  }

  getUserById(id: number): Observable<UserInterface> {
    return this.usersApiService.fetchUserById(id)
      .pipe(
        map((user: FetchedUserInterface) => {
          let newUser = {
            ...user,
            address: user.address.city + ', ' + user.address.street + ', ' + user.address.suite,
            company: user.company.name,
          };

          return newUser;
        })
      );
  }

  getUserTasks(userId: number): Observable<TaskInterface[]> {
    return this.usersApiService.fetchUserTasks(userId)
      .pipe(
        map((tasks: FetchedTaskInterface[]) => {
          return tasks.map((task: FetchedTaskInterface) => {
            return {
              id: task.id,
              title: task.title,
              completed: task.completed
            };
          })
        })
      );
  }

}
