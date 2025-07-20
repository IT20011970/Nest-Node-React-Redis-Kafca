import { Module } from '@nestjs/common';
import { StudentProcessorModule } from './student-processor/student-processor.module';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { decryptedSecrets } from './decrypt-secrets';
import { Student } from './student-processor/entity/student.entity';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [StudentProcessorModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: decryptedSecrets.username,
      password: decryptedSecrets.password,
      database: decryptedSecrets.database,
      entities: ['dist/**/*.entity.{ts,js}'],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    })],
  controllers: [],
  providers: [],
})
export class AppModule { }
