import { Injectable, InternalServerErrorException, NotFoundException, Req, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostgresService } from '../postgres/postgres.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService,
    private config?: ConfigService,
    private psql?: PostgresService,
  ) {}

  async profile(user_email: string) {
     try {

      const user = await this.psql.getUser(user_email);
      delete user.password;

      try {
        const query = `
        SELECT * FROM tasks
        WHERE user_id = $1;
        `
      const values = [user.user_id];
      const result = await this.psql.query(query, values);

      if (!result) {
        throw new NotFoundException("Tasks for user not found")
      }

      if (result.rows.length == 0) {
        return {
          message: "No tasks for user.",
          success: true,
          statusCode: 404,
          user: user,
          tasks: [],
          number_of_tasks: result.rows.length
        }
      }

      return {
        message: "User Profile",
        success: true,
        statusCode: 200,
        user: user,
        tasks: result.rows,
        number_of_tasks: result.rows.length
      }

      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error.message);
      }
     } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException(error);
     }
  }

  async dashboard(user_email: string) {
    
  }
}
