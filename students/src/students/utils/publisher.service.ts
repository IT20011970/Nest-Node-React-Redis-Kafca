import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { JobOptions, Queue } from 'bull';

@Injectable()
export class PublisherService {
  private readonly _jobTimeout = 30000; // Default timeout in milliseconds
  constructor(
    @InjectQueue('student-queue') private _studentQueue: Queue,
  ) { }

  async publishEvent(event: string, data: any, joboptions?: JobOptions) {
    const jobOptions: JobOptions = {
      ...joboptions,
      timeout: this._jobTimeout,
    };
    const dataObj = {
      ...data,
      joboptions: jobOptions,
    };

    const job = await this._studentQueue.add(event, dataObj, jobOptions);
    const result = await job.finished(); // ✅ Wait for completion

    console.log('Job completed with result:', result);
    return result;
  }

}
