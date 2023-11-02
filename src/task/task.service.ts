import { Injectable, InternalServerErrorException, NotFoundException, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../postgres/postgres.service';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from '../prisma/prisma.service';

import  * as moment from 'moment';

@Injectable()
export class TaskService {

  constructor(
    private psql: PostgresService,
    private prisma: PrismaService
  ) {}

  private async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        user_id: true,
        username: true
      }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async getTasks(user_email: string) {
    try {
      const user = await this.getUserByEmail(user_email);
      try {
        const tasks = await this.prisma.task.findMany({
          where: {
            user_id: user.user_id
          }
        });

        return {
          message: "Tasks retrieved successfully",
          success: true,
          statusCode: 200,
          tasks: tasks
        }
        
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Tasks could not be retrieved. Please try again later");
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("User data could not be retrieved. Please try again later");
    }
  }

  async createTasks(user_email: string, dto: TaskDto): Promise<{}> {
    try {
      const user = await this.getUserByEmail(user_email);

      dto.user_id = user.user_id;
      let due_date = moment(dto.due_date);
      dto.due_date = due_date.format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");

      try {
        const task = await this.prisma.task.create({
          data: dto
        });

        if (!task) {
          console.error("Task not created");
          throw new InternalServerErrorException("Please try again");
        }

        return {
          message: "Task created successfully",
          success: true,
          task: task,
          statusCode: 201
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Task could not be created successfully");
      }
      
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("User data could not be retrieved");
    }
  }

  async getTask(user_email: string, task_id: number) {
    try {
      const user = await this.getUserByEmail(user_email);
      try {
        const task = await this.prisma.task.findUnique({
          where: {
            user_id: user.user_id,
            task_id: task_id
          }
        })

        if (!task) {
          throw new NotFoundException("Tasks not Found");
        }

        return {
          message: "Task retrieved successfully",
          success: true,
          statusCode: 200,
          task
        }
        
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Task data could not be retrieved");
      }
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException("User data could not be retrieved. Please try again");
    }
  }

  async dueDate(user_email: string, date: string) {
    try {

      const user = await this.getUserByEmail(user_email);

      try {
        const tasks = await this.prisma.task.findMany({
          where: {
            user_id: user.user_id,
            due_date: date
          }
        });

        if (tasks.length === 0) {
          return {
            message: `No tasks due on ${date}`,
            success: true,
            statusCode: 200,
            tasks
          }
        }

        return {
          message: `Tasks due on ${date}`,
          success: true,
          statusCode: 200,
          tasks
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(`Tasks due on ${date} could not be retrieved.`);
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("User data could not be retrieved");
    }
  }

  async updateTask(user_email:string, dto: TaskDto, task_id: number) {
    try {
      const user = await this.getUserByEmail(user_email);

      try {
        let task = await this.prisma.task.findUnique({
          where: {
            user_id: user.user_id,
            task_id: task_id
          }
        });

        task.title = dto.title;
        task.description = dto.description;
        task.due_date = new Date(dto.due_date);
        task.priority = dto.priority;

        const update = await this.prisma.task.update({
          where: {
            user_id: user.user_id,
            task_id: task.task_id
          },
          data: task
        });

        return {
          message: "Task updated successfully",
          success: true,
          statusCode: 200,
          update
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Task could not be updated successfully");
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("User data could not be retrieved");
    }
  }

  async deleteTask(user_email: string, task_id: number): Promise<{}> {
    try {
      const user = await this.getUserByEmail(user_email);

      try {

        const task = await this.prisma.task.delete({
          where: {
            user_id: user.user_id,
            task_id: task_id
          }
        });

        return {
          message: "Task deleted successfully",
          success: true,
          statusCode: 200,
          task
        }
        
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Task could not be deleted.");
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("User data could not be retrieved.");
    }
  }

  async getPriorityList(user_email: string, priority: number) {
    try {
      const user = await this.getUserByEmail(user_email);

      try {
        const tasks = await this.prisma.task.findMany({
          where: {
            user_id: user.user_id,
            priority: priority
          }
        });

        if (!tasks) {
          throw new InternalServerErrorException("Unable to retrieve tasks data");
        }

        if (tasks.length === 0 ) {
          return {
            message: `No tasks with priority of ${priority}`,
            success: true,
            statusCode: 200
          }
        }

        return {
          message: `Tasks with priority of ${priority}`,
          success: true,
          statusCode: 200,
          tasks: tasks
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error.message);
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCategories() {
    
  }
}
