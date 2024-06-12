import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, catchError, throwError } from "rxjs";

import { FetchedUserInterface } from "../../types/user.interface";
import { FetchedTaskInterface } from "../../types/user-task.interface";

@Injectable()
export class UsersApiService {

  private readonly apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<FetchedUserInterface[]> {
    return this.http
      .get<FetchedUserInterface[]>(`${this.apiUrl}/users`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error('Что-то пошло не так на сервере. Попробуйте позже.'));
        })
      );
  }

  fetchUserById(id: number): Observable<FetchedUserInterface> {
    return this.http
      .get<FetchedUserInterface>(`${this.apiUrl}/users/${id}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error('Пользователь не найден.'));
        })
      );
  }

  fetchUserTasks(userId: number): Observable<FetchedTaskInterface[]> {
    return this.http
      .get<FetchedTaskInterface[]>(`${this.apiUrl}/todos?userId=${userId}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error('Что-то пошло не так при загрузке задач пользователя. Попробуйте позже.'));
        })
      );
  }
}
