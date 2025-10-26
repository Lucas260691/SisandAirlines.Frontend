import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginRequest, SlimLoginResponse } from './auth.types';
import { Customer } from '../models/customer.interface';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly TOKEN_KEY = 'sisand_jwt';
  private readonly USER_KEY = 'sisand_user';
  private readonly EXPIRATION_KEY = 'sisand_expiration';

  private userSubject = new BehaviorSubject<Customer | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private auth: AuthService) {}

  login(credentials: LoginRequest) {
    return this.auth.login(credentials);
  }

  register(customer: Customer) {
    return this.auth.register(customer);
  }

  saveSession(response: SlimLoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const user: Partial<Customer> = {
      fullName: response.fullName,
      email: response.email
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user as Customer);

    this.refreshSession();
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRATION_KEY);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): Customer | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expired = this.isSessionExpired();
    return !!token && token.length > 10 && !expired;
  }

  refreshSession(): void {
    const token = this.getToken();
    if (!token) return;
    const expiration = Date.now() + 30 * 60 * 1000; // 30 minutos
    localStorage.setItem(this.EXPIRATION_KEY, expiration.toString());
  }

  isSessionExpired(): boolean {
    const exp = localStorage.getItem(this.EXPIRATION_KEY);
    if (!exp) return true;
    return Date.now() > parseInt(exp, 10);
  }

  private loadUser(): Customer | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
