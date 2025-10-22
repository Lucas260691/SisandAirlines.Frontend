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
