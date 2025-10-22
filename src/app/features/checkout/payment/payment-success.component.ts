import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'app-payment-success',
  imports: [CommonModule, MatButtonModule, RouterModule, MatIconModule],
  template: `
    <div class="wrap">
      <mat-icon color="primary" style="font-size:64px;height:64px;width:64px;">verified</mat-icon>
      <h2>Pagamento confirmado!</h2>
      <p>Sua compra foi concluída com sucesso. Um e-mail de confirmação será enviado em instantes.</p>
      <button mat-flat-button color="primary" (click)="goHome()">Voltar ao início</button>
    </div>
  `,
  styles: [`
    .wrap {
      max-width: 720px;
      margin: 48px auto;
      text-align: center;
      display: grid;
      gap: 12px;
      align-items: center;
      justify-items: center;
    }
  `]
})
export class PaymentSuccessComponent {
  constructor(private router: Router) {}
  goHome() { this.router.navigate(['/']); }
}
