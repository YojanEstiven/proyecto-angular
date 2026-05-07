import { Component, inject, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

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
  capacidadMaxima: number = 0;
  capacidadCarros = 0;
  capacidadMotos = 0;

  notificaciones = true;
  respaldoAutomatico = false;
  moneda = 'USD';

  private router = inject(Router);
  private storageService = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      this.cargarConfig();
    });
  }

  cargarConfig() {

    this.tarifaCarro = JSON.parse(this.storageService.getItem('config_carro') || '2000');
    this.tarifaMoto = JSON.parse(this.storageService.getItem('config_moto') || '1000');
    this.capacidadMaxima = JSON.parse(this.storageService.getItem('config_capacidad') || '20');
    this.capacidadCarros = JSON.parse(localStorage.getItem('capacidad_carros') || '10');
    this.capacidadMotos = JSON.parse(localStorage.getItem('capacidad_motos') || '10');

    this.notificaciones = JSON.parse(this.storageService.getItem('config_notif') || 'true');
    this.moneda = this.storageService.getItem('config_moneda') || 'USD';
  }

  guardarConfig() {

    if (this.tarifaCarro < 0 || this.tarifaMoto < 0) {
      alert('Las tarifas no pueden ser negativas');
      return;
    }
    if (
  (this.capacidadCarros + this.capacidadMotos)
  > this.capacidadMaxima
) {

  alert(
    'La suma de carros y motos es superior a la capacidad máxima del parqueadero'
  );

  return;
}

    this.storageService.setItem('config_carro', JSON.stringify(this.tarifaCarro));
    this.storageService.setItem('config_moto', JSON.stringify(this.tarifaMoto));
    this.storageService.setItem('config_capacidad', JSON.stringify(this.capacidadMaxima));
    localStorage.setItem('capacidad_carros', JSON.stringify(this.capacidadCarros));
    localStorage.setItem('capacidad_motos', JSON.stringify(this.capacidadMotos));
    localStorage.removeItem('espacios');

    this.storageService.setItem('config_notif', JSON.stringify(this.notificaciones));
    this.storageService.setItem('config_moneda', this.moneda);

    alert('Configuración guardada satisfactoriamente.');

    this.router.navigate(['/']);
  }

  volver() {
    this.router.navigate(['/']);
  }
}