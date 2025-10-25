import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomerService } from '../../../core/services/customer.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: CustomerService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      birthDate: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    const { password, confirmPassword } = this.form.value;
    if (password !== confirmPassword) {
      alert('⚠️ As senhas não conferem!');
      return;
    }

    this.loading = true;
    this.service.register(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/checkout/payment']);
      },
      error: () => {
        this.loading = false;
        alert('❌ Falha ao registrar cliente. Tente novamente.');
      }
    });
  }
}
