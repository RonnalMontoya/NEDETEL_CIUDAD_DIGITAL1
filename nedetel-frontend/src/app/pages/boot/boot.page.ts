import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-boot',
  template: `
    <ion-content class="ion-padding" [style.--background]="'#f5f7fa'">
      <div style="height: 100%; display: grid; place-items: center; text-align: center; gap: 10px;">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <strong style="color:#16213e; font-size: 16px;">Cargando NEDETEL...</strong>
      </div>
    </ion-content>
  `,
  imports: [CommonModule, IonicModule],
})
export class BootPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const nextUrl = '/onboarding/1';

    this.router.navigateByUrl(nextUrl, { replaceUrl: true }).catch(() => {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    });
  }
}
