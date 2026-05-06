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
    if (this.usuario === 'yojan' && this.password === '1234') {
      this.storageService.setItem('login', 'true');
      
      this.router.navigate(['/']); 
    } else {
      this.error = true;
    }
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}