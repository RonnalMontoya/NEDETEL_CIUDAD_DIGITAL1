import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-start',
  standalone: false,
  template: '',
})
export class StartPage implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Ya pasó el guard de onboarding.
    // Ahora decidir: telecomunicaciones si está logueado, sino login.
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/telecomunicaciones', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/login', { replaceUrl: true });
    }
  }
}