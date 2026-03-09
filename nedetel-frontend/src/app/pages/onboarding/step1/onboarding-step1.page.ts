import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-onboarding-step1',
  templateUrl: './onboarding-step1.page.html',
  styleUrls: ['./onboarding-step1.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class OnboardingStep1Page {
  private router = inject(Router);

  next() {
    this.router.navigateByUrl('/onboarding/2');
  }
}
