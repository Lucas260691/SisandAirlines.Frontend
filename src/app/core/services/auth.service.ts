import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, SlimLoginResponse } from './auth.types';
import { Customer } from '../models/customer.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<SlimLoginResponse> {
    return this.http.post<SlimLoginResponse>(`${this.baseUrl}/login`, credentials);
  }

  register(customer: Customer): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, customer);
  }

  me(): Observable<Customer> {
    return this.http.get<Customer>(`${environment.apiUrl}/customers/me`);
  }
}
