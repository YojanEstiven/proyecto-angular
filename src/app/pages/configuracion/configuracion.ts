import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './configuracion.html',
  styleUrls: ['./configuracion.css']
})
export class ConfiguracionComponent {
  
  precioPorMinuto: number = 0;
  
  // Extra settings for UI demo
  notificaciones = true;
  respaldoAutomatico = false;
  moneda = 'USD';

  constructor(private router: Router) {
    this.cargarConfig();
  }

  cargarConfig() {
    const configGuardada = localStorage.getItem('config_precio');
    if (configGuardada) {
      this.precioPorMinuto = JSON.parse(configGuardada);
    }
    
    // Simular carga de otras configs
    this.notificaciones = JSON.parse(localStorage.getItem('config_notif') || 'true');
    this.moneda = localStorage.getItem('config_moneda') || 'USD';
  }

  guardarConfig() {
    if (this.precioPorMinuto < 0) {
      alert('El precio no puede ser negativo');
      return;
    }

    localStorage.setItem('config_precio', JSON.stringify(this.precioPorMinuto));
    localStorage.setItem('config_notif', JSON.stringify(this.notificaciones));
    localStorage.setItem('config_moneda', this.moneda);
    
    alert('Configuración guardada satisfactoriamente.');
    this.router.navigate(['/']);
  }

  volver() {
    this.router.navigate(['/']);
  }
}