import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../core/services/flight.service';
import { CartService } from '../../../core/services/cart.service';
import { Flight, FareClass } from '../../../core/models/flight.interface';

@Component({
  selector: 'app-flights-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatButtonModule,
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
    private readonly cartService: CartService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
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

  selectFlight(flight: Flight, fareClass: FareClass): void {
    if (!fareClass.canBook) {
      console.warn('⚠️ Classe selecionada indisponível:', fareClass.fareClass);
      return;
    }

    const cartItem = {
      flightId: flight.id,
      origin: flight.origin,
      destination: flight.destination,
      departureAt: flight.departureAt,
      arrivalAt: flight.arrivalAt,
      fareClass: fareClass.fareClass,
      price: fareClass.baseFare,
      passengers: this.passengers
    };

    this.cartService.addFlight(cartItem);
    console.log('🛒 Adicionado ao carrinho:', cartItem);

    this.router.navigate(['/checkout/cart']);
  }
}
