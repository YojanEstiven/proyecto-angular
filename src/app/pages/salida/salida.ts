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

  constructor(private router: Router) {
    const data = localStorage.getItem('ingresos');
    if (data) {
      this.ingresos = JSON.parse(data);
    }

    const config = localStorage.getItem('config_precio');
    if (config) {
      this.tarifaPorMinuto = JSON.parse(config);
    } else {
      this.tarifaPorMinuto = 0; 
    }
  }

  registrarSalida() {
    if (!this.vehiculoASalir) {
      alert('Por favor, seleccione un vehículo para marcar la salida.');
      return;
    }

    const v = this.ingresos.find(item => item.placa === this.vehiculoASalir);

    if (v) {
      const horaSalida = new Date();
      
     
      const fechaIngresoParseada = new Date(v.horaIngreso);

    
      if (isNaN(fechaIngresoParseada.getTime())) {
        alert('Error: El formato de fecha de ingreso no es válido para cálculos. Revisa el módulo de Ingreso.');
        return;
      }

      const diferenciaMs = horaSalida.getTime() - fechaIngresoParseada.getTime();
      
  
      let minutos = Math.ceil(diferenciaMs / (1000 * 60));
      if (minutos <= 0) minutos = 1;

      const totalPagar = minutos * this.tarifaPorMinuto;

      const nuevoHistorial = {
        placa: v.placa,
        ingreso: v.horaIngreso,
        salida: horaSalida.toISOString(),
        tiempo: minutos + ' min',
        pago: totalPagar
      };

      // Actualizar Ingresos (quitar el vehículo que sale)
      this.ingresos = this.ingresos.filter(item => item.placa !== this.vehiculoASalir);
      localStorage.setItem('ingresos', JSON.stringify(this.ingresos));

      // Guardar en Historial
      const historialPrevio = JSON.parse(localStorage.getItem('historial') || '[]');
      historialPrevio.push(nuevoHistorial);
      localStorage.setItem('historial', JSON.stringify(historialPrevio));

      
      alert(`Salida Exitosa.\nMinutos: ${minutos}\nTarifa: $${this.tarifaPorMinuto}\nTotal: $${totalPagar}`);

      this.router.navigate(['/inicio']);
    }
  }
}