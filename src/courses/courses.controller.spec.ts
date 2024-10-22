import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import { Course } from './entities/course.entity';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CourseLevel } from './enums/course-level.enum';

describe('CoursesController', () => {
  let coursesController: CoursesController;
  let coursesService: CoursesService;

  const mockCourseService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [
        {
          provide: CoursesService,
          useValue: mockCourseService,
        },
      ],
    }).compile();

    coursesController = module.get<CoursesController>(CoursesController);
    coursesService = module.get<CoursesService>(CoursesService);
  });

  describe('create', () => {
    it('should create a course', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        level: CourseLevel.AVANCE,
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockCourseService.create.mockResolvedValue({
        id: '1',
        ...createCourseDto,
      });

      await coursesController.create(createCourseDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(response.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Course created successfully',
        data: { id: '1', ...createCourseDto },
      });
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const courses: Course[] = [
        {
          id: '1',
          title: 'Test Course',
          description: 'Test Description',
          level: CourseLevel.DEBUTANT,
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: null,
        },
      ];

      mockCourseService.findAll.mockResolvedValue(courses);

      await coursesController.findAll(response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'All courses',
        data: courses,
      });
    });
  });

  describe('findOne', () => {
    it('should return a course', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const course: Course = {
        id: '1',
        title: 'Test Course',
        description: 'Test Description',
        level: CourseLevel.INTERMEDIAIRE,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      mockCourseService.findOne.mockResolvedValue(course);

      await coursesController.findOne('1', response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Course',
        data: course,
      });
    });

    it('should return a 404 error if the course is not found', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockCourseService.findOne.mockResolvedValue(null);

      await coursesController.findOne('1', response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(response.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Course not found',
        data: null,
      });
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Updated Course',
        description: 'Updated Description',
        level: CourseLevel.AVANCE,
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const updatedCourse: Course = {
        id: '1',
        title: 'Updated Course',
        description: 'Updated Description',
        level: CourseLevel.AVANCE,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      mockCourseService.update.mockResolvedValue(updatedCourse);

      await coursesController.update('1', updateCourseDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK); // Should be OK (200) after a successful update
      expect(response.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Course updated successfully',
        data: updatedCourse,
      });
    });

    it('should return a 400 error if the course cannot be updated', async () => {
      const updateCourseDto: UpdateCourseDto = {
        title: 'Updated Course',
        description: 'Updated Description',
      };
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockCourseService.update.mockRejectedValue(
        new Error('Course not updated'),
      );

      await coursesController.update('1', updateCourseDto, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(response.json).toHaveBeenCalledWith({
        status: 'err',
        message: 'Course not updated',
        data: null,
      });
    });
  });

  describe('remove', () => {
    it('should delete a course', async () => {
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      mockCourseService.remove.mockResolvedValue(undefined);

      await coursesController.remove('1', response);

      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Course deleted successfully',
        data: null,
      });
    });
  });
});
