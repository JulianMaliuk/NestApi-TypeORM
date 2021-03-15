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
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notes')
@ApiTags('Notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Note' })
  create(@Req() req, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get All Notes' })
  findAll(@Req() req) {
    return this.notesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Notes By ID' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.notesService.findOne(+id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Note By ID' })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.notesService.update(+id, updateNoteDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Note By ID' })
  remove(@Req() req, @Param('id') id: string) {
    return this.notesService.remove(+id, req.user.id);
  }
}
