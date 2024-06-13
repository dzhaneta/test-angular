import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, Subject, debounceTime, distinct, takeUntil } from 'rxjs';

import { UsersDataService } from '../services/users-data.service';

import { UserInterface } from 'src/types/user.interface';
import { SortingInterface } from 'src/types/sorting.interface';


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
  private sortingSubject = new BehaviorSubject<SortingInterface>(this.sorting);
  sorting$ = this.sortingSubject.asObservable();

  perPageInput = new FormControl('');
  paginationCases: number[] = [3, 5, 10];
  currentPage = 1;
  currentPagintation = this.paginationCases[0];

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
      });

    // company filter subscription
    this.companyInput.valueChanges
      .pipe(
        distinct(),
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value !== null) {
          this.companySelected = value;
          this.changePage(1);
          this.cdr.detectChanges();
        };

    })

    // sorting subscription
    this.sorting$
      .pipe(takeUntil(this.destroy$))
      .subscribe(newSorting => {
        this.sorting = newSorting;
        this.changePage(1);
        this.cdr.detectChanges();
      });

    // pagination change subscription
    this.perPageInput.valueChanges
      .pipe(
        distinct(),
        debounceTime(1000),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        if (value !== null) {
          this.currentPagintation = parseInt(value);
          this.currentPage = 1;
          this.changePage(this.currentPage);
        };
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TABLE SORTING
  isDescSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'desc';
  }

  isAscSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }

  changeSorting(column: string): void {
    const futureSortingOrder = this.isDescSorting(column) ? 'asc' : 'desc';
    this.sorting = {
      column,
      order: futureSortingOrder,
    };

    this.sortingSubject.next(this.sorting);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
