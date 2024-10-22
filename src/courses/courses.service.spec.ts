import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course-dto';
import { UpdateCourseDto } from './dto/update-course-dto';
import { CourseLevel } from './enums/course-level.enum';

describe('CoursesService', () => {
  let service: CoursesService;
  let repository: Repository<Course>;

  const mockCourseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockCourseRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    repository = module.get<Repository<Course>>(getRepositoryToken(Course));
  });

  describe('create', () => {
    it('should create a course', async () => {
      const createCourseDto: CreateCourseDto = {
        title: 'Test Course',
        description: 'Test Description',
        level: CourseLevel.DEBUTANT,
      };

      const course = { id: '1', ...createCourseDto };

      mockCourseRepository.create.mockReturnValue(course);
      mockCourseRepository.save.mockResolvedValue(course);

      const result = await service.create(createCourseDto);

      expect(result).toEqual(course);
      expect(mockCourseRepository.create).toHaveBeenCalledWith(createCourseDto);
      expect(mockCourseRepository.save).toHaveBeenCalledWith(course);
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      const courses = [
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

      mockCourseRepository.find.mockResolvedValue(courses);

      const result = await service.findAll();

      expect(result).toEqual(courses);
      expect(mockCourseRepository.find).toHaveBeenCalledWith({
        where: { deleted_at: null },
      });
    });
  });

  describe('findOne', () => {
    it('should return a course', async () => {
      const course = {
        id: '1',
        title: 'Test Course',
        description: 'Test Description',
        level: CourseLevel.DEBUTANT,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      mockCourseRepository.findOne.mockResolvedValue(course);

      const result = await service.findOne('1');

      expect(result).toEqual(course);
      expect(mockCourseRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1', deleted_at: null },
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

      const updatedCourse = {
        id: '1',
        ...updateCourseDto,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      };

      mockCourseRepository.update.mockResolvedValue(undefined); 
      mockCourseRepository.findOne.mockResolvedValue(updatedCourse);

      const result = await service.update('1', updateCourseDto);

      expect(result).toEqual(updatedCourse);
      expect(mockCourseRepository.update).toHaveBeenCalledWith(
        '1',
        updateCourseDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a course', async () => {
      await service.remove('1');

      expect(mockCourseRepository.softDelete).toHaveBeenCalledWith('1');
    });
  });
});

