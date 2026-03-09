import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../services/onboarding.service';

@Component({
  standalone: true,
  selector: 'app-onboarding-step4',
  templateUrl: './onboarding-step4.page.html',
  styleUrls: ['./onboarding-step4.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class OnboardingStep4Page {
  private router = inject(Router);
  private onboarding = inject(OnboardingService);

  back() { this.router.navigateByUrl('/onboarding/3'); }

  finish() {
    this.onboarding.markSeen();
    this.router.navigateByUrl('/register', { replaceUrl: true });
  }
}
