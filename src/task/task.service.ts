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

  async updateTask(user_email:string, dto: TaskDto, task_id) {
    try {
      const user = await this.psql.getUser(user_email);
      const query = `SELECT * FROM tasks 
      WHERE task_id = $1 AND user_id = $2`;
      const values = [task_id, user.user_id];

      try {
        const update_query = `UPDATE tasks
        SET title = $1, description = $2,
        due_date = $3, priority = $4,
        category_id = $5,
        updated_at = NOW ()
        WHERE task_id = $6
        RETURNING *;`
        const update_values = [
          dto.title, dto.description,
          dto.due_date, dto.priority,
          dto.category_id, task_id
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
}
