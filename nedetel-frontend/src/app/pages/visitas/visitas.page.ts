import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ActivitiesService, ActivityItem } from '../../services/activities.service';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.page.html',
  styleUrls: ['./visitas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class VisitasPage {
  private svc = inject(ActivitiesService);
  private router = inject(Router);

  readonly moduleKey = 'visitas';

  title = '';
  description = '';
  dateISO = new Date().toISOString();

  items: ActivityItem[] = [];
  errorMsg = '';
  isLoading = false;

  async ionViewWillEnter() {
    await this.refresh();
  }

  async refresh() {
    this.isLoading = true;
    try {
      this.items = await this.svc.list(this.moduleKey);
    } finally {
      this.isLoading = false;
    }
  }

  async save() {
    this.errorMsg = '';

    if (!this.title.trim()) {
      this.errorMsg = 'La actividad es obligatoria.';
      return;
    }

    this.isLoading = true;
    try {
      await this.svc.add(this.moduleKey, {
        title: this.title.trim(),
        description: this.description.trim() || undefined,
        dateISO: this.dateISO,
      });

      this.title = '';
      this.description = '';
      this.dateISO = new Date().toISOString();

      await this.refresh();
    } finally {
      this.isLoading = false;
    }
  }

  async remove(id: string) {
    this.isLoading = true;
    try {
      await this.svc.remove(this.moduleKey, id);
      await this.refresh();
    } finally {
      this.isLoading = false;
    }
  }

  back() {
    this.router.navigateByUrl('/dashboard');
  }
}
