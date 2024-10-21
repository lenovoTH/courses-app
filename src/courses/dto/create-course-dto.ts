import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CourseLevel } from '../course-level.enum';

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
