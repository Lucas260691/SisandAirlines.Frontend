import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Flight } from '../models/flight.interface';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private readonly endpoint = 'Flights';

  constructor(private api: ApiService) {}

  /**
   * Obtém voos disponíveis para uma data específica.
   * @param date Data no formato YYYY-MM-DD
   * @param passengers (opcional) Quantidade de passageiros
   * @param seatClass (opcional) Classe desejada: ECONOMY ou FIRST
   */
  getAvailableFlights(date: string, passengers?: number, seatClass?: string): Observable<Flight[]> {
    const params: Record<string, string | number> = { date };
    if (passengers) params['passengers'] = passengers;
    if (seatClass) params['class'] = seatClass;

    // Chama a API genérica: GET /Flights/available?date=...
    return this.api.get<Flight[]>(`${this.endpoint}/available`, params);
  }
}
