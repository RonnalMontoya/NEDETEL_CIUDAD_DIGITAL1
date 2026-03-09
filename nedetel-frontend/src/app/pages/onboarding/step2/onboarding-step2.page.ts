import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-onboarding-step2',
  templateUrl: './onboarding-step2.page.html',
  styleUrls: ['./onboarding-step2.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class OnboardingStep2Page {
  private router = inject(Router);

  back() { this.router.navigateByUrl('/onboarding/1'); }
  next() { this.router.navigateByUrl('/onboarding/3'); }
}
