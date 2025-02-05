import {Injectable, HttpException, HttpStatus} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Task} from './todos.schema';

@Injectable()
export class TodosService {
    constructor(@InjectModel('Task') private taskModel: Model<Task>) {}


async createTodo(userId:string, title: string){
    const todo=new this.taskModel({title, user: userId});
    await todo.save();
    return {message:'Task created successfully', todo};
}

async getTodo(userId:string){
    const todos = await this.taskModel.find({user: userId});
    return todos;
}

async updateTodo(userId:string, taskId:string, title:string){
    const todo = await this.taskModel.findOne({_id: taskId, user: userId});
    if(!todo){
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    todo.title=title;
    await todo.save();

    return {message:'Task updated successfully', todo};
}

async deleteTask(userId:string, taskId:string){
    const todo = await this.taskModel.findOne({_id: taskId, user: userId});
    if(!todo){
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    await todo.deleteOne();
    return {message:'Task deleted successfully'};
}
}