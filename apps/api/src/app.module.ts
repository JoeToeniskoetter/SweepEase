import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
import { UsersModule } from './users/users.module';
import { FirebaseAuthService } from './firebase/firebase-auth.service';
import { FirebaseModule } from './firebase/firebase.module';
import { CompanyModule } from './company/company.module';
import { InspectionModule } from './inspection/inspection.module';
import { UploadModule } from './upload/upload.module';
import { MailModule } from './mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './firebase/firebase.guard';
import { RolesGuard } from './role/role.guard';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'frontend', 'dist'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URI'),
        ssl: { rejectUnauthorized: false },
        entities: dataSourceOptions.entities,
        migrations: dataSourceOptions.migrations,
        synchronize: false,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    FirebaseModule,
    CompanyModule,
    InspectionModule,
    UploadModule,
    MailModule,
    FeedbackModule,
  ],
  providers: [
    FirebaseAuthService,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
