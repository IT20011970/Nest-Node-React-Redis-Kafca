import { Module } from '@nestjs/common';
import { StudentProcessorResolver } from './student-processor.resolver';
import { StudentProcessorService } from './student-processor.service';
import { BullModule } from '@nestjs/bull';
import { SubscriberProcessor } from './student-processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'student-queue',
    }),
  ],
  providers: [StudentProcessorResolver, StudentProcessorService, SubscriberProcessor],
})
export class StudentProcessorModule { }
