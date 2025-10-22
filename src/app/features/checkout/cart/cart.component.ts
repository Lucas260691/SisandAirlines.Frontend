import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CurrencyPipe
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  flights$!: import('rxjs').Observable<CartItem[]>;

  constructor(
    private readonly cartService: CartService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Corrigido: o observable agora é de CartItem[]
    this.flights$ = this.cartService.flights$;
  }

  removeFlight(id: number): void {
    this.cartService.removeFlight(id);
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout/payment']);
  }

  get total(): number {
    return this.cartService.getTotal();
  }
}
