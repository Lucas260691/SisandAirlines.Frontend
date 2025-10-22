import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'sisand_airlines_cart';
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>(this.loadFromStorage());
  readonly flights$ = this.cartItemsSubject.asObservable();

  private saveToStorage(items: CartItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  addFlight(item: CartItem): void {
    const current = this.cartItemsSubject.getValue();
    const updated = [...current, item];
    this.cartItemsSubject.next(updated);
    this.saveToStorage(updated);
  }

  removeFlight(flightId: number): void {
    const updated = this.cartItemsSubject.getValue().filter(f => f.flightId !== flightId);
    this.cartItemsSubject.next(updated);
    this.saveToStorage(updated);
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getTotal(): number {
    return this.cartItemsSubject.getValue().reduce((acc, item) => acc + item.price * item.passengers, 0);
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.getValue();
  }
}
