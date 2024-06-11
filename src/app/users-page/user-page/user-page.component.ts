import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { EMPTY, Subscription, catchError, map, of, switchMap } from 'rxjs';

import { UsersService } from '../../services/users.service';
import { UserInterface, UserTaskInterface } from 'src/types/user.interface';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, OnDestroy {

  id: number = 0;
  userDetails: UserInterface = {} as UserInterface;
  userTasks: UserTaskInterface[] = [];
  user$: Subscription = new Subscription();

  error = '';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.user$ = this.route.params
      .pipe(
        map((params: Params) => +params['id']),
        switchMap(id => {
          if (isNaN(id)) {
            throw new Error('Некорректный id пользователя.');
          } else {
            this.id = id;
            return this.usersService.getUserById(this.id);
          }
        }),
        switchMap((user: UserInterface) => {
          this.userDetails = user;

          if (user) {
            return this.usersService.getUserTasks(this.id);
          } else {
            return EMPTY;
          }
        }),
        catchError(error => {
          this.error = error.message;
          return of(null);
        })
      )
      .subscribe((tasks: UserTaskInterface[] | null) => {
        if(tasks) {
          this.userTasks = tasks;
        }
      });
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
