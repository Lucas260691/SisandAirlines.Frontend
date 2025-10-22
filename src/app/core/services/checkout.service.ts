import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly endpoint = 'Bookings';

  constructor(private api: ApiService) {}

  createBooking(payload: any): Observable<any> {
    return this.api.post(`${this.endpoint}`, payload);
  }

  payWithPix(bookingId: number): Observable<any> {
    return this.api.post(`${this.endpoint}/${bookingId}/pay/pix`, {});
  }
}
