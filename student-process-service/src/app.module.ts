import { Module } from '@nestjs/common';
import { StudentProcessorModule } from './student-processor/student-processor.module';


@Module({
  imports: [StudentProcessorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
