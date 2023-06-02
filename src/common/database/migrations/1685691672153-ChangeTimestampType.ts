import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTimestampType1685691672153 implements MigrationInterface {
    name = 'ChangeTimestampType1685691672153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "timestamp" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "timestamp"`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD "timestamp" TIMESTAMP NOT NULL`);
    }

}
