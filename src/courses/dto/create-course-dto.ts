import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CourseLevel } from '../enums/course-level.enum';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(CourseLevel)
  level: CourseLevel; 
}
