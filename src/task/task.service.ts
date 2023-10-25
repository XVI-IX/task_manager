import { Injectable, InternalServerErrorException, NotFoundException, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../postgres/postgres.service';
import { TaskDto } from './dto/task.dto';

@Injectable()
export class TaskService {

  constructor(
    private config: ConfigService,
    private psql: PostgresService,
  ) {}

  async getTasks(user_email: string) {

    const query = `SELECT * FROM tasks WHERE user_id = $1;`;

    try {

      const user = await this.psql.getUser(user_email);
      const user_id = user.user_id;

      try {
        const tasks = await this.psql.query(query, [user_id]);
        const task_data = tasks.rows;

        return {
          success: true,
          message: "Tasks retrieved",
          tasks: task_data
        }

      } catch (error) {
        console.error(error);
        throw new NotFoundException(error.message);
      }
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
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

  async getTask(user_email: string, id: number) {
    try {
      const user = await this.psql.getUser(user_email);
      const user_id = user.user_id;

      const query = `SELECT * FROM tasks
      WHERE user_id = $1 AND task_id = $2`;
      const values = [user_id, id];

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
        throw new InternalServerErrorException("Please try again.")
      }


    } catch (error) {
      console.error(error);
      throw new NotFoundException(error.message);
    }
  }

  async dueDate(user_email: string, date: string) {

  }

  async updateTask(user_email:string) {
  }
}
