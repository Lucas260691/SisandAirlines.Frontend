import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, SlimLoginResponse } from './auth.types';
import { Customer } from '../models/customer.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authUrl = `${environment.apiUrl}/auth`;
  private readonly customersUrl = `${environment.apiUrl}/customers`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<SlimLoginResponse> {
    return this.http.post<SlimLoginResponse>(`${this.authUrl}/login`, credentials);
  }

  register(customer: Customer): Observable<any> {
    return this.http.post(this.customersUrl, customer);
  }

  me(): Observable<Customer> {
    return this.http.get<Customer>(`${this.customersUrl}/me`);
  }
}
