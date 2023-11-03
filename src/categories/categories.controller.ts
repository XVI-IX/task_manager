import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { userInfo } from 'os';
import { CategoryDto } from './dto/category.dto';

@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {

  constructor(
    private categoryService: CategoriesService
  ) {}

  @Get()
  async getCategories(@User() user) {
    return this.categoryService.getCategories(user.email)
  }

  @Get(":id")
  async getCategory(@User() user, @Param("id", ParseIntPipe) category_id: number) {

  }

  @Post("/create")
  async createCategory(@User() user, @Body() dto: CategoryDto) {
    return this.categoryService.createCategory(user.email);
  }

  @Patch(":id/update")
  async updateCategory(@User() user, @Param("id", ParseIntPipe) category_id: number, @Body() dto: CategoryDto) {
    return this.categoryService.updateCategory(user.email, category_id);
  }

  @Delete(":id/delete")
  async deleteCategory(@User() user, @Param("id", ParseIntPipe) category_id: number) {
    return this.categoryService.deleteCategory(user.email, category_id);
  }
}
