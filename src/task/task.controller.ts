import { Controller, Get, Post, Param, Patch, Delete, Req, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';

@Controller('tasks')
export class TaskController {

  constructor(
    private taskService: TaskService
  ) {}

  //TODO: Get a list of all tasks for the current user
  @Get()
  async getTasks(@Req() req: Request) {
    return this.taskService.getTasks(req);
  }

  //TODO: Create a new task
  @Post("create")
  async createTask (
    @Req() req: Request, @Body() dto: TaskDto) {
      return this.taskService.createTasks(req, dto);
  }

  //TODO: Get a specific task by ID
  @Get(":id")
  async getTask(@Param() params) {

  }

  //TODO: Get a list of all tasks with a specific due date
  @Get("due-date/:date")
  async dueDate(@Param() params) {

  }

  //TODO: Update a specific task
  @Patch(":id/update")
  updateTask(@Param() params) {

  }

  //TODO: Delete a specific task
  @Delete(":id/delete")
  deleteTask(@Param() params) {

  }

  //TODO: Get a list of all tasks with a specific priority
  @Get("priority/:priority")
  getPriorityList(@Param() params) {
    
  }
}
