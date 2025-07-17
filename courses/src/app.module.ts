import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { CourseModule } from './courses/course.module';
import {Course as CourseEntity } from './courses/entities/course';
import { decryptedSecrets }  from './decrypt-secrets';



@Module({
  imports: [
    CourseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: decryptedSecrets.username,
      password: decryptedSecrets.password,
      database: decryptedSecrets.database,
      entities: [CourseEntity],
      synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
