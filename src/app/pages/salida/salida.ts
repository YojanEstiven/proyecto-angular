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
  tarifaPorMinuto = 0;
  
  // New state for summary
  resumenSalida: any = null;

  constructor(private router: Router) {
    this.cargarDatos();
  }

  cargarDatos() {
    this.ingresos = JSON.parse(localStorage.getItem('ingresos') || '[]');
    this.tarifaPorMinuto = JSON.parse(localStorage.getItem('config_precio') || '0');
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

    const totalPagar = minutos * this.tarifaPorMinuto;

    this.resumenSalida = {
      placa: v.placa,
      tipo: v.tipo || 'Vehículo',
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
        ingreso: this.resumenSalida.ingreso,
        salida: this.resumenSalida.salida,
        tiempo: this.resumenSalida.minutos + ' min',
        pago: this.resumenSalida.total
      };

      // Quitar de ingresos
      const ingresosActualizados = this.ingresos.filter(item => item.placa !== this.resumenSalida.placa);
      localStorage.setItem('ingresos', JSON.stringify(ingresosActualizados));

      // Guardar en historial
      const historial = JSON.parse(localStorage.getItem('historial') || '[]');
      historial.push(nuevoHistorial);
      localStorage.setItem('historial', JSON.stringify(historial));

      alert('Salida procesada correctamente.');
      this.router.navigate(['/']);
    }
  }
}