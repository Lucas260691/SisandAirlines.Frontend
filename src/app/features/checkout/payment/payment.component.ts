import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import * as QRCode from 'qrcode';
import { CartService } from '../../../core/services/cart.service';
import { CustomerService } from '../../../core/services/customer.service';

export interface CartItem {
  flightId: number;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  fareClass: string;
  price: number;
  passengers: number;
}

@Component({
  standalone: true,
  selector: 'app-payment',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentComponent {
  private readonly cartService = inject(CartService);
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  itemsSig = signal<CartItem[]>([]);
  loadingQr = signal(true);

  totalSig = computed(() =>
    this.itemsSig().reduce((acc, it) => acc + it.price * it.passengers, 0)
  );

  pixPayloadSig = signal<string>('');
  qrDataUrlSig = signal<string>('');

  constructor() {
    const sub = (this.cartService as any).flights$?.subscribe?.(
      (items: CartItem[]) => {
        this.itemsSig.set(items ?? []);
        this.generatePixQr();
      }
    );
    // @ts-ignore
    this._sub = sub;
    this.generatePixQr();
  }

  private buildFakePixPayload(amount: number): string {
    const txid =
      'SISAND-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const merchant = 'Sisand Airlines';
    const city = 'CURITIBA';
    const value = amount.toFixed(2);

    return [
      `000201`,
      `26SISANDPIXKEY:00000000`,
      `52040000`,
      `5303986`,
      `540${value}`,
      `5802BR`,
      `59${merchant}`,
      `60${city}`,
      `62TXID:${txid}`,
      `6307ABCD`,
    ].join('|');
  }

  async generatePixQr() {
    const total = this.totalSig();
    if (total <= 0) {
      this.pixPayloadSig.set('');
      this.qrDataUrlSig.set('');
      this.loadingQr.set(false);
      return;
    }

    this.loadingQr.set(true);
    const payload = this.buildFakePixPayload(total);
    this.pixPayloadSig.set(payload);

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        margin: 1,
        scale: 6,
      });
      this.qrDataUrlSig.set(dataUrl);
    } catch (err) {
      console.error('Erro ao gerar QR:', err);
      this.snack.open('Falha ao gerar QR Code do Pix.', 'OK', { duration: 3000 });
      this.qrDataUrlSig.set('');
    } finally {
      this.loadingQr.set(false);
    }
  }

  confirmPayment() {
    if (this.totalSig() <= 0) {
      this.snack.open('Seu carrinho está vazio.', 'OK', { duration: 2500 });
      return;
    }

    this.snack.open(
      'Pagamento confirmado! Obrigado por voar com a Sisand Airlines ✈️',
      'Fechar',
      { duration: 2600 }
    );

    setTimeout(() => {
      this.cartService.clearCart();
      this.customerService.logout();
      this.router.navigate(['/customer/login']);
    }, 2600);
  }

  cancel() {
    this.router.navigate(['/checkout/cart']);
  }

  trackById = (_: number, it: CartItem) =>
    `${it.flightId}-${it.fareClass}-${it.departureAt}`;
}
