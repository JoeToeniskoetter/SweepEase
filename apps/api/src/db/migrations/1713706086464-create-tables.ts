import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1713706086464 implements MigrationInterface {
  name = 'CreateTables1713706086464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_invite" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "verification_code" character varying NOT NULL, "user_email" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" uuid, "created_by" character varying, CONSTRAINT "PK_8108c55aa759aab27050cc06607" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip" character varying NOT NULL, "phone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, CONSTRAINT "REL_02d6084f6eb9912c0d8a35f9d0" UNIQUE ("created_by"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" character varying NOT NULL, "email" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inspection_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "inspection_level" character varying NOT NULL, "signatures_required" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" uuid, "created_by" character varying, CONSTRAINT "PK_07401ab9b3147656ad950dbd216" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inspection_template_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "position" integer NOT NULL, "template_id" uuid, CONSTRAINT "PK_4eb72d87b4441805eddae37b5a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inspection_template_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "item_id" uuid, CONSTRAINT "PK_8fa8dd42651c9050f1d94cd4bac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inspection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "customer_name" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "zip" character varying NOT NULL, "phone" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "company_id" uuid, "template_id" uuid, "created_by" character varying, CONSTRAINT "PK_1e895c2ae7b7d9d1ec464950013" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inspection_signature" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "image_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "inspection_id" uuid, CONSTRAINT "PK_ea9fea571efa29fc2597b5dc179" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inspection_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item" character varying NOT NULL, "position" integer NOT NULL, "options" jsonb NOT NULL, "condition" jsonb, "notes" character varying NOT NULL, "photo_url" character varying NOT NULL, "is_complete" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "inspection_id" uuid, "started_by" character varying, CONSTRAINT "PK_af05d90f8c0eb7f3b37001614a5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inspection_temaplate_section" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_f971a1b2980c98f88b5c546d7e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invite" ADD CONSTRAINT "FK_18be23983ef214bb27a5592deba" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invite" ADD CONSTRAINT "FK_788702574450311477075416cbb" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" ADD CONSTRAINT "FK_02d6084f6eb9912c0d8a35f9d0d" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_9e70b5f9d7095018e86970c7874" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template" ADD CONSTRAINT "FK_ab7816eb19afac73563ede699b7" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template" ADD CONSTRAINT "FK_1ce7a78aa4e6d4dbaf0c314903c" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template_item" ADD CONSTRAINT "FK_7afce88c2999c4458911d2ee645" FOREIGN KEY ("template_id") REFERENCES "inspection_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template_options" ADD CONSTRAINT "FK_078782b3c39099ea462333e184c" FOREIGN KEY ("item_id") REFERENCES "inspection_template_item"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection" ADD CONSTRAINT "FK_dd9ae4c4ecb801be60b991f77b7" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection" ADD CONSTRAINT "FK_07401ab9b3147656ad950dbd216" FOREIGN KEY ("template_id") REFERENCES "inspection_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection" ADD CONSTRAINT "FK_9d63db06f620b9135bf23ee2cb8" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_signature" ADD CONSTRAINT "FK_d9d9b0338edf4d5c68037d3b394" FOREIGN KEY ("inspection_id") REFERENCES "inspection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_detail" ADD CONSTRAINT "FK_b670ceb51e9b98ef2addd2e7798" FOREIGN KEY ("inspection_id") REFERENCES "inspection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_detail" ADD CONSTRAINT "FK_3b80356c270d6184b1040ff2ba4" FOREIGN KEY ("started_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "inspection_detail" DROP CONSTRAINT "FK_3b80356c270d6184b1040ff2ba4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_detail" DROP CONSTRAINT "FK_b670ceb51e9b98ef2addd2e7798"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_signature" DROP CONSTRAINT "FK_d9d9b0338edf4d5c68037d3b394"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection" DROP CONSTRAINT "FK_9d63db06f620b9135bf23ee2cb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection" DROP CONSTRAINT "FK_07401ab9b3147656ad950dbd216"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection" DROP CONSTRAINT "FK_dd9ae4c4ecb801be60b991f77b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template_options" DROP CONSTRAINT "FK_078782b3c39099ea462333e184c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template_item" DROP CONSTRAINT "FK_7afce88c2999c4458911d2ee645"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template" DROP CONSTRAINT "FK_1ce7a78aa4e6d4dbaf0c314903c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inspection_template" DROP CONSTRAINT "FK_ab7816eb19afac73563ede699b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_9e70b5f9d7095018e86970c7874"`,
    );
    await queryRunner.query(
      `ALTER TABLE "company" DROP CONSTRAINT "FK_02d6084f6eb9912c0d8a35f9d0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invite" DROP CONSTRAINT "FK_788702574450311477075416cbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_invite" DROP CONSTRAINT "FK_18be23983ef214bb27a5592deba"`,
    );
    await queryRunner.query(`DROP TABLE "inspection_temaplate_section"`);
    await queryRunner.query(`DROP TABLE "inspection_detail"`);
    await queryRunner.query(`DROP TABLE "inspection_signature"`);
    await queryRunner.query(`DROP TABLE "inspection"`);
    await queryRunner.query(`DROP TABLE "inspection_template_options"`);
    await queryRunner.query(`DROP TABLE "inspection_template_item"`);
    await queryRunner.query(`DROP TABLE "inspection_template"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "user_invite"`);
  }
}
