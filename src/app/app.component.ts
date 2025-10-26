import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SessionTimerService } from './core/services/session-timer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Sisand Airlines';

  private readonly sessionTimer = inject(SessionTimerService);

  ngOnInit(): void {
    this.sessionTimer.init();
  }
}
