import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as XLSX from 'xlsx';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { existsSync } from 'fs';

@Controller('upload')
export class FileUploadController {
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = uuidv4();
                    const ext = extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    handleUpload(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new Error('File not provided');
        }
        return {
            fileName: file.originalname,
            accessKey: file.filename,
        };
    }


  @Get(':accessKey')
  getFileData(@Param('accessKey') accessKey: string) {
    const filePath = join(process.cwd(), 'uploads', accessKey);

    // Check if file exists
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    let workbook: XLSX.WorkBook;
    try {
      // Try to read the Excel file
      workbook = XLSX.readFile(filePath);
    } catch (err) {
      throw new BadRequestException('Failed to read Excel file. The file may be corrupted or not a valid Excel format.');
    }

    // Check if the workbook has at least one sheet
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new BadRequestException('Excel file contains no sheets.');
    }

    try {
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      return {
        accessKey,
        data: jsonData,
      };
    } catch (err) {
      throw new InternalServerErrorException('Failed to parse Excel sheet data.');
    }
  }
}
