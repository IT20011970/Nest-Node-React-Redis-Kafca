import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Course } from "src/students/dto/courseDto";
import { Student } from "src/students/entities/student.entity";
import { StudentsService } from "src/students/students.service";


@Resolver((of) => Course)
export class CourseResolver {
  constructor(
    private readonly studentsService: StudentsService,
  ) {}

  @ResolveField((of) => [Student])
  student(@Parent() course: Course): Promise<Student[]> {
      return this.studentsService.forCourse(course.code);
  }

}
