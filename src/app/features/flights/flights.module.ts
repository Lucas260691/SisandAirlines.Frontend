import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsRoutingModule } from './flights-routing.module';
import { FlightsListComponent } from './flights-list/flights-list.component';
import { FlightsSearchComponent } from './flights-search/flights-search.component';

@NgModule({
  imports: [
    CommonModule,
    FlightsRoutingModule,
    FlightsListComponent,
    FlightsSearchComponent
  ]
})
export class FlightsModule {}
