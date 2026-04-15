import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {

  navItems = [
    { label: 'Vehículos', icon: '🚙', iconClass: 'icon-blue', path: '/vehiculos', desc: 'Gestionar flota' },
    { label: 'Ingreso', icon: '📥', iconClass: 'icon-green', path: '/ingreso', desc: 'Control de entrada', badge: 'Disponible' },
    { label: 'Salida', icon: '📤', iconClass: 'icon-red', path: '/salida', desc: 'Control de salida', badge: 'Ocupado' },
    { label: 'Historial', icon: '📅', iconClass: 'icon-yellow', path: '/historial', desc: 'Registros' },
    { label: 'Ajustes', icon: '⚙️', iconClass: 'icon-gray', path: '/configuracion', desc: 'Configuración' },
  ];

  constructor(private router: Router) {}

  get isHome(): boolean {
    return this.router.url === '/' || this.router.url === '/inicio';
  }

  // 🔐 Cerrar sesión
  logout() {
    localStorage.removeItem('login');
    this.router.navigate(['/login']);
  }

  // 🚗 Navegación centralizada
  navigate(path: string) {
    this.router.navigate([path]);
  }

}