import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

type QueryParams = Record<string, string | number | boolean | null | undefined>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: QueryParams, headers?: HttpHeaders): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams, headers })
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: unknown, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string, params?: QueryParams, headers?: HttpHeaders): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`, { params: httpParams, headers })
      .pipe(catchError(this.handleError));
  }

  private buildParams(params?: QueryParams): HttpParams | undefined {
    if (!params) return undefined;
    let hp = new HttpParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== null && v !== undefined) hp = hp.set(k, String(v));
    });
    return hp;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na chamada de API:', error);
    const msg =
      error.error instanceof ErrorEvent
        ? `Erro de cliente: ${error.error.message}`
        : `Erro ${error.status}: ${error.message}`;
    return throwError(() => new Error(msg));
  }
}
