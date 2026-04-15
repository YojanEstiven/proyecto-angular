import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  nombre = '';
  correo = '';
  password = '';
  mensajeError = '';

  constructor(private router: Router) {}

  registrarUser() {
    if (!this.nombre || !this.correo || !this.password) {
      this.mensajeError = 'Todos los campos son obligatorios';
      return;
    }

    // Mock registration logic: save to localStorage
    const usuarios = JSON.parse(localStorage.getItem('parking_users') || '[]');
    
    if (usuarios.find((u: any) => u.correo === this.correo)) {
      this.mensajeError = 'Este correo ya está registrado';
      return;
    }

    usuarios.push({
      nombre: this.nombre,
      correo: this.correo,
      password: this.password
    });

    localStorage.setItem('parking_users', JSON.stringify(usuarios));
    
    alert('Usuario registrado con éxito. Serás redirigido al login.');
    this.router.navigate(['/login']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
