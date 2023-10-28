import { Injectable, InternalServerErrorException, NotFoundException, Req, Request } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PostgresService } from '../postgres/postgres.service';
import { PrismaService } from 'src/prisma/prisma.service';
// import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService,
    // private config?: ConfigService,
    // private psql?: PostgresService,
  ) {}

  async profile(user_email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email
        }
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      delete user.password;

      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    } 
  }

  async dashboard(user_email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email
        }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      delete user.password;

      try {
        const tasks = await this.prisma.task.findMany({
          where: {
            user_id: user.user_id
          }
        });

        if (!tasks) {
          return {
            user: {
              message: "User Data retrieved Successfully",
              data: user,
            },
            tasks: {
              message: "Task Data could not be retrieved",
              tasks: []
            },
            success: "partial",
            statusCode: 207
          }
        }

        if (tasks.length == 0) {
          return {
            message: "No tasks present for User",
            user: user,
            tasks: [],
            statusCodes: 200,
            success: true
          }
        }

        return {
          message: "Dashboard data retreived successfully",
          user: user,
          tasks: tasks,
          success: true,
          statusCodes: 200
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException("Please try again");
      }

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Please try again later.");
    }
    
  }

  async testUser() {
    
    const user = await this.prisma.user.findUnique({
      where: {
        email: "testUser@admin.com"
      }
    })

    return user.username;
  }
}