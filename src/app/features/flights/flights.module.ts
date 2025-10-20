import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightsRoutingModule } from './flights-routing.module';
import { FlightsListComponent } from './flights-list/flights-list.component';

@NgModule({
  imports: [
    CommonModule,
    FlightsRoutingModule,
    FlightsListComponent
  ]
})
export class FlightsModule {}
