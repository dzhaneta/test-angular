import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, Subject, combineLatest, startWith, takeUntil } from 'rxjs';

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
  private sorting$ = new BehaviorSubject<SortingInterface>(this.sorting);

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

    combineLatest([
      this.companyInput.valueChanges.pipe(startWith('Not selected')),
      this.sorting$.pipe(startWith(this.sorting)),
      this.perPageInput.valueChanges.pipe(startWith(this.currentPagintation))
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([companyValue, sortingValue, perPageValue]) => {
        console.log('combineLatest start', companyValue, sortingValue, perPageValue);

        if (companyValue !== null) {
          this.companySelected = companyValue;
        }

        console.log('sortingValue', sortingValue);
        this.sorting = sortingValue;

        console.log('sorting changed', this.sorting);

        if (perPageValue !== null) {
          this.changePage(1);

          this.currentPagintation = parseInt(String(perPageValue));
          console.log('combineLtst perPage & currPgntn', perPageValue, this.currentPagintation);

        }

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

  isAscSorting(column: string): boolean {
    return this.sorting.column === column && this.sorting.order === 'asc';
  }

  changeSorting(column: string): void {
    const newSorting: SortingInterface = {
      column,
      order: this.isDescSorting(column) ? 'asc' : 'desc',
    };

    this.sorting$.next(newSorting);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
