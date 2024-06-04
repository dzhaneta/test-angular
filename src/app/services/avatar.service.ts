import { Injectable } from "@angular/core";
import { Observable, catchError, concat, map, tap, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private http: HttpClient) {}

  getAvatars(qty: number) {
    const url = `https://randomuser.me/api/?inc=picture&results=${qty}`;
    return this.http
      .get(url)
      .pipe(
        map((res: any) =>{
          const avatars = res.results.map((item: any) => item.picture.medium);
          return avatars;
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => new Error('Аватарки не загрузились! Попробуйте позже.'));
        })
      );
  }

}
