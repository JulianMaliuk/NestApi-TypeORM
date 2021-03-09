import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHome(): string {
    return '<h1>NextJS API!</h1>';
  }
}
