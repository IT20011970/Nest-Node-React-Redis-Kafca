import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './students/entities/student.entity';
import { decryptedSecrets }  from './decrypt-secrets';


@Module({
  imports: [StudentsModule,
    TypeOrmModule.forFeature([Student]),
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
