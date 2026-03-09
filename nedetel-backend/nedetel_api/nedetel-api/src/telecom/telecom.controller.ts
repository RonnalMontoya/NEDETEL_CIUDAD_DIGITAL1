import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TelecomService } from './telecom.service';
import { TelecomClientGuard } from './telecom-client.guard';

@Controller('telecom')
@UseGuards(TelecomClientGuard)
export class TelecomController {
  constructor(private readonly telecomService: TelecomService) {}

  @Get('recientes')
  async getRecientes(@Query('limit') limit?: string) {
    const parsedLimit = this.parseLimit(limit);
    return this.telecomService.getRecientes(parsedLimit);
  }

  @Get('proximos')
  async getProximos(@Query('limit') limit?: string) {
    const parsedLimit = this.parseLimit(limit);
    return this.telecomService.getProximos(parsedLimit);
  }

  @Get('noticias')
  async getNoticias(@Query('limit') limit?: string) {
    const parsedLimit = this.parseLimit(limit);
    return this.telecomService.getNoticias(parsedLimit);
  }

  private parseLimit(limit?: string): number {
    if (!limit) {
      return 10;
    }

    const parsed = Number(limit);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 20) {
      throw new BadRequestException(
        'Parámetro limit inválido. Debe ser un entero entre 1 y 20.',
      );
    }

    return parsed;
  }
}
