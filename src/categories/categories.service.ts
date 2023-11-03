import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {

  constructor(
    private prisma: PrismaService
  ) {}

  private async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email
        },
        select: {
          user_id: true,
          username: true
        }
      })

      if (!user) {
        throw new NotFoundException("User not found.");
      }

      return user;

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("User data could not be retrieved")
    }
  }

  async getCategories(user_email: string) {
    try {
      const user = await this.getUserByEmail(user_email);
      const categories = await this.prisma.category.find
    } catch (error) {
      
    }
  }

  async getCategory(user_email: string, category_id: number ) {

  }

  async createCategory(user_email: string) {

  }

  async updateCategory(user_email: string, category_id: number) {

  }

  async deleteCategory(user_email: string, category_id: number) {
    
  }
}
