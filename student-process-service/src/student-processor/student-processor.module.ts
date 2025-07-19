import { Module } from '@nestjs/common';
import { StudentProcessorResolver } from './student-processor.resolver';
import { StudentProcessorService } from './student-processor.service';
import { BullModule } from '@nestjs/bull';
import { SubscriberProcessor } from './student-processor';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'student-queue',
    }),
    HttpModule
  ],
  providers: [StudentProcessorResolver, StudentProcessorService, SubscriberProcessor],
})
export class StudentProcessorModule { }
