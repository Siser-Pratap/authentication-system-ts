import { Module, MiddlewareConsumer, RequestMethod  } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {TodosController} from "./todos.controller";
import {Task, TaskSchema} from "./todos.schema";
import {TodosService} from "./todos.service";
import { UserModule } from '../user/user.module';
import { AuthMiddleware } from 'src/auth/auth.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),  // Register the Task schema with Mongoose
    UserModule,  // Import the User module so we can relate tasks to users
  ],
  controllers: [TodosController],  // Register the TaskController for handling task-related routes
  providers: [TodosService],  // Register the TaskService to handle task-related logic
})
export class TodosModule {
  configure(consumer:MiddlewareConsumer){
    consumer
            .apply(AuthMiddleware)
            .forRoutes(
              {
                path:'todos',
                method:RequestMethod.POST,
              },
              {
                path:'todos/:id',
                method:RequestMethod.PUT,
              },
              {
                path:'todos/:id',
                method:RequestMethod.DELETE,
              }
            );
  }

}
