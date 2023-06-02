import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeTable1685719722511 implements MigrationInterface {
    name = 'InitializeTable1685719722511'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "walletAddress" character varying NOT NULL, "transactionNum" integer NOT NULL, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "walletId" integer NOT NULL, "protocolId" integer NOT NULL, "timestamp" integer NOT NULL, "eventName" character varying NOT NULL, "totalValue" integer NOT NULL, "coinValue" integer NOT NULL, "tokenValue" integer NOT NULL, "hash" character varying NOT NULL, "blockNumber" integer NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "protocol" ("id" SERIAL NOT NULL, "protocolAddress" character varying NOT NULL, "protocolName" character varying NOT NULL, "protocolType" character varying NOT NULL, CONSTRAINT "PK_bae34901abddccbddda15ea000c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_20aecaef95140a727ea90ec0f9f" FOREIGN KEY ("protocolId") REFERENCES "protocol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_20aecaef95140a727ea90ec0f9f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`);
        await queryRunner.query(`DROP TABLE "protocol"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
    }

}
