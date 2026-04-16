import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    this.cargarDatos();
  }

  cargarDatos() {
    this.ingresos = JSON.parse(localStorage.getItem('ingresos') || '[]');

    this.tarifaCarro = JSON.parse(localStorage.getItem('config_carro') || '2000');
    this.tarifaMoto = JSON.parse(localStorage.getItem('config_moto') || '1000');
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
      localStorage.setItem('ingresos', JSON.stringify(ingresosActualizados));

      const historial = JSON.parse(localStorage.getItem('historial') || '[]');
      historial.push(nuevoHistorial);
      localStorage.setItem('historial', JSON.stringify(historial));

      alert('Salida procesada correctamente.');

    
    }
  }

  
  imprimirRecibo() {
    window.print();
  }
}