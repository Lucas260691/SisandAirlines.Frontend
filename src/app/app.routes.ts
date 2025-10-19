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
    path: '**',
    redirectTo: 'flights'
  }
];
