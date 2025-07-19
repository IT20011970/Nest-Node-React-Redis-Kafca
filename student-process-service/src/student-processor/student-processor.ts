import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { StudentProcessorService } from './student-processor.service';

@Processor('student-queue')
export class SubscriberProcessor {
  constructor(
    private readonly studentProcessorService: StudentProcessorService,
  ) { }
  @Process('user.created')
  async handleUserCreated(job: Job) {

    try {
      console.log('User Created Event Received:', job.data);
      const { id, filename } = job.data;
      await this.studentProcessorService.bulkProcessStudents({ id, filename });
      return { success: true, userId: id };
    } catch (err) {
      console.error('Processing failed:', err);
      throw err;
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log(`Job ${job.id} completed with result:`, result);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: any) {
    console.error(`Job ${job.id} failed with error:`, error);
  }
}
