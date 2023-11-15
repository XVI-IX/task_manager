import { 
  Controller, Get, Post,
  Param, Patch, Delete,
  Body, UseGuards, HttpCode, Query, UsePipes, ParseIntPipe } from '@nestjs/common';

import { TaskService } from './task.service';
import { TaskDto } from './dto/task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../decorators/user.decorator';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import * as moment from 'moment';

@ApiTags("Tasks")
@UseGuards(AuthGuard)
@Controller('tasks')
export class TaskController {

  constructor(
    private taskService: TaskService
  ) {}

  //DONE: Get a list of all tasks for the current user
  // In case there is a query parameter for due_date
  @ApiResponse({
    description: 'Get a list of all tasks for the current user',
    status: 200,
  })
  @HttpCode(200)
  @Get()
  getTasks(@User() user, @Query() query_params) {

    if (query_params.due_date) {
      const due_date = moment(query_params.due_date).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
      return this.taskService.dueDate(user.email, due_date, query_params);
    }

    return this.taskService.getTasks(user.email, query_params);
  }

  //DONE: Create a new task
  @ApiResponse({
    description: "Create a new task",
    status: 201
  })
  @Post("create")
  createTask (
    @User() user, @Body() dto: TaskDto) {
      return this.taskService.createTasks(user.email, dto);
  }

  //DONE: Get a specific task by ID
  @ApiResponse({
    description: "Create a new task",
    status: 201
  })
  @Get(":id")
  getTask(@User() user, @Param('id', ParseIntPipe) task_id: number) {
    console.log(`Task id ${typeof task_id}`);

    return this.taskService.getTask(user.email, task_id);
  }

  //DONE: Update a specific task
  @ApiResponse({
    description: "Update a specific task",
    status: 200
  })
  @Patch(":id/update")
  updateTask(@User() user, @Param('id', ParseIntPipe) id: number, @Body() dto: TaskDto) {    
    return this.taskService.updateTask(user.email, dto, id);
  }

  //DONE: Delete a specific task
  @ApiResponse({
    description: "Delete a task",
    status: 200
  })
  @Delete(":id/delete")
  deleteTask(@Param('id', ParseIntPipe) task_id: number, @User() user) {
    return this.taskService.deleteTask(user.email, task_id);
  }

  //DONE: Get a list of all tasks with a specific priority
  @ApiResponse({
    description: "Get tasks by priority level",
    status: 200
  })
  @Get("priority/:priority")
  getPriorityList(@User() user, @Param('priority', ParseIntPipe) priority: number) {
    return this.taskService.getPriorityList(user.email, priority)
  }
}
