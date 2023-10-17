import { Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';

@Controller('tasks')
export class TaskController {

  //TODO: Get a list of all tasks for the current user
  @Get()
  async getTasks() {

  }

  //TODO: Create a new task
  @Post("create")
  async createTask () {

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
