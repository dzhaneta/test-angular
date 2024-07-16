import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { UsersApiService } from './users-api.service';

import { FetchedUserInterface } from 'src/types/user.interface';
import { FetchedTaskInterface } from 'src/types/user-task.interface';

describe('UsersApiService', () => {
  let usersApiService: UsersApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersApiService]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    usersApiService = TestBed.inject(UsersApiService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  // METHODS TESTING

  describe('fetchUsers', () => {
    let expectedUsers: FetchedUserInterface[] = [
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        address: {
          street: '123 Main St',
          suite: 'Apt 4B',
          city: 'New York',
          zipcode: '10001',
          geo: {
            lat: '40.7128',
            lng: '-74.0060',
          },
        },
        phone: '123-456-7890',
        website: 'https://example.com',
        company: {
          bs: 'Big Data Startup',
          catchPhrase: 'Data is the new oil',
          name: 'Example Inc',
        },
      },
      {
        id: 2,
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane.smith@example.com',
        address: {
          street: '456 Oak St',
          suite: 'Apt 5C',
          city: 'San Francisco',
          zipcode: '94101',
          geo: {
            lat: '37.7898',
            lng: '-122.4312',
          },
        },
        phone: '987-654-3210',
        website: 'https://example.org',
        company: {
          bs: 'E-commerce Platform',
          catchPhrase: 'Shop anywhere',
          name: 'Example Corp',
        },
      },
    ];

    it('should return expected users', () => {
      usersApiService.fetchUsers()
        .subscribe(users => expect(users).toEqual(expectedUsers));

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/users`);
      expect(req.request.method).toEqual('GET');

      req.flush(expectedUsers);
    });

    it('should be OK returning no users', () => {
      usersApiService.fetchUsers()
        .subscribe(users => expect(users.length).toEqual(0));

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/users`);

      req.flush([]);
    });

    it('should return custom error message in case of error', () => {
      const mockError = new ProgressEvent('error');
      const errMsg = 'Что-то пошло не так на сервере. Попробуйте позже.';

      usersApiService.fetchUsers()
        .subscribe({
          next: () => fail('expected an error'),
          error: (error: HttpErrorResponse) => expect(error.message).toEqual(errMsg),
        });

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/users`);

      req.error(mockError);
    });

  });

  describe('fetchUserById', () => {
    let expectedUser: FetchedUserInterface = {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john.doe@example.com',
      address: {
        street: '123 Main St',
        suite: 'Apt 4B',
        city: 'New York',
        zipcode: '10001',
        geo: {
          lat: '40.7128',
          lng: '-74.0060',
        },
      },
      phone: '123-456-7890',
      website: 'https://example.com',
      company: {
        bs: 'Big Data Startup',
        catchPhrase: 'Data is the new oil',
        name: 'Example Inc',
      },
    };
    let id = 1;

    it('should return one user by id', () => {

      usersApiService.fetchUserById(id)
        .subscribe(user => expect(user).toEqual(expectedUser));

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/users/${id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(expectedUser);
    });

    it('should return custom error message in case of error', () => {
      const mockError = new ProgressEvent('error');
      const errMsg = 'Пользователь не найден.';

      usersApiService.fetchUserById(id)
        .subscribe({
          next: () => fail('expected an error'),
          error: (error: HttpErrorResponse) => expect(error.message).toEqual(errMsg),
        });

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/users/${id}`);

      req.error(mockError);
    });

  });

  describe('fetchUserTasks', () => {
    let expectedTasks: FetchedTaskInterface[] = [
      {
        id: 1,
        title: "Task 1",
        completed: false,
        userId: 1,
      },
      {
        id: 2,
        title: "Task 2",
        completed: true,
        userId: 2,
      },
      {
        id: 3,
        title: "Task 3",
        completed: false,
        userId: 3,
      },
    ];
    let userId = 1;

    it('should return all user tasks', () => {
      usersApiService.fetchUserTasks(userId)
        .subscribe(tasks => expect(tasks).toEqual(expectedTasks));

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/todos?userId=${userId}`);
      expect(req.request.method).toEqual('GET');

      req.flush(expectedTasks);
    });

    it('should be OK returning no tasks', () => {
      usersApiService.fetchUserTasks(userId)
        .subscribe(tasks => expect(tasks.length).toEqual(0));

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/todos?userId=${userId}`);

      req.flush([]);
    });

    it('should return custom error message in case of error', () => {
      const mockError = new ProgressEvent('error');
      const errMsg = 'Что-то пошло не так при загрузке задач пользователя. Попробуйте позже.';

      usersApiService.fetchUserTasks(userId)
        .subscribe({
          next: () => fail('expected an error'),
          error: (error: HttpErrorResponse) => expect(error.message).toEqual(errMsg),
        });

      const req = httpTestingController.expectOne(`${usersApiService.apiUrl}/todos?userId=${userId}`);

      req.error(mockError);
    });

  });

});
