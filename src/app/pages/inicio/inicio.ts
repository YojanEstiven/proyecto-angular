import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css']
})
export class InicioComponent {

  constructor(private router: Router) {}

  // 🔐 Cerrar sesión
  logout() {
    localStorage.removeItem('login');
    this.router.navigate(['/login']);
  }

  // 🚗 Navegación
  irVehiculos() {
    this.router.navigate(['/vehiculos']);
  }

  irIngreso() {
    this.router.navigate(['/ingreso']);
  }

  irSalida() {
    this.router.navigate(['/salida']);
  }

  irHistorial() {
    this.router.navigate(['/historial']);
  }

  irConfiguracion() {
    this.router.navigate(['/configuracion']);
  }

}