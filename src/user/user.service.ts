import { Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(
    private prisma: PrismaService
  ) {}

  private async getUserByEmail (user_email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: user_email
        },
        select: {
          user_id: true,
          username: true,
          email: true
        }
      });

      if (!user) {
        throw new NotFoundException("User not found.");
      }

      return user;

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProfile(user_email: string) {
    try {
      const user = await this.getUserByEmail(user_email);

      return user;

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    } 
  }

  async getDashboard(user_email: string) {
    try {
      const user = await this.getUserByEmail(user_email);

      try {
        const tasks = await this.prisma.task.findMany({
          where: {
            user_id: user.user_id
          }
        });

        if (!tasks) {
          throw new InternalServerErrorException("unable to retrieve tasks data");
        }

        if (tasks.length === 0) {
          return {
            message: `No tasks for user ${user.username}`,
            user: user,
            tasks: tasks,
            success: true,
            statusCode: 200
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
        throw new InternalServerErrorException("Unable to retrieve dashboard data");
      }

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Unable to retrieve user data");
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