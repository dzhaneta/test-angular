import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UsersService } from '../services/users.service';
import { UserInterface, UserTaskInterface } from 'src/types/user.interface';
import { Subscription, catchError, forkJoin, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

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
        switchMap((params: Params) => {
          this.id = +params['id'];

          return this.usersService.getUserById(this.id)
            .pipe(
              switchMap((user: UserInterface) => {
                console.log('user', user);
                this.userDetails = user;

                if(user) {
                  return this.usersService.getUserTasks(this.id);
                } else {
                  return of(null); // Return a dummy observable if user is not found
                }
              }),
              catchError(error => {
                console.log('ERROR HERE!', error.message);
                this.error = error.message;
                return of(null); // Return a dummy observable in case of error
              })
            );
        })
      )
      .subscribe((tasks: UserTaskInterface[] | null) => {
        if(tasks) {
          console.log('tasks', tasks);
          this.userTasks = tasks;
        }
      });
  }

  ngOnDestroy() {
    this.user$.unsubscribe();
  }
}
