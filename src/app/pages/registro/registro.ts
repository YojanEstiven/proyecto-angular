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

    const data = localStorage.getItem('parking_users');
    const usuarios = data ? JSON.parse(data) : [];

    
    const existe = usuarios.find((u: any) => u.correo === this.correo);

    if (existe) {
      this.mensajeError = 'Este correo ya está registrado';
      return;
    }

    
    usuarios.push({
      nombre: this.nombre,
      correo: this.correo,
      password: this.password
    });

    localStorage.setItem('parking_users', JSON.stringify(usuarios));

    alert('Usuario registrado con éxito');

    
    this.nombre = '';
    this.correo = '';
    this.password = '';
    this.mensajeError = '';

    
    this.router.navigate(['/login']);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}