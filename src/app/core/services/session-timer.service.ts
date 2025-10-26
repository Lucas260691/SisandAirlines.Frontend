import { Injectable, NgZone } from '@angular/core';
import { CustomerService } from './customer.service';

@Injectable({ providedIn: 'root' })
export class SessionTimerService {
  private timeoutId: any;
  private readonly INACTIVITY_LIMIT = 30 * 60 * 1000;

  constructor(
    private readonly zone: NgZone,
    private readonly customerService: CustomerService
  ) {}

  init(): void {
    this.resetTimer();
    this.listenToUserActivity();
  }

  private listenToUserActivity(): void {
    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];

    events.forEach(event =>
      window.addEventListener(event, () => this.resetTimer(), { passive: true })
    );
  }

  private resetTimer(): void {
    clearTimeout(this.timeoutId);
    this.zone.runOutsideAngular(() => {
      this.timeoutId = setTimeout(() => {
        this.zone.run(() => this.handleInactivity());
      }, this.INACTIVITY_LIMIT);
    });
  }

  private handleInactivity(): void {
    if (this.customerService.isSessionExpired()) {
      console.warn('⏰ Sessão expirada por inatividade');
      this.customerService.logout();
      window.location.href = '/customer/login';
    }
  }
}
