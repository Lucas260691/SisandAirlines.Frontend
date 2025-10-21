import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { FlightService } from '../../../core/services/flight.service';
import { Flight } from '../../../core/models/flight.interface';

@Component({
  selector: 'app-flights-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './flights-list.component.html',
  styleUrls: ['./flights-list.component.scss']
})
export class FlightsListComponent implements OnInit {
  flights: Flight[] = [];
  loading = false;
  queryDate!: string;
  passengers!: number;

  constructor(
    private readonly flightService: FlightService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Record<string, any>) => {
      this.queryDate = params['date'];
      this.passengers = Number(params['passengers']) || 1;

      console.log('📅 Data recebida:', this.queryDate);
      console.log('👥 Passageiros:', this.passengers);

      if (this.queryDate) {
        this.loadFlights();
      }
    });
  }

  loadFlights(): void {
    this.loading = true;

    this.flightService.getAvailableFlights(this.queryDate, this.passengers).subscribe({
      next: (data: Flight[]) => {
        console.log('✅ Voos carregados:', data);
        this.flights = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Erro ao buscar voos:', err);
        this.flights = [];
        this.loading = false;
      }
    });
  }
   canSelectFlight(flight: Flight): boolean {
    return flight.classes.some(cls => cls.canBook);
  }
}
