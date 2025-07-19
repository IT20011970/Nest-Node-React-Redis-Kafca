import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StudentProcessorService {
    constructor(private readonly httpService: HttpService) { }
    async bulkProcessStudents({ id, filename }: { id: string; filename: string }) {
        const url = `http://localhost:3001/upload/${filename}`;

        try {
            const response = await firstValueFrom(
                this.httpService.get(url)
            );

            if (response.status !== 200) {
                console.error(`Upload service returned status: ${response.status}`);
                throw new Error('Upload service error');
            }

            const excelData = response.data.data;
            console.log(response.data);
            if (!Array.isArray(excelData)) {
                throw new Error('Invalid Excel data format');
            }
            console.log(` students from file: ${filename}`, excelData);
            for (const student of excelData) {
                console.log(`User ${id} - Student:`, student);
            }

            return { success: true, count: excelData.length };

        } catch (error) {
            console.error('Error processing Excel file:', error.message);
            throw new Error('Excel file processing failed');
        }
    }
}
