import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1750243213082 implements MigrationInterface {
    name = 'InitMigration1750243213082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "software" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "version" character varying(50), "licenseKey" character varying(255), "licensedTo" character varying(100), "adminLogin" character varying(50), "adminPassword" character varying(50), "networkAddress" character varying(100), "floor" character varying(10), "cabinet" character varying(10), "purchaseDate" TIMESTAMP, "supportStart" TIMESTAMP, "supportEnd" TIMESTAMP, "expiryDate" TIMESTAMP, "fileUrls" text array NOT NULL DEFAULT '{}', "installDate" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3ceec82cc90b32643b07e8d9841" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" SERIAL NOT NULL, "inventoryNumber" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "type" character varying(50) NOT NULL, "macAddress" character varying(50), "ipAddress" character varying(50), "login" character varying(50), "password" character varying(50), "location" character varying(50) NOT NULL, "floor" character varying(10), "cabinet" character varying(10), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fileUrls" text array NOT NULL DEFAULT '{}', "assignedToUserId" integer, "assignedToId" integer, CONSTRAINT "UQ_247daa5716d57e3d6e92cfc4ed2" UNIQUE ("inventoryNumber"), CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "requestId" integer NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3edd3cdb7232a3e9220607eabb" ON "comment" ("createdAt") `);
        await queryRunner.query(`CREATE TYPE "public"."request_status_enum" AS ENUM('NEW', 'IN_PROGRESS', 'DONE', 'REJECTED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TYPE "public"."request_priority_enum" AS ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT')`);
        await queryRunner.query(`CREATE TYPE "public"."request_source_enum" AS ENUM('WEB', 'TELEGRAM', 'PHONE')`);
        await queryRunner.query(`CREATE TABLE "request" ("id" SERIAL NOT NULL, "title" character varying(100) NOT NULL, "content" text NOT NULL, "status" "public"."request_status_enum" NOT NULL DEFAULT 'NEW', "priority" "public"."request_priority_enum" NOT NULL DEFAULT 'NORMAL', "category" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expectedResolutionDate" TIMESTAMP, "resolvedAt" TIMESTAMP, "assignedAt" TIMESTAMP, "workDuration" integer, "source" "public"."request_source_enum" DEFAULT 'WEB', "userId" integer NOT NULL, "executorId" integer, "rating" integer, "feedback" text, "fileUrls" text array NOT NULL DEFAULT '{}', CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."notification_role_enum" AS ENUM('user', 'admin', 'superuser')`);
        await queryRunner.query(`CREATE TYPE "public"."notification_department_enum" AS ENUM('AHO', 'ADMIN', 'STATIONAR', 'GYN', 'INFECT', 'GP', 'OPHTHALMO', 'ENT', 'NURSE', 'EMERGENCY', 'UZI', 'STATISTICS', 'DIABET_SCHOOL', 'ENDOSCOPY', 'LAB', 'VOENKOM', 'ELDERLY', 'PREVENTION', 'PAID', 'FUNCTIONAL', 'VACCINATION', 'PROCEDURE', 'REGISTRY', 'XRAY', 'THERAPY_1', 'THERAPY_2', 'THERAPY_3', 'THERAPY_4', 'THERAPY_5', 'PHYSIOTHERAPY', 'SURGERY', 'STERILIZATION', 'HEALTH_CENTER')`);
        await queryRunner.query(`CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" integer, "role" "public"."notification_role_enum", "department" "public"."notification_department_enum", "title" character varying NOT NULL, "message" text NOT NULL, "type" character varying NOT NULL, "url" character varying, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin', 'superuser')`);
        await queryRunner.query(`CREATE TYPE "public"."user_department_enum" AS ENUM('AHO', 'ADMIN', 'STATIONAR', 'GYN', 'INFECT', 'GP', 'OPHTHALMO', 'ENT', 'NURSE', 'EMERGENCY', 'UZI', 'STATISTICS', 'DIABET_SCHOOL', 'ENDOSCOPY', 'LAB', 'VOENKOM', 'ELDERLY', 'PREVENTION', 'PAID', 'FUNCTIONAL', 'VACCINATION', 'PROCEDURE', 'REGISTRY', 'XRAY', 'THERAPY_1', 'THERAPY_2', 'THERAPY_3', 'THERAPY_4', 'THERAPY_5', 'PHYSIOTHERAPY', 'SURGERY', 'STERILIZATION', 'HEALTH_CENTER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "lastName" character varying(100) NOT NULL, "firstName" character varying(100) NOT NULL, "middleName" character varying(100), "passwordHash" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "birthDate" date NOT NULL, "snils" character varying(20) NOT NULL, "mobilePhone" character varying(20) NOT NULL, "internalPhone" character varying(10) NOT NULL, "position" character varying(100) NOT NULL, "department" "public"."user_department_enum" NOT NULL, "floor" character varying(10), "cabinet" character varying(10), "telegramUserId" bigint, CONSTRAINT "UQ_0a68b019162c0cdb2f25a01b41b" UNIQUE ("snils"), CONSTRAINT "UQ_01729d9465105fe07244458a523" UNIQUE ("telegramUserId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipment_software_software" ("equipmentId" integer NOT NULL, "softwareId" integer NOT NULL, CONSTRAINT "PK_9bd497ca929e36759ff9aa2ea66" PRIMARY KEY ("equipmentId", "softwareId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_741d75f957142e4405033fa72f" ON "equipment_software_software" ("equipmentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_179b0e277bd080321be82ef7de" ON "equipment_software_software" ("softwareId") `);
        await queryRunner.query(`CREATE TABLE "user_assigned_equipment_equipment" ("userId" integer NOT NULL, "equipmentId" integer NOT NULL, CONSTRAINT "PK_89a299c2508c25fb6f4a4509177" PRIMARY KEY ("userId", "equipmentId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_290f0ba27eddc5f970b92fa631" ON "user_assigned_equipment_equipment" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2817a8dac009a44cb07fecfeb6" ON "user_assigned_equipment_equipment" ("equipmentId") `);
        await queryRunner.query(`ALTER TABLE "equipment" ADD CONSTRAINT "FK_2dd0fb6fe8babdd15b58352f243" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_66c955fd4ac8c4ecb158817ef6f" FOREIGN KEY ("requestId") REFERENCES "request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_38554ade327a061ba620eee948b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_638944a0021e46cf5f9b3b762c5" FOREIGN KEY ("executorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "equipment_software_software" ADD CONSTRAINT "FK_741d75f957142e4405033fa72fc" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "equipment_software_software" ADD CONSTRAINT "FK_179b0e277bd080321be82ef7dea" FOREIGN KEY ("softwareId") REFERENCES "software"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_assigned_equipment_equipment" ADD CONSTRAINT "FK_290f0ba27eddc5f970b92fa6313" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_assigned_equipment_equipment" ADD CONSTRAINT "FK_2817a8dac009a44cb07fecfeb69" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_assigned_equipment_equipment" DROP CONSTRAINT "FK_2817a8dac009a44cb07fecfeb69"`);
        await queryRunner.query(`ALTER TABLE "user_assigned_equipment_equipment" DROP CONSTRAINT "FK_290f0ba27eddc5f970b92fa6313"`);
        await queryRunner.query(`ALTER TABLE "equipment_software_software" DROP CONSTRAINT "FK_179b0e277bd080321be82ef7dea"`);
        await queryRunner.query(`ALTER TABLE "equipment_software_software" DROP CONSTRAINT "FK_741d75f957142e4405033fa72fc"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_638944a0021e46cf5f9b3b762c5"`);
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_38554ade327a061ba620eee948b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_66c955fd4ac8c4ecb158817ef6f"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "equipment" DROP CONSTRAINT "FK_2dd0fb6fe8babdd15b58352f243"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2817a8dac009a44cb07fecfeb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_290f0ba27eddc5f970b92fa631"`);
        await queryRunner.query(`DROP TABLE "user_assigned_equipment_equipment"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_179b0e277bd080321be82ef7de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_741d75f957142e4405033fa72f"`);
        await queryRunner.query(`DROP TABLE "equipment_software_software"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_department_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TYPE "public"."notification_department_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_role_enum"`);
        await queryRunner.query(`DROP TABLE "request"`);
        await queryRunner.query(`DROP TYPE "public"."request_source_enum"`);
        await queryRunner.query(`DROP TYPE "public"."request_priority_enum"`);
        await queryRunner.query(`DROP TYPE "public"."request_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3edd3cdb7232a3e9220607eabb"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`DROP TABLE "software"`);
    }

}
