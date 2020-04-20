import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { take, catchError } from 'rxjs/operators';

@Injectable()
export class DatabaseProvider {


  constructor(
    private http: HttpClient) {

  }

  getPlayers(): Observable<any> {
    const URL = `http://www.goprofissa.com/sbi/selectJogadores.php`;

    return this.http.get<any>(URL, this.fullJson())
      .pipe(
        take(1),
        catchError(this.handleError)
      );
  }
  
  getAllPlayers(): Observable<any> {
    const URL = `http://www.goprofissa.com/sbi/selectJogadoresOption.php`;

    return this.http.get<any>(URL, this.fullJson())
      .pipe(
        take(1),
        catchError(this.handleError)
      );
  }

  transferMoney(value): Observable<any> {
    const URL = `http://www.goprofissa.com/sbi/updateTransferencia.php`;
    const body = JSON.stringify(value);

    return this.http.put<any>(URL, body, this.fullJson())
      .pipe(
        take(1),
        catchError(this.handleError)
      );
  }

  resetValues(): Observable<any> {
    const URL = `http://www.goprofissa.com/sbi/updateReiniciar.php`;

    return this.http.put<any>(URL, {}, this.fullJson())
      .pipe(
        take(1),
        catchError(this.handleError)
      );
  }

  private fullJson(): any {
    return {
        headers: new HttpHeaders({
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8;application/json',
            'Content-Type': 'application/json'
        })
    };
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
