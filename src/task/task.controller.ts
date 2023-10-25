import { 
  Controller, Get, Post,
  Param, Patch, Delete,
  Req, Body, UseGuards, HttpCode } from '@nestjs/common';

import { Request } from 'express';
import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {

  constructor(
    private taskService: TaskService
  ) {}

  //TODO: Get a list of all tasks for the current user
  @HttpCode(200)
  @Get()
  getTasks(@Req() req: Request) {
    const user_email = req['user'].email;
    return this.taskService.getTasks(user_email);
  }

  //TODO: Create a new task
  @Post("create")
  createTask (
    @Req() req: Request, @Body() dto: TaskDto) {
      const user_email = req['user'].email;
      return this.taskService.createTasks(user_email, dto);
  }

  //TODO: Get a specific task by ID
  @Get(":id")
  getTask(@Req() req: Request, @Param() params) {
    const id = params.id;
    const user_email = req['user'].email;

    return this.taskService.getTask(user_email, id);
  }

  //TODO: Get a list of all tasks with a specific due date
  @Get("due-date/:date")
  dueDate(@Param() params) {

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
