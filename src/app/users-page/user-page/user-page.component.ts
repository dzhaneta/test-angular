import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { EMPTY, Subject, Subscription, catchError, map, of, switchMap, takeUntil } from 'rxjs';

import { UsersDataService } from '../../services/users-data.service';
import { UserInterface } from '../../../types/user.interface';
import { TaskInterface } from '../../../types/user-task.interface';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {

  id: number = 0;
  userDetails: UserInterface = {} as UserInterface;
  userTasks: TaskInterface[] = [];
  user$: Subscription = new Subscription();

  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private usersDataService: UsersDataService
  ) { }

  ngOnInit() {
    this.user$ = this.route.params
      .pipe(
        takeUntil(this.destroy$),
        map((params: Params) => +params['id']),
        switchMap(id => {
          if (isNaN(id)) {
            throw new Error('Некорректный id пользователя.');
          } else {
            this.id = id;
            return this.usersDataService.getUserById(this.id);
          }
        }),
        switchMap((user: UserInterface) => {
          this.userDetails = user;

          if (user) {
            return this.usersDataService.getUserTasks(this.id);
          } else {
            return EMPTY;
          }
        }),
        catchError(error => {
          this.error = error.message;
          return of(null);
        })
      )
      .subscribe((tasks: TaskInterface[] | null) => {
        if(tasks) {
          this.userTasks = tasks;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
