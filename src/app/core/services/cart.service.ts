import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Estado interno do carrinho
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly flights$ = this.cartItemsSubject.asObservable();

  /**
   * Adiciona um voo ao carrinho.
   */
  addFlight(item: CartItem): void {
    const current = this.cartItemsSubject.getValue();
    this.cartItemsSubject.next([...current, item]);
  }

  /**
   * Remove um voo do carrinho com base no ID do voo.
   */
  removeFlight(flightId: number): void {
    const updated = this.cartItemsSubject
      .getValue()
      .filter(f => f.flightId !== flightId);
    this.cartItemsSubject.next(updated);
  }

  /**
   * Limpa completamente o carrinho.
   */
  clearCart(): void {
    this.cartItemsSubject.next([]);
  }

  /**
   * Calcula o total acumulado do carrinho.
   */
  getTotal(): number {
    return this.cartItemsSubject.getValue().reduce((acc, item) => {
      return acc + item.price * item.passengers;
    }, 0);
  }

  /**
   * Retorna a lista atual de itens no carrinho.
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
}
