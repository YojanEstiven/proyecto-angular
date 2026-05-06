import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private storageService = inject(StorageService);

  navItems = [
    { label: 'Vehículos', icon: '🚙', path: '/vehiculos' },
    { label: 'Ingreso', icon: '📥', path: '/ingreso' },
    { label: 'Salida', icon: '📤', path: '/salida' },
    { label: 'Historial', icon: '📅', path: '/historial' },
    { label: 'Mapa', icon: '🗺️', path: '/mapa' },
    { label: 'Ajustes', icon: '⚙️', path: '/configuracion' }
  ];

  logout() {
    this.storageService.removeItem('login');
    this.router.navigate(['/login']);
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
