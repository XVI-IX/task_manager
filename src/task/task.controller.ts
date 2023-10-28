import { 
  Controller, Get, Post,
  Param, Patch, Delete,
  Body, UseGuards, HttpCode, Query } from '@nestjs/common';

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

  //DONE: Get a list of all tasks for the current user
  // In case there is a query parameter for due_date
  @HttpCode(200)
  @Get()
  getTasks(@User() user, @Query('due_date') due_date?: string) {

    if (due_date) {
      return this.taskService.dueDate(user.email, due_date);
    }

    return this.taskService.getTasks(user.email);
  }

  //DONE: Create a new task
  @Post("create")
  createTask (
    @User() user, @Body() dto: TaskDto) {
      return this.taskService.createTasks(user.email, dto);
  }

  //DONE: Get a specific task by ID
  @Get(":id")
  getTask(@User() user, @Param('id') task_id: number) {
    console.log(`Task id ${task_id}`);

    return this.taskService.getTask(user.email, task_id);
  }

  //DONE: Update a specific task
  @Patch(":id/update")
  updateTask(@User() user, @Param('id') id, @Body() dto: TaskDto) {    
    return this.taskService.updateTask(user.email, dto, id);
  }

  //DONE: Delete a specific task
  @Delete(":id/delete")
  deleteTask(@Param('id') task_id, @User() user, dto: TaskDto) {
    return this.taskService.deleteTask(user.email, dto, task_id);
  }

  //DONE: Get a list of all tasks with a specific priority
  @Get("priority/:priority")
  getPriorityList(@User() user, @Param('priority') priority) {
    return this.taskService.getPriorityList(user.email, priority)
  }
}
