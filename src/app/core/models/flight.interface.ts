export interface FareClass {
  fareClass: string;
  baseFare: number;
  availableSeats: number;
  canBook: boolean;
}
export interface Flight {
  id: number;
  origin: string;
  destination: string;
  departureAt: string;
  arrivalAt: string;
  price: number;
  classes: FareClass[];
}
