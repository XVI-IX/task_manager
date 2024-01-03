import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresService } from '../postgres/postgres.service';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from '../prisma/prisma.service';

import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TaskService {
  constructor(
    private psql: PostgresService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  private async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        user_id: true,
        username: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getTasks(user_email: string, query_params?) {
    try {
      const user = await this.getUserByEmail(user_email);
      const tasks = await this.prisma.task.findMany({
        where: {
          user_id: user.user_id,
        },
        skip: (query_params.page - 1) * this.config.get('PAGESIZE'),
        take: parseInt(this.config.get('PAGESIZE')),
      });

      const filteredTasks = this.filterTasks(
        tasks,
        query_params.page,
        query_params.category_id,
        query_params.priority,
      );

      return filteredTasks;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Tasks could not be retrieved. Please try again later',
      );
    }
  }

  async createTasks(user_email: string, dto: TaskDto): Promise<object> {
    try {
      const user = await this.getUserByEmail(user_email);

      dto.user_id = user.user_id;
      const due_date = moment(dto.due_date);
      dto.due_date = due_date.format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
      const task = await this.prisma.task.create({
        data: dto,
      });

      if (!task) {
        console.error('Task not created');
        throw new InternalServerErrorException('Please try again');
      }

      return {
        message: 'Task created successfully',
        success: true,
        task: task,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Task could not be created successfully',
      );
    }
  }

  async getTask(user_email: string, task_id: number) {
    try {
      const user = await this.getUserByEmail(user_email);
      try {
        const task = await this.prisma.task.findUnique({
          where: {
            user_id: user.user_id,
            task_id: task_id,
          },
        });

        if (!task) {
          throw new NotFoundException('Tasks not Found');
        }

        return {
          message: 'Task retrieved successfully',
          success: true,
          statusCode: 200,
          task,
        };
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(
          'Task data could not be retrieved',
        );
      }
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(
        'User data could not be retrieved. Please try again',
      );
    }
  }

  async dueDate(user_email: string, date: string, query_params) {
    try {
      const user = await this.getUserByEmail(user_email);

      try {
        const tasks = await this.prisma.task.findMany({
          where: {
            user_id: user.user_id,
            due_date: date,
          },
        });

        const filteredTasks = this.filterTasks(
          tasks,
          query_params.page,
          query_params.category_id,
          query_params.priority,
        );

        return filteredTasks;
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(
          `Tasks due on ${date} could not be retrieved.`,
        );
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'User data could not be retrieved',
      );
    }
  }

  async updateTask(user_email: string, dto: TaskDto, task_id: number) {
    try {
      const user = await this.getUserByEmail(user_email);

      try {
        const task = await this.prisma.task.findUnique({
          where: {
            user_id: user.user_id,
            task_id: task_id,
          },
        });

        task.title = dto.title;
        task.description = dto.description;
        task.due_date = new Date(dto.due_date);
        task.priority = dto.priority;

        const update = await this.prisma.task.update({
          where: {
            user_id: user.user_id,
            task_id: task.task_id,
          },
          data: task,
        });

        return {
          message: 'Task updated successfully',
          success: true,
          statusCode: 200,
          update,
        };
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(
          'Task could not be updated successfully',
        );
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'User data could not be retrieved',
      );
    }
  }

  async deleteTask(user_email: string, task_id: number): Promise<object> {
    try {
      const user = await this.getUserByEmail(user_email);

      try {
        const task = await this.prisma.task.delete({
          where: {
            user_id: user.user_id,
            task_id: task_id,
          },
        });

        return {
          message: 'Task deleted successfully',
          success: true,
          statusCode: 200,
          task,
        };
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException('Task could not be deleted.');
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'User data could not be retrieved.',
      );
    }
  }

  private filterTasks(
    tasks,
    page: string = '1',
    queryCategory?: string,
    queryPriority?: string,
  ) {
    try {
      if (queryCategory && queryPriority) {
        const filteredTasks = tasks.filter(
          (task) =>
            task.category_id === parseInt(queryCategory) &&
            task.priority === parseInt(queryPriority),
        );

        return {
          message: 'Tasks retrieved Successfully',
          success: true,
          statusCode: 200,
          tasks: filteredTasks,
          total_tasks: filteredTasks.length,
          page: page || 1,
        };
      }

      if (queryCategory) {
        const filteredTasks = tasks.filter(
          (task) => task.category_id === parseInt(queryCategory),
        );

        return {
          message: 'Tasks retrieved Successfully',
          success: true,
          statusCode: 200,
          tasks: filteredTasks,
          total_tasks: filteredTasks.length,
          page: page || 1,
        };
      }

      if (queryPriority) {
        const filteredTasks = tasks.filter(
          (task) => task.priority === parseInt(queryPriority),
        );
        return {
          message: 'Tasks retrieved Successfully',
          success: true,
          statusCode: 200,
          tasks: filteredTasks,
          total_tasks: filteredTasks.length,
          page: page || 1,
        };
      }

      return {
        message: 'Tasks retrieved successfully',
        success: true,
        statusCode: 200,
        tasks: tasks,
        total_tasks: tasks.length,
        page: page || 1,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }
}
