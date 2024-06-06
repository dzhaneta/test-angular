import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { catchError, map, of, switchMap, throwError } from "rxjs";

import { AvatarService } from "./avatar.service";

import { UserInterface } from "src/types/user.interface";
import { SortingInterface } from "src/types/sorting.interface";

@Injectable()
export class UsersService {
  private cachedUsers: UserInterface[] = [];

  constructor(private http: HttpClient, private avatarService: AvatarService) {}

  getUsers(sorting: SortingInterface) {
    const url = `https://jsonplaceholder.typicode.com/users`;
    return this.http
      .get(url)
      .pipe(
        map((res: any) => res),
        switchMap((users: any) => {
          return this.avatarService.getAvatars(users.length)
            .pipe(
              map((avatars: any) => {
                let usersAvatars: string[] = avatars;
                this.cachedUsers = users.map((user: any, i: number) => ({
                  ...user,
                  avatar: usersAvatars[i],
                  address: user.address.city + ', ' + user.address.street + ', ' + user.address.suite,
                  company: user.company.name,
                }));
                return this.cachedUsers;
              }),
            );
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error('Что-то пошло не так на сервере. Попробуйте позже.'));
        })
      );
  }

  getUserById(id: number) {
    const cachedUser = this.cachedUsers.find(user => user.id === id);
    if (cachedUser) {
      return of(cachedUser);
    } else {
      return this.http
        .get(`https://jsonplaceholder.typicode.com/users/${id}`)
        .pipe(
          switchMap((user: any) => {
            return this.avatarService.getAvatars(1)
              .pipe(
                map((avatars: any) => {
                  let usersAvatars: string[] = avatars;

                  let newUser = {
                    ...user,
                    avatar: usersAvatars[0],
                    address: user.address.city + ', ' + user.address.street + ', ' + user.address.suite,
                    company: user.company.name,
                  };

                  return newUser;
                }),
              );
          }),
          catchError((err: HttpErrorResponse) => {
            return throwError(() => new Error('Пользователь не найден.'));
          })
        );
    }
  }

  getUserTasks(userId: number) {
    const url = `https://jsonplaceholder.typicode.com/todos?userId=${userId}`;
    return this.http
      .get(url)
      .pipe(
        map((res: any) => res),
        map(tasks => {
          return tasks.map((task: any) => {
            return {
              id: task.id,
              title: task.title,
              completed: task.completed
            };
          })
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error('Что-то пошло не так при загрузке задач пользователя. Попробуйте позже.'));
        })
      );
  }

}
