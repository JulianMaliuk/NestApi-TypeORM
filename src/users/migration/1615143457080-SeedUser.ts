import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entities/user.entity';

export class SeedUser1615143457080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const repository = queryRunner.connection.getRepository(User);
    const user = repository.create({
      id: '02fde46e-e632-432e-b5b6-dc4f39fd2566',
      name: 'Julian',
      username: 'julian.maljuk@gmail.com',
      password: '1111',
      roles: ['user', 'admin'],
      isActive: true,
    });
    await repository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const repository = queryRunner.connection.getRepository(User);
    await repository.delete({
      id: '02fde46e-e632-432e-b5b6-dc4f39fd2566',
    });
  }
}
