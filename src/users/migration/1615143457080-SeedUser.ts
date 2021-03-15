import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { UserSeed } from '../seeds/user.seed';

export class SeedUser1615143457080 implements MigrationInterface {
  public async up(_: QueryRunner): Promise<any> {
    await getRepository('users').save(UserSeed);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
