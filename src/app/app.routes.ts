import { Routes } from '@angular/router';

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
    path: 'checkout/payment',
    loadComponent: () =>
      import('./features/checkout/payment/payment.component').then(m => m.PaymentComponent)
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
