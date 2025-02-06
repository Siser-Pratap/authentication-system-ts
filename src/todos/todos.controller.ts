import {Controller, Post, Body, Get, Param, Put, Delete, UseGuards} from '@nestjs/common';
import {TodosService} from './todos.service';
import { AuthMiddleware } from 'src/auth/auth.middleware';
import { UserService } from 'src/user/user.service';



@Controller('todos')
@UseGuards(AuthMiddleware)
export class TodosController {
    constructor(private todosService: TodosService,
        private UserService: UserService
    ) {}

    
    @Post('create')
    async createTodo(
        @Body('title') title: string,
        @Body('userId') userId: string,
    ){
        const user = await this.UserService.findUserById(userId);
        if(!user?.permissions.includes('create')){
            return {message: 'You do not have permission to create a task'};
        }
        else{
            return this.todosService.createTodo(userId, title);
        }
    }

    @Get()
    async getTodo(
        @Body('userId') userId: string,
    ){
        const user = await this.UserService.findUserById(userId);
        if(!user?.permissions.includes('read')){
            return {message:'You do not have permission to read'}
        }
        else{
        return this.todosService.getTodo(userId);
        }
    }

    @Put(':taskId')
    async updateTodo(
    @Param('taskId') taskId: string,
    @Body('title') title:string,
    @Body('userId') userId: string,
    ){
        const user = await this.UserService.findUserById(userId);
        if(!user?.permissions.includes('update')){
            return {message:'You do not have permission to update'}
        }
        else{
            return this.todosService.updateTodo(userId, taskId, title);
        }
    }

    @Delete(':taskId')
    async deleteTodo(
        @Param('taskId') taskId: string,
        @Body('userId') userId: string,
    ){
        const user = await this.UserService.findUserById(userId);
        if(!user?.permissions.includes('delete')){
            return {message:'You do not have permission to delete'}
        }
        else{
            return this.todosService.deleteTask(userId, taskId);
        }
    }
}
