import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';

interface RegisterDto {
  nombre: string;
  username: string;
  email: string;
  password: string;
  rol?: string;
}

interface LoginDto {
  username: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('roles')
  roles() {
    return this.auth.getRoles();
  }

  @Get('check-email')
  checkEmail(@Query('email') email: string) {
    const value = email?.trim();
    if (!value) {
      throw new BadRequestException('Debes enviar el correo para validación.');
    }

    return this.auth.checkEmailExists(value);
  }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.auth.register(body);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body);
  }
}
