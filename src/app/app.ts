import { Component, signal, inject, afterNextRender } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('proyecto-YojanEstiven-angular');

  private router = inject(Router);
  private storageService = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      if (!this.storageService.getItem('login')) {
        this.router.navigate(['/login']);
      }
    });
  }
}