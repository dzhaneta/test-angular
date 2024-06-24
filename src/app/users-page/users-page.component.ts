import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { UsersDataService } from '../services/users-data.service';

import { UserInterface } from '../../types/user.interface';
import { SortingInterface } from '../../types/sorting.interface';


@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.css'],
})
export class UsersPageComponent implements OnInit, OnDestroy {

  users: UserInterface[] = [];
  columnsHeaders: string[] = ['avatar', 'name', 'username', 'email', 'address'];

  companies: string[] = ['Not selected'];
  companyInput = new FormControl('');
  companySelected: string = this.companies[0];

  sorting: SortingInterface = { column: 'name', order: 'asc' };

  perPageInput = new FormControl('');
  paginationCases: number[] = [3, 5, 10];
  currentPagination = this.paginationCases[0];
  currentPage = 1;

  private destroy$ = new Subject<void>();

  constructor(
    private usersDataService: UsersDataService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // fetch users & companies lists
    this.usersDataService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
        this.changePage(this.currentPage);

        const newCompaniesList: string[] = Array.from(new Set(users.map((user: UserInterface) => user.company)));
        this.companies = ['Not selected', ...newCompaniesList];
        this.companyInput.setValue(this.companies[0]);
      });

    this.companyInput.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(companyValue => {
        if (companyValue !== null) {
          this.companySelected = companyValue;
        }
        this.changePage(1);
        this.cdr.detectChanges();
      });

    this.perPageInput.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(perPageValue => {
        if (perPageValue !== null && !Number.isNaN(perPageValue)) {
          this.currentPagination = Number(perPageValue);
        }
        this.changePage(1);
        this.cdr.detectChanges();
      });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TABLE SORTING
  isDescSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  changeSorting(column: string): void {
    const newSorting: SortingInterface = {
      column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
    };

    this.sorting = newSorting;
    this.changePage(1);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  trackById(index: number, user: UserInterface): number {
    return user.id;
  }
}
