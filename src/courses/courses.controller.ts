import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { Course } from './entities/course.entity';
import { UpdateCourseDto } from './dto/update-course-dto';
import { Response } from 'express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Res() response: Response,
  ): Promise<Response> {
    const course = await this.coursesService.create(createCourseDto);
    return response.status(HttpStatus.CREATED).json({
      status: 'success',
      message: 'Course created successfully',
      data: course,
    });
  }

  @Get()
  async findAll(@Res() response: Response): Promise<Response> {
    const courses = await this.coursesService.findAll();
    return response.status(HttpStatus.OK).json({
      status: 'success',
      message: 'All courses',
      data: courses,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    const course = await this.coursesService.findOne(id);
    if (!course) {
      return response.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        message: 'Course not found',
        data: null,
      });
    }
    return response.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Course',
      data: course,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() response: Response,
  ): Promise<Response> {
    const updatedCourse = await this.coursesService.update(id, updateCourseDto);
    if (!updatedCourse) {
      return response.status(HttpStatus.NOT_FOUND).json({
        status: 'error',
        message: 'Course not found',
        data: null,
      });
    }
    return response.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    await this.coursesService.remove(id);
    return response.status(HttpStatus.NO_CONTENT).json({
      status: 'success',
      message: 'Course deleted successfully',
      data: null,
    });
  }
}
