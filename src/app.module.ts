import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseService } from './firebase.service';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // In development, use pino-pretty for human-readable logs
        transport: process.env.NODE_ENV !== 'production' 
          ? { target: 'pino-pretty', options: { colorize: true } } 
          : undefined,
        autoLogging: true, 
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}
