import { Module } from '@nestjs/common';
import { StudentProcessorResolver } from './student-processor.resolver';
import { StudentProcessorService } from './student-processor.service';

@Module({
  providers: [StudentProcessorResolver, StudentProcessorService]
})
export class StudentProcessorModule {}
