import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginRequest, SlimLoginResponse } from './auth.types';
import { Customer } from '../models/customer.interface';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly TOKEN_KEY = 'sisand_jwt';
  private readonly USER_KEY = 'sisand_user';

  private userSubject = new BehaviorSubject<Customer | null>(this.loadUser());
  user$ = this.userSubject.asObservable();

  constructor(private auth: AuthService) {}

  // ✅ Login de usuário já cadastrado
  login(credentials: LoginRequest) {
    return this.auth.login(credentials);
  }

  // ✅ Registro de novo usuário (usado na tela de cadastro)
  register(customer: Customer) {
    return this.auth.register(customer);
  }

  // ✅ Salva token e informações básicas no localStorage
  saveSession(response: SlimLoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);

    const user: Partial<Customer> = {
      fullName: response.fullName,
      email: response.email
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSubject.next(user as Customer);
  }

  // ✅ Remove sessão (logout)
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
  }

  // ✅ Retorna token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Retorna usuário atual
  getUser(): Customer | null {
    return this.userSubject.value;
  }

  // ✅ Verifica se há um token válido
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && token.length > 10; // validação simples
  }

  // 🔹 Carrega usuário do localStorage (inicialização)
  private loadUser(): Customer | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
