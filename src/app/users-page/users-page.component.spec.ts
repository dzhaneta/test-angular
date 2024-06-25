import { ChangeDetectorRef, PipeTransform } from '@angular/core';
import { UsersDataService } from "../services/users-data.service";
import { UsersPageComponent } from "./users-page.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { UsersApiService } from "../services/users-api/users-api.service";
import { CommonModule, TitleCasePipe } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { PaginationModule } from "../shared/pagination/pagination.module";
import { ArraySortPipe } from "../shared/pipes/sort.pipe";
import { FilterPipe } from "../shared/pipes/filter/filter.pipe";
import { PaginationPipe } from "../shared/pipes/pagination.pipe";
import { SafePipe } from "../shared/pipes/safe.pipe";
import { provideHttpClient } from "@angular/common/http";
import { of } from "rxjs";
import { UserInterface } from "src/types/user.interface";
import { provideRouter } from "@angular/router";
import { UserPageComponent } from "./user-page/user-page.component";
import { SortingInterface } from 'src/types/sorting.interface';
import { RouterTestingModule } from '@angular/router/testing';


describe('UsersPageComponent', () => {
  let component: UsersPageComponent;
  let componentEl: HTMLElement;
  let fixture: ComponentFixture<UsersPageComponent>;
  let usersDataService: UsersDataService;
  let usersApiService: UsersApiService;
  let cdr: ChangeDetectorRef;

  const mockUsers: UserInterface[] = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@example.com',
      address: '123 Main St',
      phone: '123-456-7890',
      website: 'johndoe.com',
      company: 'ABC Corp',
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'janesmith@example.com',
      address: '456 Elm St',
      phone: '987-654-3210',
      website: 'janesmith.com',
      company: 'XYZ Corp',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      username: 'bobjohnson',
      email: 'bobjohnson@example.com',
      address: '789 Oak St',
      phone: '555-555-5555',
      website: 'bobjohnson.com',
      company: 'DEF Corp',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UsersPageComponent, PaginationPipe, ArraySortPipe, FilterPipe, SafePipe],
      imports: [ReactiveFormsModule, CommonModule, PaginationModule, RouterTestingModule],
      providers: [
        UsersDataService,
        UsersApiService,
        provideHttpClient(),
        provideRouter([{ path: ':id', component: UserPageComponent }]),
        ChangeDetectorRef
      ]
    }).compileComponents();


    usersDataService = TestBed.inject(UsersDataService);
    cdr = TestBed.inject(ChangeDetectorRef);

    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeDefined();
  });


  it('should fetch users & companies on initialization', () => {


    jest.spyOn(usersDataService, 'getUsers').mockReturnValue(of(mockUsers));

    component.ngOnInit();
    expect(component.users).toEqual(mockUsers);
    expect(component.companies).toEqual(['Not selected', 'ABC Corp', 'XYZ Corp', 'DEF Corp']);
    expect(component.companyInput.value).toEqual('Not selected');
  });

  describe('company selector', () => {

    it('should render correctly on initialization', () => {
      jest.spyOn(usersDataService, 'getUsers').mockReturnValue(of(mockUsers));
      component.ngOnInit();

      fixture.detectChanges();

      componentEl = fixture.debugElement.nativeElement;
      const companiesEls = componentEl.querySelectorAll('.company-select option');
      expect(companiesEls.length).toEqual(component.companies.length);

      companiesEls.forEach((companyEl, index) => {
          expect(companyEl.textContent).toEqual(component.companies[index].toString());
      });
    });

    it('should update company selection', () => {
      const mockCompany = 'company1';
      component.ngOnInit();

      jest.spyOn(component.companyInput.valueChanges, 'pipe').mockReturnValue(of(mockCompany));
      jest.spyOn(component, 'changePage');

      component.companyInput.setValue(mockCompany);

      expect(component.companySelected).toBe(mockCompany);
      expect(component.changePage).toHaveBeenCalledWith(1);
      expect(component.cdr.detectChanges).toHaveBeenCalled();
    });

  });

  describe('per page selector', () => {

    it('should render correctly on initialization', () => {
      const mockPaginationsCases = [3, 5, 10];
      component.paginationCases = mockPaginationsCases;
      component.ngOnInit();

      fixture.detectChanges();

      componentEl = fixture.debugElement.nativeElement;
      const perPageEls = componentEl.querySelectorAll('.per-page-select option');
      expect(perPageEls.length).toEqual(component.paginationCases.length);

      perPageEls.forEach((perPageEl, index) => {
          expect(perPageEl.textContent).toEqual(component.paginationCases[index].toString());
      });
    });

  });

  describe('users table', () => {

    it('should render correctly on initialization', () => {
      const mockColumnsHeaders = ['avatar', 'name', 'username'];
      const mockSorting: SortingInterface = { column: 'username', order: 'asc' };
      component.columnsHeaders = mockColumnsHeaders;
      component.sorting = mockSorting;

      jest.spyOn(usersDataService, 'getUsers').mockReturnValue(of(mockUsers));
      component.ngOnInit();
      fixture.detectChanges();

      componentEl = fixture.debugElement.nativeElement;

      // column headers with titlecase pipe implemented
      const columnsEls = componentEl.querySelectorAll('.users-table thead tr th');
      const titleCasePipe = new TitleCasePipe();
      expect(columnsEls.length).toEqual(component.columnsHeaders.length);

      columnsEls.forEach((columnEl, index) => {
        if (component.columnsHeaders[index] === component.sorting.column) {
          expect(columnEl.textContent?.trim())
            .toEqual(`${titleCasePipe.transform(component.columnsHeaders[index])} ${component.isDescSorting(component.columnsHeaders[index]) ? '▼' : '▲'}`);
        } else {
          expect(columnEl.textContent?.trim()).toEqual(titleCasePipe.transform(component.columnsHeaders[index]));
        }
      });

      const sortPipe = new ArraySortPipe();
      const sortedUsers = sortPipe.transform(mockUsers, mockSorting.column, mockSorting.order);

      // users rows
      const usersRowsEls = componentEl.querySelectorAll('.users-table tbody tr');
      expect(usersRowsEls.length).toEqual(component.users.length);


      // user columns
      usersRowsEls.forEach((userRowEl, userIndex) => {
        const userColumnsEls = userRowEl.querySelectorAll('td');
        expect(userColumnsEls.length).toEqual(component.columnsHeaders.length);

        userColumnsEls.forEach((userColumnEl, index) => {
          switch (component.columnsHeaders[index]) {
            case 'avatar':
              expect(userColumnEl.querySelector('img')).toBeTruthy();
              expect(userColumnEl.querySelector('img')?.getAttribute('src'))
                .toEqual(`https://randomuser.me/api/portraits/med/men/${sortedUsers[userIndex].id}.jpg`);
              break;
            case 'username':
              expect(userColumnEl.querySelector('a')).toBeTruthy();
              expect(userColumnEl.querySelector('a')?.getAttribute('href'))
                .toEqual(`/users/${sortedUsers[userIndex].id}`);
              expect(userColumnEl.querySelector('a')?.textContent?.trim()).toEqual(sortedUsers[userIndex][component.columnsHeaders[index]]);
              break;
            default:
              const spanElement = userColumnEl.querySelector('span');
              if (spanElement) {
                expect(spanElement).toBeTruthy();
                expect(spanElement.textContent?.trim()).toEqual(sortedUsers[userIndex][component.columnsHeaders[index]]);
              } else {
                fail(`span element not found in column ${component.columnsHeaders[index]}`);
              }
              break;
          }
        });

      });
    });

  });

});
