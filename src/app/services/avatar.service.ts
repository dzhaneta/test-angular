import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError } from "rxjs";

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
