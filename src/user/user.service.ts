import { Injectable, NotFoundException, Req, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../postgres/postgres.service';

@Injectable()
export class UserService {

  constructor(
    private config?: ConfigService,
    private psql?: PostgresService
  ) {}

  async profile(@Req() req: Request) {
    const user_query = `SELECT * FROM users WHERE email = $1;`
    const user_values = [req['user'].payload.email];



    try {
      const user = await this.psql.query(user_query, user_values);

      if (!user) {
        throw new NotFoundException(`Could not find user`);
      }

      const user_data = user.rows[0];
      const tasks_query = `SELECT * FROM tasks WHERE user_id = $1`
      const task_values = [user_data.user_id];
      
      try {
        const tasks = await this.psql.query(tasks_query, task_values);
        const tasks_data = tasks.rows[0];

        return {
          user: user_data,
          tasks: tasks_data
        }
      } catch (error) {
        console.error(error);
        throw new Error(error.message);
      }


    } catch (error){
      console.error(error);
      throw new Error(error.message);
    }
  }

  async dashboard() {
    
  }
}
