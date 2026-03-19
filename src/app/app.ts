import { Component, signal, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

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
  private platformId = inject(PLATFORM_ID);

  constructor() {
  
    if (isPlatformBrowser(this.platformId)) {
      if (!localStorage.getItem('login')) {
        this.router.navigate(['/login']);
      }
    }
  }
}