import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), UsersModule],
  controllers: [TodosController],
  providers: [TodosService],
  exports: [TodosService, TypeOrmModule],
})
export class TodosModule {}
