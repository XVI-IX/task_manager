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

  async getTasks(user_email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email
        }
      });

      if (!user) {
        throw new NotFoundException("User does not exist");
      }

      delete user.password;

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
        throw new InternalServerErrorException("Please try again later");
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async createTasks(user_email: string, dto: TaskDto): Promise<{}> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email
        }
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      dto.user_id = user.user_id;
      let due_date = moment(dto.due_date);
      dto.due_date = due_date.format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
      delete user.password;

      try {
        const task = await this.prisma.task.create({
          data: dto
        });

        if (!task) {
          console.error("Task not created");
          throw new InternalServerErrorException("Please try again");
        }

        console.log(task);

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
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTask(user_email: string, task_id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email
        }
      });

      if (!user) {
        console.log("User could not be found");
        throw new NotFoundException('User not found');
      }

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
          task: task
        }
        
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Please try again");
      }
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException("Please try again.");
    }
  }

  async dueDate(user_email: string, date: string) {
    try {
      console.log(`Date: ${date}`);

      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email
        }
      });

      if (!user) {
        throw new InternalServerErrorException("Please try again later.")
      }

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
            tasks: tasks
          }
        }

        return {
          message: `Tasks due on ${date}`,
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

  async updateTask(user_email:string, dto: TaskDto, task_id) {
    try {
      const user = await this.psql.getUser(user_email);

      try {
        const update_query = `UPDATE tasks
        SET title = $1, description = $2,
        due_date = $3, priority = $4,
        category_id = $5,
        updated_at = NOW ()
        WHERE task_id = $6 AND user_id = $7
        RETURNING *;`
        const update_values = [
          dto.title, dto.description,
          dto.due_date, dto.priority,
          dto.category_id, task_id,
          user.user_id
        ]

        const result = await this.psql.query(update_query, update_values);

        return {
          message: "Update Successful",
          success: true,
          task: result.rows[0]
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error.message);
      }
    } catch (error) {
      console.error(error.message);
      throw new NotFoundException("User not Found");
    }
  }

  async deleteTask(user_email: string, dto: TaskDto, task_id) {
    try {
      const user = await this.psql.getUser(user_email);
      const query = `DELETE FROM tasks 
                     WHERE task_id = $1 AND user_id = $2
                     RETURNING *;`
      const value = [
        task_id, user.user_id
      ]

      try {
        let result = await this.psql.query(query, value);
        result = result.rows[0];

        return {
          message: "Tasks deleted successfully",
          success: true,
          statusCode: 200,
          task: result

        }

      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error.message);
      }
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException("There seems to be a proble from our end. Please try again.")
    }
  }

  async getPriorityList(user_email: string, priority: number) {
    try {
      const user = await this.psql.getUser(user_email);
      const query = `SELECT * FROM tasks
                     WHERE priority = $1 AND user_id = $2`;
      const value = [
        priority, user.user_id
      ];

      try {
        let result = await this.psql.query(query, value);
        result = result.rows;

        if (!result) {
          return {
            message: "No Task with specified priority was found.",
            success: true,
            statusCode: 404,
            tasks: []
          }
        }

        return {
          message: 'Tasks retrieved successfully',
          success: true,
          statusCode: 200,
          tasks: result
        }
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
