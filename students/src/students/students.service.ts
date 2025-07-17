import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';

import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentInputDto } from './dto/CreateStudentInputDto';
import { Repository } from 'typeorm';
import { UpdateStudentInput } from './dto/updateStudentInput';

@Injectable()
export class StudentsService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    // private readonly _kafka: ProducerService,
    // private cache: CacheService,
  ) { }
  async create(createStudentInput: CreateStudentInputDto): Promise<Student> {
    //save data
    try {
      const newStudent =
        await this.studentRepository.create(createStudentInput);
      // await this.cache.removeCacheList(
      //   `Studentservice:student:${newStudent.courseID}`,
      // );
      return this.studentRepository.save(newStudent); // retrive data
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findAll(limit: number, offset: number) {
    // Validate limit and offset
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new BadRequestException('Limit must be a positive integer');
    }
    if (!Number.isInteger(offset) || offset < 0) {
      throw new BadRequestException('Offset must be a non-negative integer');
    }

    try {
      // Count total students
      const studentCount = await this.studentRepository.count();

      // Calculate page from offset and limit (page starts from 1)
      const page = Math.floor(offset / limit) + 1;

      // Retrieve students with pagination
      const studentDB = await this.studentRepository.find({
        skip: offset,
        take: limit,
      });

      if (!studentDB || studentDB.length === 0) {
        return {
          students: [],
          pagination: {
            total: studentCount,
            page,
            limit,
            totalPages: Math.ceil(studentCount / limit),
          },
        };
      }

      // Map student data with calculated age
      const students = studentDB.map((d) => ({
        id: d.id,
        fname: d.fname,
        lname: d.lname,
        email: d.email,
        dob: d.dob,
        courseID: d.courseID,
        age: this.calculateAge(d.dob),
      }));

      // Pagination response
      const paginationStudent = {
        total: studentCount,
        page,
        limit,
        totalPages: Math.ceil(studentCount / limit), // Add totalPages
      };

      return {
        students,
        pagination: paginationStudent,
      };
    } catch (error) {
      console.error(error); // Log the error for debugging
      throw new InternalServerErrorException(error.message);
    }
  }

  calculateAge(dob: Date): number {
    //calculate age
    console.log(dob);
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  }




  findOne(id: number) {
    return `This action returns a #${id} student`;
  }

  async update(
    //update
    id: string,
    updateStudentInput: UpdateStudentInput,
  ): Promise<Student | null> {
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new NotFoundException();
      }
      // await this.cache.removeCacheList(
      //   `Studentservice:student:${student.courseID}`,
      // );
      await this.studentRepository.update(id, updateStudentInput);
      const returnData = await this.studentRepository.findOne({
        where: { id },
      });
      if (!returnData) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      // await this.cache.removeCacheList(
      //   `Studentservice:student:${returnData.courseID}`,
      // );
      return returnData;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteStudent(id: string): Promise<boolean> {
    //delete student
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new NotFoundException();
      }
      // await this.cache.removeCacheList(
      //   `Studentservice:student:${student.courseID}`,
      // );
      const result = await this.studentRepository.delete({ id: id });
      if (result.affected == 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll() {
    return await this.studentRepository.find();
  }


  async forCourse(code: string) {
    // const key = `Studentservice:student:${code}`;
    var studentReturn;
    const students = await this.studentRepository.find({
      where: { courseID: code },
    });

    studentReturn = students;

    return await studentReturn;
  }
}
