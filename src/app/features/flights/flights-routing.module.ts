import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlightsListComponent } from './flights-list/flights-list.component';
import { FlightsSearchComponent } from './flights-search/flights-search.component';

const routes: Routes = [
  { path: '', component: FlightsSearchComponent },
  { path: 'results', component: FlightsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FlightsRoutingModule {}
