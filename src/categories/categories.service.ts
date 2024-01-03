import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private async getUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          user_id: true,
          username: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'User data could not be retrieved',
      );
    }
  }

  async getCategories(user_email: string) {
    try {
      const user = await this.getUserByEmail(user_email);
      const categories = await this.prisma.category.findMany({
        where: {
          user_id: user.user_id,
        },
      });

      if (!categories) {
        throw new NotFoundException('Categories not found');
      }

      return {
        message: 'Categories retrieved successfully',
        success: true,
        statusCode: 200,
        categories,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Categories could not be retreieved',
      );
    }
  }

  async getCategory(user_email: string, category_id: number) {
    try {
      const user = await this.getUserByEmail(user_email);
      const category = await this.prisma.category.findUnique({
        where: {
          user_id: user.user_id,
          category_id: category_id,
        },
      });

      return {
        message: 'Category retrieved successfully',
        statusCode: 200,
        success: true,
        category,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        `Could not retrieve category with id ${category_id}.`,
      );
    }
  }

  async createCategory(user_email: string, dto: CategoryDto) {
    try {
      const user = await this.getUserByEmail(user_email);
      const category = await this.prisma.category.create({
        data: {
          user_id: user.user_id,
          category_name: dto.categoryName,
        },
      });

      return {
        message: 'Category created successfully.',
        status: 201,
        success: true,
        category,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create category.');
    }
  }

  async updateCategory(
    user_email: string,
    category_id: number,
    dto: CategoryDto,
  ) {
    try {
      const user = await this.getUserByEmail(user_email);
      const category = await this.prisma.category.update({
        where: {
          user_id: user.user_id,
          category_id: category_id,
        },
        data: {
          category_name: dto.categoryName,
        },
      });

      return {
        message: 'Category updated successfully',
        statusCode: '200',
        success: true,
        category,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Category could not be updated');
    }
  }

  async deleteCategory(user_email: string, category_id: number) {
    try {
      const user = await this.getUserByEmail(user_email);
      const category = await this.prisma.category.delete({
        where: {
          user_id: user.user_id,
          category_id: category_id,
        },
      });

      return {
        message: 'Deleted category successfully',
        success: true,
        statusCode: 200,
        category,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not delete category');
    }
  }
}
