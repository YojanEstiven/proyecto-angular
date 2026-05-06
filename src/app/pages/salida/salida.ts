import { Component, inject, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-salida',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './salida.html',
  styleUrls: ['./salida.css']
})
export class SalidaComponent {

  ingresos: any[] = [];
  vehiculoASalir = '';

  tarifaCarro = 0;
  tarifaMoto = 0;

  resumenSalida: any = null;

  
  reciboGenerado: any = null;

  private router = inject(Router);
  private storageService = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.ingresos = JSON.parse(this.storageService.getItem('ingresos') || '[]');

    this.tarifaCarro = JSON.parse(this.storageService.getItem('config_carro') || '2000');
    this.tarifaMoto = JSON.parse(this.storageService.getItem('config_moto') || '1000');
  }

  seleccionarVehiculo(placa: string) {
    this.vehiculoASalir = placa;

    const v = this.ingresos.find(item => item.placa === placa);

    if (v) {
      this.calcularResumen(v);
    } else {
      this.resumenSalida = null;
    }
  }

  calcularResumen(v: any) {

    const horaSalida = new Date();
    const fechaIngreso = new Date(v.horaIngreso);

    const diferenciaMs = horaSalida.getTime() - fechaIngreso.getTime();

    let minutos = Math.ceil(diferenciaMs / (1000 * 60));
    if (minutos <= 0) minutos = 1;

    const tarifa = v.tipo === 'Carro'
      ? this.tarifaCarro
      : this.tarifaMoto;

    const totalPagar = minutos * tarifa;

    this.resumenSalida = {
      placa: v.placa,
      tipo: v.tipo || 'Vehículo',
      tarifa: tarifa,
      ingreso: v.horaIngreso,
      salida: horaSalida.toISOString(),
      minutos: minutos,
      total: totalPagar
    };
  }

  registrarSalida() {
    let espacios = JSON.parse(this.storageService.getItem('espacios') || '[]');


const espacio = espacios.find(
  (e: any) => e.placa === this.resumenSalida.placa
);

if (espacio) {
  espacio.ocupado = false;
  espacio.placa = null;
}

    this.storageService.setItem('espacios', JSON.stringify(espacios));

    if (!this.resumenSalida) return;

    if (confirm(`¿Confirmas la salida del vehículo ${this.resumenSalida.placa} por un total de $${this.resumenSalida.total}?`)) {

      const nuevoHistorial = {
        placa: this.resumenSalida.placa,
        tipo: this.resumenSalida.tipo,
        ingreso: this.resumenSalida.ingreso,
        salida: this.resumenSalida.salida,
        tiempo: this.resumenSalida.minutos + ' min',
        pago: this.resumenSalida.total
      };

      
      this.reciboGenerado = nuevoHistorial;

     
      const ingresosActualizados = this.ingresos.filter(
        item => item.placa !== this.resumenSalida.placa
      );
      this.storageService.setItem('ingresos', JSON.stringify(ingresosActualizados));
      window.dispatchEvent(new Event('actualizarDashboard'));

      const historial = JSON.parse(this.storageService.getItem('historial') || '[]');
      historial.push(nuevoHistorial);
      this.storageService.setItem('historial', JSON.stringify(historial));

      alert('Salida procesada correctamente.');

    
    }
  }

  
  imprimirRecibo() {
    window.print();
  }
}