import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSoftwareJoinTable1750243214000 implements MigrationInterface {
  name = 'UserSoftwareJoinTable1750243214000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_software_software" ("userId" integer NOT NULL, "softwareId" integer NOT NULL, CONSTRAINT "PK_b94b053d52bbd1f7fab9d0f7dbe" PRIMARY KEY ("userId", "softwareId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_software_user" ON "user_software_software" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_software_software" ON "user_software_software" ("softwareId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_software_software" ADD CONSTRAINT "FK_user_software_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_software_software" ADD CONSTRAINT "FK_user_software_software" FOREIGN KEY ("softwareId") REFERENCES "software"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_software_software" DROP CONSTRAINT "FK_user_software_software"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_software_software" DROP CONSTRAINT "FK_user_software_user"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_user_software_software"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_software_user"`);
    await queryRunner.query(`DROP TABLE "user_software_software"`);
  }
}
