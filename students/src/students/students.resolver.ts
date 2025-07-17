import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateStudentInputDto } from './dto/CreateStudentInputDto';
import { StudentResponse } from './dto/studentResponse';
import { UpdateStudentInput } from './dto/updateStudentInput';
import { Course } from './dto/courseDto';

@Resolver(() => Student)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) { }

  @Query(() => StudentResponse) // Get Students
  async getStudent(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args('offset', { type: () => Int, nullable: true, defaultValue: 0 })
    offset: number,
  ): Promise<StudentResponse> {
    // Validate limit and offset
    if (!Number.isInteger(limit) || limit <= 0) {
      throw new BadRequestException('Limit must be a positive integer');
    }
    if (!Number.isInteger(offset) || offset < 0) {
      throw new BadRequestException('Offset must be a non-negative integer');
    }

    try {
      const result = await this.studentsService.findAll(limit, offset);
      return {
        student: result.students,
        paginationObject: result.pagination,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve students');
    }
  }


  @Mutation(() => Student) //Create user
  async createStudent(
    @Args('createStudentInputDto') createStudentInputDto: CreateStudentInputDto,
  ): Promise<Student> {
    try {
      return await this.studentsService.create(createStudentInputDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Mutation(() => Boolean)
  async deleteStudent(@Args('id') id: string): Promise<boolean> {
    //delete
    try {
      return await this.studentsService.deleteStudent(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Mutation(() => Student) //Update user
  async updateStudent(
    @Args('UpdateStudentInput') updateStudentInput: UpdateStudentInput,
  ): Promise<Student | null> {
    try {
      return this.studentsService.update(
        updateStudentInput.id,
        updateStudentInput,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  @Query(() => [Student], { name: 'getAllStudent' })
  findAll() {
    return this.studentsService.getAll();
  }
  @ResolveField(() => Course, { nullable: true })
  async course(@Parent() student: Student) {
    if (!student.courseID) {
      return null;
    }
    return { __typename: 'Course', code: student.courseID }; // Return a reference
  }
}
