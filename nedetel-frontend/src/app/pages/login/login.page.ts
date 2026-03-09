import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  nativeLite = Capacitor.isNativePlatform();
  identifier = '';
  password = '';
  errorMsg = '';

  constructor(private router: Router, private auth: AuthService) {}

  onLogin() {
    this.errorMsg = '';

    // Validación mínima
    if (!this.identifier.trim() || !this.password.trim()) {
      this.errorMsg = 'Por favor ingresa usuario o correo y clave.';
      return;
    }

    this.auth.login(this.identifier, this.password).subscribe({
      next: () => this.router.navigateByUrl('/telecomunicaciones'),
      error: () => {
        this.errorMsg = 'Usuario o clave incorrectos.';
      },
    });
  }

  goRegister() {
    this.router.navigateByUrl('/register');
  }
}
