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

  constructor(private router: Router) {
    
    const configGuardada = localStorage.getItem('config_precio');
    if (configGuardada) {
      this.precioPorMinuto = JSON.parse(configGuardada);
    }
  }

  guardarConfig() {
    if (this.precioPorMinuto < 0) {
      alert('El precio no puede ser negativo');
      return;
    }

   
    localStorage.setItem('config_precio', JSON.stringify(this.precioPorMinuto));
    
    alert('Configuración guardada con éxito. Nuevo precio: $' + this.precioPorMinuto);
    
    
    this.router.navigate(['/inicio']);
  }

  volver() {
    this.router.navigate(['/inicio']);
  }
}