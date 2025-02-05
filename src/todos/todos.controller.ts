import {Controller, Post, Body, Get, Param, Put, Delete, UseGuards} from '@nestjs/common';
import {TodosService} from './todos.service';


@Controller('todos')
export class TodosController {
    constructor(private todosService: TodosService) {}

    
    @Post()
    async createTodo(
        @Body('title') title: string,
        @Body('userId') userId: string,
    ){
        return this.todosService.createTodo(userId, title);
    }

    @Get()
    async getTodo(
        @Body('userId') userId: string,
    ){
        return this.todosService.getTodo(userId);
    }

    @Put(':taskId')
    async updateTodo(
    @Param('taskId') taskId: string,
    @Body('title') title:string,
    @Body('userId') userId: string,
    ){
        return this.todosService.updateTodo(userId, taskId, title);
    }

    @Delete(':taskId')
    async deleteTodo(
        @Param('taskId') taskId: string,
        @Body('userId') userId: string,
    ){
        return this.todosService.deleteTask(userId, taskId);
    }
}


    

    


