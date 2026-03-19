import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  usuario = '';
  password = '';
  error = false;

  constructor(private router: Router) {}

  login() {
    if (this.usuario === 'yojan' && this.password === '1234') {
      localStorage.setItem('login', 'true');
      this.router.navigate(['/']);
    } else {
      this.error = true;
    }
  }
}