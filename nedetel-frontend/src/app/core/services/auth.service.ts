import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';
import { getApiBaseUrl } from 'src/app/core/config/api.config';

export type Role = 'admin' | 'tecnico' | 'seguridad' | 'operaciones';

export interface UserModel {
  username: string;
  role: Role;
}

export interface ApiUser {
  id: number;
  nombre: string;
  username?: string;
  email: string;
  rol: Role | string;
}

interface AuthResponse {
  user: ApiUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private readonly KEY = 'nedetel_user';
  private _user$ = new BehaviorSubject<UserModel | null>(this.read());

  user$ = this._user$.asObservable();

  get user(): UserModel | null {
    return this._user$.value;
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  /** Base URL resuelta según plataforma (Web vs Android emulador) */
  private api(): string {
    return getApiBaseUrl();
  }

  register(
    nombre: string,
    username: string,
    email: string,
    password: string,
    role: Role = 'operaciones'
  ) {
    const roleParam = role.toUpperCase();

    return this.http
      .post<AuthResponse>(
        `${this.api()}/auth/register`,
        { nombre, username, email, password, rol: roleParam },
        { withCredentials: true }
      )
      .pipe(tap((res) => this.persistUser(res.user)));
  }

  login(username: string, password: string) {
    return this.http
      .post<AuthResponse>(
        `${this.api()}/auth/login`,
        { username, password },
        { withCredentials: true }
      )
      .pipe(
        tap((res) => this.persistUser(res.user)),
        map((res) => res.user)
      );
  }

  checkEmailExists(email: string) {
    return this.http
      .get<{ exists: boolean }>(`${this.api()}/auth/check-email`, {
        params: { email },
        withCredentials: true,
      })
      .pipe(map((res) => !!res.exists));
  }

  logout(): void {
    localStorage.removeItem(this.KEY);
    this._user$.next(null);
  }

  private persistUser(apiUser: ApiUser): void {
    const normalized = apiUser.rol?.toString().toLowerCase();
    const knownRoles: Role[] = ['admin', 'tecnico', 'seguridad', 'operaciones'];

    const mappedRole =
      normalized === 'operador' || normalized === 'user'
        ? 'operaciones'
        : normalized;

    const role = knownRoles.includes(mappedRole as Role)
      ? (mappedRole as Role)
      : 'operaciones';

    const displayName = apiUser.username ?? apiUser.nombre;
    const u: UserModel = { username: displayName, role };

    localStorage.setItem(this.KEY, JSON.stringify(u));
    this._user$.next(u);
  }

  private read(): UserModel | null {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? (JSON.parse(raw) as UserModel) : null;
    } catch {
      return null;
    }
  }
}