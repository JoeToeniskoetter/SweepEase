import { Module } from '@nestjs/common';
import { FirebaseAuthStrategy } from './firebase.service';
import { FirebaseAuthGuard } from './firebase.guard';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthService } from './firebase-auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    ConfigService,
    FirebaseAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
    FirebaseAuthService,
  ],
})
export class FirebaseModule {}
