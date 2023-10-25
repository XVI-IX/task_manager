import { 
  Controller, Get, Post,
  Param, Patch, Delete,
  Req, Body, UseGuards, HttpCode, Query } from '@nestjs/common';

import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {

  constructor(
    private taskService: TaskService
  ) {}

  //TODO: Get a list of all tasks for the current user
  @HttpCode(200)
  @Get()
  getTasks(@User() user) {
    return this.taskService.getTasks(user.email);
  }

  //TODO: Create a new task
  @Post("create")
  createTask (
    @User() user, @Body() dto: TaskDto) {
      return this.taskService.createTasks(user.email, dto);
  }

  //TODO: Get a specific task by ID
  @Get(":id")
  getTask(@User() user, @Param() params) {
    const id = params.id;

    return this.taskService.getTask(user.email, id);
  }

  //TODO: Get a list of all tasks with a specific due date
  @Get("due-date")
  dueDate(@User() user, @Query() query) {
    const due_date = query.due_date;

    return this.taskService.dueDate(user.email, due_date)
  }

  //TODO: Update a specific task
  @Patch(":id/update")
  updateTask(@User() user, @Param('id') id, @Body() dto: TaskDto) {    
    return this.taskService.updateTask(user.email, dto, id);
  }

  //TODO: Delete a specific task
  @Delete(":id/delete")
  deleteTask(@Param('id') task_id, @User() user, dto: TaskDto) {
    return this.taskService.deleteTask(user.email, dto, task_id);
  }

  //TODO: Get a list of all tasks with a specific priority
  @Get("priority/:priority")
  getPriorityList(@User() user, @Param('priority') priority) {
    return this.taskService.getPriorityList(user.email, priority)
  }
}
