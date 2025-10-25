import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'flights',
    pathMatch: 'full'
  },
  {
    path: 'flights',
    loadChildren: () =>
      import('./features/flights/flights.module').then(m => m.FlightsModule)
  },
  {
    path: 'checkout/cart',
    loadComponent: () =>
      import('./features/checkout/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'customer/register',
    loadComponent: () => import('./features/customer/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'customer/login',
    loadComponent: () => import('./features/customer/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'checkout/payment',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/checkout/payment/payment.component').then(m => m.PaymentComponent)
  },
  {
    path: 'checkout/success',
    loadComponent: () =>
      import('./features/checkout/payment/payment-success.component').then(m => m.PaymentSuccessComponent)
  },
  {
    path: '**',
    redirectTo: 'flights'
  }
];
