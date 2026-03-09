import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-onboarding-step3',
  templateUrl: './onboarding-step3.page.html',
  styleUrls: ['./onboarding-step3.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class OnboardingStep3Page {
  private router = inject(Router);

  back() { this.router.navigateByUrl('/onboarding/2'); }
  next() { this.router.navigateByUrl('/onboarding/4'); }
}
