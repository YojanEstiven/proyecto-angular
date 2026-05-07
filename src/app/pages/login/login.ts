import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  usuario = '';
  password = '';
  error = false;

  private router = inject(Router);
  private storageService = inject(StorageService);

  login() {

    
    const data = this.storageService.getItem('parking_users');

    
    const usuarios = data ? JSON.parse(data) : [];

    
    const usuarioEncontrado = usuarios.find((u: any) =>

      u.correo === this.usuario &&
      u.password === this.password

    );

    
    if (usuarioEncontrado) {

      
      this.storageService.setItem('login', 'true');

      
      this.storageService.setItem(
        'usuario_actual',
        JSON.stringify(usuarioEncontrado)
      );

      
      this.error = false;

      
      this.router.navigate(['/']);

    } else {

      
      this.error = true;
    }
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}