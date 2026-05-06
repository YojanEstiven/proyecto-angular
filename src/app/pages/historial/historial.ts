import { Component, inject, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.html',
  styleUrls: ['./historial.css']
})
export class HistorialComponent {

  historial: any[] = [];

  private router = inject(Router);
  private storageService = inject(StorageService);

  constructor() {
    afterNextRender(() => {
      const data = this.storageService.getItem('historial');
      if (data) {
        this.historial = JSON.parse(data);
      }
    });
  }

  

}