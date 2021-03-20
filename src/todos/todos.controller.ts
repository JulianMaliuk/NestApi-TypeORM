import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('todos')
@ApiTags('Todos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create Todo' })
  create(@Req() req, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Todos' })
  findAll(@Req() req) {
    return this.todosService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Todo By ID' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.todosService.findOne(+id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Todo By ID' })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(+id, updateTodoDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Todo By ID' })
  remove(@Req() req, @Param('id') id: string) {
    return this.todosService.remove(+id, req.user.id);
  }
}
