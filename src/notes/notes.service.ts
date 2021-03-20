import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly noteRepo: Repository<Note>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(createNoteDto: CreateNoteDto, userId: number) {
    const user = await this.userRepo.findOne(userId);
    const newNote = this.noteRepo.create({
      ...createNoteDto,
      user,
    });
    await this.noteRepo.save(newNote);
    return newNote;
  }

  findAll(userId: number) {
    return this.noteRepo.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number) {
    const note = await this.noteRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!note) {
      throw new HttpException(`Note doesn't exist`, HttpStatus.BAD_REQUEST);
    }

    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const note = await this.noteRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!note) {
      throw new HttpException(`Note doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    await this.noteRepo.update(id, updateNoteDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number) {
    const note = await this.noteRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!note) {
      throw new HttpException(`Note doesn't exist`, HttpStatus.BAD_REQUEST);
    }
    await this.noteRepo.delete(note.id);
    return {
      deleted: true,
    };
  }
}
