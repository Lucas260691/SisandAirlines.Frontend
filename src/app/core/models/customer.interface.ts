export interface Customer {
  id?: number;
  fullName: string;
  email: string;
  cpf: string;
  birthDate: string;
  password: string;
  confirmPassword?: string;
}
