import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransactionNum1685688827035 implements MigrationInterface {
    name = 'AddTransactionNum1685688827035'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" ADD "transactionNum" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP COLUMN "transactionNum"`);
    }

}
