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
  
  
  tarifaCarro: number = 0;
  tarifaMoto: number = 0;

  notificaciones = true;
  respaldoAutomatico = false;
  moneda = 'USD';

  constructor(private router: Router) {
    this.cargarConfig();
  }

  cargarConfig() {

    this.tarifaCarro = JSON.parse(localStorage.getItem('config_carro') || '2000');
    this.tarifaMoto = JSON.parse(localStorage.getItem('config_moto') || '1000');

    this.notificaciones = JSON.parse(localStorage.getItem('config_notif') || 'true');
    this.moneda = localStorage.getItem('config_moneda') || 'USD';
  }

  guardarConfig() {

    if (this.tarifaCarro < 0 || this.tarifaMoto < 0) {
      alert('Las tarifas no pueden ser negativas');
      return;
    }

    localStorage.setItem('config_carro', JSON.stringify(this.tarifaCarro));
    localStorage.setItem('config_moto', JSON.stringify(this.tarifaMoto));

    localStorage.setItem('config_notif', JSON.stringify(this.notificaciones));
    localStorage.setItem('config_moneda', this.moneda);

    alert('Configuración guardada satisfactoriamente.');

    this.router.navigate(['/']);
  }

  volver() {
    this.router.navigate(['/']);
  }
}