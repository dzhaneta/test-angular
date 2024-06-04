import { Injectable } from '@angular/core';
import { UserInterface } from 'src/types/user.interface';
import { SortingInterface } from 'src/types/sorting.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersSortService {

  constructor() { }

  sortUsers(users: UserInterface[], sorting: SortingInterface): UserInterface[] {
    return users.sort((a, b) => {
      if (sorting.order === 'asc') {
        return a[sorting.column].localeCompare(b[sorting.column]);
      } else {
        return b[sorting.column].localeCompare(a[sorting.column]);
      }
    });
  }

}
