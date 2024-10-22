import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { Course } from './entities/course.entity';
import { UpdateCourseDto } from './dto/update-course-dto';
import { Response } from 'express';
import { error } from 'console';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Res() response: Response,
  ) {
    this.coursesService
      .create(createCourseDto)
      .then((course) => {
        return response.status(HttpStatus.CREATED).json({
          status: 'success',
          message: 'Course created successfully',
          data: course,
        });
      })
      .catch((err) => {
        return response.status(HttpStatus.BAD_REQUEST).json({
          status: 'err',
          message: 'Course not created',
          data: null,
        });
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() response,
  ): Promise<void> {
    try {
      const updatedCourse = await this.coursesService.update(
        id,
        updateCourseDto,
      );
      response.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Course updated successfully',
        data: updatedCourse,
      });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json({
        status: 'err',
        message: error.message,
        data: null,
      });
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Res() response: Response,
  ): Promise<Response> {
    await this.coursesService.remove(id);
    return response.status(HttpStatus.OK).json({
      status: 'success',
      message: 'Course deleted successfully',
      data: null,
    });
  }
}
