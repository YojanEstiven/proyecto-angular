import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ingreso.html',
  styleUrls: ['./ingreso.css']
})
export class IngresoComponent {

  vehiculos: any[] = [];
  ingresos: any[] = [];
  vehiculoSeleccionado = '';

  constructor(private router: Router) {
   
    const dataVehiculos = localStorage.getItem('vehiculos');
    if (dataVehiculos) {
      this.vehiculos = JSON.parse(dataVehiculos);
    }

    
    const dataIngresos = localStorage.getItem('ingresos');
    if (dataIngresos) {
      this.ingresos = JSON.parse(dataIngresos);
    }
  }

 registrarIngreso() {
  if (!this.vehiculoSeleccionado) {
    alert('Seleccione un vehículo');
    return;
  }

  const ingreso = {
    placa: this.vehiculoSeleccionado,
    horaIngreso: new Date().toISOString() 
  };

  this.ingresos.push(ingreso);
  localStorage.setItem('ingresos', JSON.stringify(this.ingresos));
  this.router.navigate(['/inicio']);
}
}