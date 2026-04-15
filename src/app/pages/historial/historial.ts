import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent {

  historial: any[] = [];

  constructor(private router: Router) {
    
    const data = localStorage.getItem('historial');
    if (data) {
      this.historial = JSON.parse(data);
    }
  }

  

}