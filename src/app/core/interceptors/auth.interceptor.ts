import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CustomerService } from '../services/customer.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const customerService = inject(CustomerService);
  const token = customerService.getToken();

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }

  return next(req);
};
