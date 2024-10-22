import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import { promises } from 'dns';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      const course = this.courseRepository.create(createCourseDto);
      return this.courseRepository.save(course);
    } catch (err) {
      Promise.reject(err);
    }
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepository.find({ where: { deleted_at: null } });
  }

  async findOne(id: string): Promise<Course> {
    return this.courseRepository.findOne({ where: { id, deleted_at: null } });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      await this.courseRepository.update(id, updateCourseDto);
      return this.findOne(id);
    } catch (err) {
        Promise.reject(err);
    }
  }

  async remove(id: string): Promise<void> {
    await this.courseRepository.softDelete(id);
  }
  
}
