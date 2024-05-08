import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFirstlogin1715198703831 implements MigrationInterface {
  name = 'AddFirstlogin1715198703831';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback" DROP CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "first_login" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" ADD CONSTRAINT "FK_121c67d42dd543cca0809f59901" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback" DROP CONSTRAINT "FK_121c67d42dd543cca0809f59901"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "first_login"`);
    await queryRunner.query(
      `ALTER TABLE "feedback" ADD CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
