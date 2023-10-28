import { Injectable, InternalServerErrorException, NotFoundException, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../postgres/postgres.service';
import { TaskDto } from './dto/task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TaskService {

  constructor(
    private config: ConfigService,
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
      const result = await this.psql.getUser(user_email);
      const user_id = result.user_id;

      if (!user_id) {
        throw new Error();
      }

      dto['user_id'] = user_id;

      try {
        const task_query = `
        INSERT INTO tasks (title, description, due_date, priority, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [
          dto.title, dto.description,
          dto.due_date, dto.priority,
          dto.user_id, dto.category_id
        ]

        let result = await this.psql.query(task_query, values);
        result = result.rows[0];

        if (!result) {
          throw new InternalServerErrorException("Please try again");
        }

        return {
          message: "Task added successfully",
          success: true,
          statusCode: 201,
          task: result
        };

      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Please try again");
      }
    } catch (error) {
      console.error(error)
      throw new Error(error.message);
    }
  }

  async getTask(user_email: string, task_id: number) {

    console.log(task_id, typeof task_id);

    try {
      const user = await this.psql.getUser(user_email);
      const user_id = user.user_id;

      const query = `SELECT * FROM tasks
      WHERE user_id = $1 AND task_id = $2;`;
      const values = [user_id, task_id];

      try {
        let result = await this.psql.query(query, values);
        result = result.rows

        if (!result) {
          return {
            message: "No task with id found",
            success: true,
            statusCode: 404,
            result: result
          }
        }

        return {
          message: "Task found",
          success: true,
          statusCode: 200,
          result: result
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Please try again.")
      }


    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async dueDate(user_email: string, date: string) {
    
    console.log(`dueDate: ${date}`);
    try {

      const user = await this.psql.getUser(user_email);
      const query = `SELECT * FROM tasks
                     WHERE due_date = $1 AND user_id = $2;`
      const values = [date, user.user_id];

      try {
        const tasks = await this.psql.query(query, values);

        if ( !tasks.rows ) {
          return {
            message: `No tasks due for ${date}`,
            success: true,
            statusCode: 404
          }
        }

        return {
          message: `Tasks due on ${date} found.`,
          statusCode: 200,
          tasks: tasks.rows,
          success: true
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Please try again");
      }
    } catch (error) {
      console.error(error);
      console.error(error.message);
      throw new InternalServerErrorException("Please try again!")
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
