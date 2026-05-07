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

    this.tarifaCarro = Number(localStorage.getItem('config_carro') || 2000);
    this.tarifaMoto = Number(localStorage.getItem('config_moto') || 1000);
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

      this.ingresos = this.ingresos.filter(
        item => item.placa !== this.resumenSalida.placa
      );

      localStorage.setItem('ingresos', JSON.stringify(this.ingresos));

      let espacios = JSON.parse(localStorage.getItem('espacios') || '[]');

      const espacio = espacios.find(
        (e: any) => e.placa === this.resumenSalida.placa
      );

      if (espacio) {
        espacio.ocupado = false;
        espacio.placa = null;
      }

      localStorage.setItem('espacios', JSON.stringify(espacios));

      const historial = JSON.parse(localStorage.getItem('historial') || '[]');
      historial.push(nuevoHistorial);
      localStorage.setItem('historial', JSON.stringify(historial));

      this.imprimirReciboVentana(nuevoHistorial);

      this.resumenSalida = null;
      this.vehiculoASalir = '';

      alert('Salida procesada correctamente.');
    }
  }

  imprimirReciboVentana(recibo: any) {

  const ventana = window.open('', '_blank', 'width=400,height=600');

  if (!ventana) {
    alert('No se pudo abrir la ventana de impresión');
    return;
  }

  ventana.document.write(`
    <html>
      <head>
        <title>Recibo Parqueadero</title>
        <style>
          @page {
    size: 80mm 200mm; /* tamaño tipo ticket */
    margin: 0;
  }

  body {
    font-family: monospace;
    text-align: center;
    padding: 10px;
    margin: 0;
    font-size: 12px;
  }
    body {
  width: 80mm;
  margin: 0 auto;
  font-size: 12px;
}

  h2 {
    font-size: 14px;
    margin: 5px 0;
  }

  .line {
    border-top: 1px dashed #000;
    margin: 8px 0;
  }

  .total {
    font-size: 16px;
    font-weight: bold;
  }
      </style>
      </head>
      <body>

        <h2>PARQUEADERO</h2>
        <p>Comprobante de Pago</p>

        <div class="line"></div>

        <p><strong>Placa:</strong> ${recibo.placa}</p>
        <p><strong>Tipo:</strong> ${recibo.tipo}</p>

        <div class="line"></div>

        <p><strong>Ingreso:</strong> ${new Date(recibo.ingreso).toLocaleString()}</p>
        <p><strong>Salida:</strong> ${new Date(recibo.salida).toLocaleString()}</p>

        <div class="line"></div>

        <p><strong>Tiempo:</strong> ${recibo.tiempo}</p>

        <div class="line"></div>

        <h3 class="total">TOTAL: $${recibo.pago}</h3>

        <div class="line"></div>

        <p>¡Gracias por su visita!</p>

      </body>
    </html>
  `);

  ventana.document.close();

  ventana.onload = () => {
    ventana.focus();
    ventana.print();

    ventana.onafterprint = () => {
      ventana.close();
    };
  };
}

  imprimirRecibo() {
    if (this.reciboGenerado) {
      this.imprimirReciboVentana(this.reciboGenerado);
    } else {
      alert('No hay recibo para imprimir');
    }
  }
}