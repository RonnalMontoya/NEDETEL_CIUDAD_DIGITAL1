import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TelecomModule } from './telecom/telecom.module';
import { PerformanceModule } from './performance/performance.module';

@Module({
  imports: [AuthModule, TelecomModule, PerformanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
