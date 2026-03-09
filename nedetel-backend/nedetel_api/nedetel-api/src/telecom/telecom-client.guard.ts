import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TelecomClientGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | string[] | undefined> }>();

    const clientHeader = this.normalizeHeader(request.headers['x-app-client']);
    const apiKeyHeader = this.normalizeHeader(request.headers['x-api-key']);

    if (!clientHeader || !['nedetel-web', 'nedetel-mobile'].includes(clientHeader)) {
      throw new UnauthorizedException(
        'Cliente no autorizado. Usa cabecera x-app-client válida.',
      );
    }

    const internalApiKey = process.env.INTERNAL_API_KEY?.trim();
    if (internalApiKey && apiKeyHeader !== internalApiKey) {
      throw new UnauthorizedException('API key interna inválida.');
    }

    return true;
  }

  private normalizeHeader(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
      return (value[0] ?? '').trim().toLowerCase();
    }

    return (value ?? '').trim().toLowerCase();
  }
}
