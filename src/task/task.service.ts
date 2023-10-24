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
      const user_query = `SELECT * FROM users WHERE email = $1;`;
      const user_values = [user_email];

      const user = await this.psql.query(user_query, user_values);

      console.log(user.rows[0]);

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const user_id = user.rows[0].sub;
      console.log(user_id);

      try {
        const tasks = await this.psql.query(query, [user_id]);
        const task_data = tasks.row;

        return {
          success: true,
          message: "Tasks retrieved",
          tasks: task_data
        }

      } catch (error) {
        console.error(error);
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  async createTasks(user_email: string, dto: TaskDto): Promise<{}> {

    const query = `SELECT * FROM users WHERE email = $1`;
    const values = [user_email];

    try {
      const result = await this.psql.query(query, values);
      const user_id = result.rows[0].user_id;

      if (!user_id) {
        throw new Error();
      }

      dto['user_id'] = user_id;

      try {
        const task_query = `
        INSERT INTO tasks (title, description, due_date, priority, user_id, category_id)
        VALUES ($1, $2, $3, $4, $5, $6)`;
        const values = [
          dto.title, dto.description,
          dto.due_date, dto.priority,
          dto.user_id, dto.category_id
        ]

        const addTask = await this.psql.query(task_query, values);

        if (!addTask) {
          throw new InternalServerErrorException("Please try again");
        }

        return {
          message: "Task added successfully",
          success: true,
          statusCode: 201
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
}
