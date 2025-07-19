import { OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
@Processor('student-queue')
export class SubscriberProcessor {

  @Process('user.created')
  async handleUserCreated(job: Job) {
    try {
      console.log('User Created Event Received:', job.data);
      const { id, name } = job.data;
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
