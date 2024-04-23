import { MigrationInterface, QueryRunner } from 'typeorm';

export class Feedback1713897954697 implements MigrationInterface {
  name = 'Feedback1713897954697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "feedback" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "feedback" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" ADD CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "feedback" DROP CONSTRAINT "FK_4a39e6ac0cecdf18307a365cf3c"`,
    );
    await queryRunner.query(`DROP TABLE "feedback"`);
  }
}
