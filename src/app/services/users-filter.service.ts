import { Injectable } from '@angular/core';
import { UserInterface } from 'src/types/user.interface';

@Injectable()
export class UsersFilterService {

  constructor() { }

  filterByCompany(users: UserInterface[], company: string): UserInterface[] {
    if (company !== 'Not selected') {
      return users.filter((user: any) => user.company === company);
    } else {
      return users;
    }
  }

}
