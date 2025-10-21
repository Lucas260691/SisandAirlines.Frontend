import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-flights-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  templateUrl: './flights-search.component.html',
  styleUrls: ['./flights-search.component.scss']
})
export class FlightsSearchComponent {
  today = new Date();
  maxDate = new Date(new Date().setDate(this.today.getDate() + 60));

  form!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      date: [this.today, Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(7)]]
    });
  }

  searchFlights(): void {
    if (this.form.invalid) return;

    const date = this.form.value.date?.toISOString().split('T')[0];
    const passengers = this.form.value.passengers;

    this.router.navigate(['/flights/results'], { queryParams: { date, passengers } });
  }
}
