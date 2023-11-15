import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorators/user.decorator';
import { CategoryDto } from './dto/category.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Categories')
@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {

  constructor(
    private categoryService: CategoriesService
  ) {}

  @Get()
  @ApiResponse({
    description: "Gets all categories by the user",
    status: 200
  })
  async getCategories(@User() user) {
    return this.categoryService.getCategories(user.email)
  }


  @Get(":id")
  @ApiResponse({
    description: "Get category by id",
    status: 200
  })
  async getCategory(@User() user, @Param("id", ParseIntPipe) category_id: number) {

  }

  @Post("/create")
  @ApiResponse({
    description: "Create a new category",
    status: 201
  })
  async createCategory(@User() user, @Body() dto: CategoryDto) {
    
    return this.categoryService.createCategory(user.email, dto);
  }

  @Patch(":id/update")
  @ApiResponse({
    description: "Update a particular category",
    status: 200
  })
  async updateCategory(@User() user, @Param("id", ParseIntPipe) category_id: number, @Body() dto: CategoryDto) {
    return this.categoryService.updateCategory(user.email, category_id, dto);
  }

  @Delete(":id/delete")
  @ApiResponse({
    description: "Delete a particular Category",
    status: 200
  })
  async deleteCategory(@User() user, @Param("id", ParseIntPipe) category_id: number) {
    return this.categoryService.deleteCategory(user.email, category_id);
  }
}
