import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsResolver } from './students.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { Course } from './dto/courseDto';
import { CourseResolver } from 'src/course/course.resolver';
import { BullModule } from '@nestjs/bull';
import { PublisherService } from './utils/publisher.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Student]),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
      playground: true,
      introspection: true,
      buildSchemaOptions: {
        orphanedTypes: [Course],
      },
    }),
    BullModule.registerQueue({
      name: 'student-queue',
    }),
  ],
  providers: [StudentsResolver, StudentsService, CourseResolver,PublisherService],
  exports: [StudentsService, PublisherService],
})
export class StudentsModule { }
