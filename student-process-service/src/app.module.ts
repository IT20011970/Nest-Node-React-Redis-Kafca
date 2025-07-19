import { Module } from '@nestjs/common';
import { StudentProcessorModule } from './student-processor/student-processor.module';
import { BullModule } from '@nestjs/bull';


@Module({
  imports: [StudentProcessorModule,
    BullModule.registerQueue({
      name: 'student-queue',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
