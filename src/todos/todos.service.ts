import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepo: Repository<Todo>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createTodoDto: CreateTodoDto, userId: number) {
    const user = await this.userRepo.findOne(userId);
    const newTodo = this.todoRepo.create({
      ...createTodoDto,
      user,
    });
    await this.todoRepo.save(newTodo);
    return newTodo;
  }

  findAll(userId: number) {
    return this.todoRepo.find({
      where: { user: { id: userId } },
    });
  }

  async findOne(id: number, userId: number) {
    const todo = await this.todoRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!todo) {
      throw new HttpException(`Todo doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto, userId: number) {
    const todo = await this.todoRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!todo) {
      throw new HttpException(`Todo doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    await this.todoRepo.update(id, updateTodoDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    const todo = await this.todoRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!todo) {
      throw new HttpException(`Todo doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    await this.todoRepo.delete(todo.id);
    return {
      deleted: true,
    };
  }
}
