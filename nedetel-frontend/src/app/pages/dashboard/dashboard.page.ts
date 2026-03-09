import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DashboardPage {
  private router = inject(Router);

  go(route: string) {
    this.router.navigateByUrl(route);
  }

  logout() {
    // Aquí luego limpias token/session storage si usas auth real
    this.router.navigateByUrl('/login');
  }
}
