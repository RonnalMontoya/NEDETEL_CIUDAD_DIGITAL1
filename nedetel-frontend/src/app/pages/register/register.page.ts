import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonInput } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, Role } from '../../core/services/auth.service';
import { Subject, Subscription, catchError, debounceTime, distinctUntilChanged, finalize, of, switchMap } from 'rxjs';
import {
  RegisterField,
  RegisterFieldErrors,
  RegisterFormData,
  validateRegisterField,
  validateRegisterForm,
} from '../../core/validation/register.schema';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private auth = inject(AuthService);

  nombres = '';
  usuario = '';
  correo = '';
  clave = '';
  confirmarClave = '';
  role: Role = 'operaciones';
  fieldErrors: RegisterFieldErrors = {};
  isCheckingEmail = false;
  errorMsg = '';

  @ViewChild('nombresInput') nombresInput?: IonInput;
  @ViewChild('usuarioInput') usuarioInput?: IonInput;
  @ViewChild('correoInput') correoInput?: IonInput;
  @ViewChild('claveInput') claveInput?: IonInput;
  @ViewChild('confirmarClaveInput') confirmarClaveInput?: IonInput;

  private emailCheck$ = new Subject<string>();
  private emailCheckSub?: Subscription;

  ngOnInit(): void {
    this.emailCheckSub = this.emailCheck$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(email => {
          const previewData = {
            ...this.formData,
            correo: email,
          };
          const emailError = validateRegisterField('correo', previewData);

          if (!email || emailError) {
            return of({ email, exists: false, apiError: false, skipped: true });
          }

          this.isCheckingEmail = true;
          return this.auth.checkEmailExists(email).pipe(
            switchMap(exists => of({ email, exists, apiError: false, skipped: false })),
            catchError(() => of({ email, exists: false, apiError: true, skipped: false })),
            finalize(() => {
              this.isCheckingEmail = false;
            })
          );
        })
      )
      .subscribe(result => {
        const currentEmail = this.correo.trim().toLowerCase();
        if (result.email !== currentEmail || result.skipped) {
          return;
        }

        if (result.apiError) {
          this.errorMsg =
            'No pudimos validar el correo en este momento. Revisa tu conexión e intenta de nuevo.';
          return;
        }

        if (result.exists) {
          this.fieldErrors.correo =
            'Este correo ya está registrado. Usa otro correo o inicia sesión.';
          return;
        }

        if (
          this.fieldErrors.correo ===
          'Este correo ya está registrado. Usa otro correo o inicia sesión.'
        ) {
          delete this.fieldErrors.correo;
        }
      });
  }

  ngOnDestroy(): void {
    this.emailCheckSub?.unsubscribe();
  }

  onFieldChange(field: RegisterField) {
    this.errorMsg = '';
    const fieldError = validateRegisterField(field, this.formData);

    if (fieldError) {
      this.fieldErrors[field] = fieldError;
    } else {
      delete this.fieldErrors[field];
    }

    if (field === 'clave' || field === 'confirmarClave') {
      const confirmError = validateRegisterField('confirmarClave', this.formData);
      if (confirmError) {
        this.fieldErrors.confirmarClave = confirmError;
      } else {
        delete this.fieldErrors.confirmarClave;
      }
    }

    if (field === 'correo') {
      this.emailCheck$.next(this.correo.trim().toLowerCase());
    }
  }

  createAccount() {
    this.errorMsg = '';
    this.fieldErrors = validateRegisterForm(this.formData);

    if (Object.keys(this.fieldErrors).length > 0) {
      this.focusFirstInvalidField();
      return;
    }

    const email = this.correo.trim().toLowerCase();
    const username = this.usuario.trim().toLowerCase();

    this.isCheckingEmail = true;
    this.auth
      .checkEmailExists(email)
      .pipe(
        switchMap(exists => {
          if (exists) {
            this.fieldErrors.correo =
              'Este correo ya está registrado. Usa otro correo o inicia sesión.';
            this.focusFirstInvalidField();
            return of(null);
          }

          return this.auth.register(
            this.nombres.trim(),
            username,
            email,
            this.clave,
            this.role
          );
        }),
        finalize(() => {
          this.isCheckingEmail = false;
        })
      )
      .subscribe({
        next: res => {
          if (!res) {
            return;
          }
          this.router.navigateByUrl('/login');
        },
        error: (err: any) => {
          this.errorMsg =
            err?.error?.message ??
            'No se pudo crear la cuenta. Verifica los datos e intenta nuevamente.';
        },
      });
  }

  backToLogin() {
    this.router.navigateByUrl('/login');
  }

  private get formData(): RegisterFormData {
    return {
      nombres: this.nombres,
      usuario: this.usuario,
      correo: this.correo,
      clave: this.clave,
      confirmarClave: this.confirmarClave,
    };
  }

  private async focusFirstInvalidField() {
    const order: RegisterField[] = [
      'nombres',
      'usuario',
      'correo',
      'clave',
      'confirmarClave',
    ];

    for (const field of order) {
      if (!this.fieldErrors[field]) {
        continue;
      }

      if (field === 'nombres') {
        await this.nombresInput?.setFocus();
        return;
      }

      if (field === 'usuario') {
        await this.usuarioInput?.setFocus();
        return;
      }

      if (field === 'correo') {
        await this.correoInput?.setFocus();
        return;
      }

      if (field === 'clave') {
        await this.claveInput?.setFocus();
        return;
      }

      await this.confirmarClaveInput?.setFocus();
      return;
    }
  }
}
