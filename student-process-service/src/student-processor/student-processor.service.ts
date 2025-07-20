import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { DataSource, Repository } from 'typeorm';
import { Student } from './entity/student.entity';
import { environment } from 'src/common/environment';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentProcessorService {
    constructor(private readonly httpService: HttpService,
        private readonly dataSource: DataSource,
        @InjectRepository(Student) private readonly studentRepository: Repository<Student>, 
    ) { }
    async bulkProcessStudents({ id, filename }: { id: string; filename: string }) {
        const url = `http://localhost:3001/upload/${filename}`;
        const requiredFields = environment.requiredFields; 
        const filePath = filename;
        let savedCount = 0;
        let excelRowCount = 0;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const response = await firstValueFrom(this.httpService.get(url));

            if (response.status !== 200) {
                throw new Error(`Upload service returned status: ${response.status}`);
            }

            const excelData = response.data.data;

            if (!Array.isArray(excelData)) {
                throw new Error('Invalid Excel data format');
            }

            excelRowCount = excelData.length;

            for (const [index, element] of excelData.entries()) {
                const missingFields = requiredFields.filter((field) => !element[field]);

                if (missingFields.length > 0) {
                    throw new BadRequestException(
                        `Missing required field(s) '${missingFields.join(', ')}' in row ${index + 1}`,
                    );
                }

                const student = await this.bulkCreate(element);

                if (student) {
                    await queryRunner.manager.save(student);
                    savedCount++;
                }
            }

            await queryRunner.commitTransaction();
            // await this.excelService.updateFileStatus(filePath);
            // await this.studentsService.removeAllCache();
            // await this.studentsService.createTopic(
            //     `Processing complete. Total rows: ${excelRowCount}, Saved rows: ${savedCount}`,
            //     id,
            //     '',
            //     'success',
            // );

            return {
                success: true,
                total: excelRowCount,
                saved: savedCount,
            };

        } catch (error) {
            await queryRunner.rollbackTransaction();
            // await this.studentsService.createTopic(
            //     `Error processing Excel: ${error.message}`,
            //     id,
            //     '',
            //     'error',
            // );
            throw new BadRequestException(`Error processing Excel: ${error.message}`);
        } finally {
            await queryRunner.release();
        }
    }

    async bulkCreate(element: any): Promise<Student> {
        const student = this.studentRepository.create({
            //create objects
            fname: element[environment.requiredFields[0]] as string,
            lname: element[environment.requiredFields[1]] as string,
            email: element[environment.requiredFields[2]] as string,
            dob: new Date(
                ((element[environment.requiredFields[3]] as number) - 25569) *
                86400 *
                1000,
            ),
            courseID: element[environment.requiredFields[4]] as string,
        });
        return student;
    }
}
