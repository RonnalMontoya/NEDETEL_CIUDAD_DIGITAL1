import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Rol } from '@prisma/client';
import { PrismaService } from '../prisma.service';

interface RegisterInput {
  nombre: string;
  username: string;
  email: string;
  password: string;
  rol?: string;
}

interface LoginInput {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  private parseRol(inputRol?: string): Rol {
    if (!inputRol) {
      return Rol.USER;
    }

    const normalized = inputRol.trim().toUpperCase() as Rol;
    if (!Object.values(Rol).includes(normalized)) {
      throw new BadRequestException(
        `Rol invalido. Valores permitidos: ${Object.values(Rol).join(', ')}.`,
      );
    }

    return normalized;
  }

  getRoles() {
    return { roles: Object.values(Rol) };
  }

  async checkEmailExists(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await this.prisma.usuario.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    return { exists: !!existing };
  }

  async register(input: RegisterInput) {
    const email = input.email.trim().toLowerCase();
    const username = input.username.trim().toLowerCase();
    const rol = this.parseRol(input.rol);
    const existing = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existing) {
      throw new BadRequestException(
        'El correo o usuario ya estan registrados.',
      );
    }

    const hash = await bcrypt.hash(input.password, 10);

    const created = await this.prisma.usuario.create({
      data: {
        nombre: input.nombre.trim(),
        username,
        email,
        password: hash,
        rol,
      },
    });

    const { password, ...user } = created;
    void password;
    return { user };
  }

  async login(input: LoginInput) {
    const username = input.username.trim().toLowerCase();

    const user = await this.prisma.usuario.findFirst({
      where: {
        OR: [
          { email: username },
          { username },
          { nombre: { equals: input.username.trim(), mode: 'insensitive' } },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario o clave incorrectos.');
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Usuario o clave incorrectos.');
    }

    const { password, ...safe } = user;
    void password;
    return { user: safe };
  }
}
