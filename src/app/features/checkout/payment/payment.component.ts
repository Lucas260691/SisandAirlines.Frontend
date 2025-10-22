import { Component, ChangeDetectionStrategy, computed, effect, inject, signal } from '@angular/core';
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
    MatProgressSpinnerModule
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentComponent {
  private readonly cartService = inject(CartService);
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

    const sub = (this.cartService as any).flights$.subscribe?.((items: CartItem[]) => {
      this.itemsSig.set(items ?? []);
      this.generatePixQr();
    });

    // limpa subscription quando o componente sair (Angular signals não têm ngOnDestroy automático)
    // Como o comp é standalone simples, deixamos assim; caso use @DestroyRef, ajuste.
    // @ts-ignore
    this._sub = sub;

    this.generatePixQr();
  }

  private buildFakePixPayload(amount: number): string {

    const txid = 'SISAND-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const merchant = 'Sisand Airlines';
    const city = 'CURITIBA';

    const value = amount.toFixed(2);
    return [
      `000201`,                    // cabeçalho fictício
      `26SISANDPIXKEY:00000000`,  // chave fake
      `52040000`,                 // merchant category code fake
      `5303986`,                  // moeda BRL (986)
      `540${value}`,              // valor
      `5802BR`,                   // país
      `59${merchant}`,            // nome recebedor
      `60${city}`,                // cidade
      `62TXID:${txid}`,           // txid
      `6307ABCD`                  // CRC fake
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
        scale: 6
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

    this.snack.open('Pagamento confirmado! Obrigado por voar com a Sisand Airlines ✈️', 'Fechar', {
      duration: 2600
    });

    this.cartService.clearCart();
    this.router.navigate(['/checkout/success']);
  }

  cancel() {
    this.router.navigate(['/checkout/cart']);
  }

  trackById = (_: number, it: CartItem) => `${it.flightId}-${it.fareClass}-${it.departureAt}`;

}
