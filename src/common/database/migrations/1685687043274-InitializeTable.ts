import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeTable1685687043274 implements MigrationInterface {
    name = 'InitializeTable1685687043274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "protocol" ("id" SERIAL NOT NULL, "protocolAddress" character varying NOT NULL, "protocolName" character varying NOT NULL, "protocolType" character varying NOT NULL, CONSTRAINT "PK_bae34901abddccbddda15ea000c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "walletId" integer NOT NULL, "protocolId" integer NOT NULL, "timestamp" TIMESTAMP NOT NULL, "eventName" character varying NOT NULL, "totalValue" integer NOT NULL, "coinValue" integer NOT NULL, "tokenValue" integer NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "walletAddress" character varying NOT NULL, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."asset_assettype_enum" AS ENUM('FT', 'NFT')`);
        await queryRunner.query(`CREATE TABLE "asset" ("id" SERIAL NOT NULL, "assetType" "public"."asset_assettype_enum" NOT NULL, "price" double precision NOT NULL, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset_wallets_wallet" ("assetId" integer NOT NULL, "walletId" integer NOT NULL, CONSTRAINT "PK_70c19e5d66e2a6076940e2a1591" PRIMARY KEY ("assetId", "walletId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_14d40dfdaa727f84d0abe52e15" ON "asset_wallets_wallet" ("assetId") `);
        await queryRunner.query(`CREATE INDEX "IDX_77a2324efd68e99b867cbc6f43" ON "asset_wallets_wallet" ("walletId") `);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_20aecaef95140a727ea90ec0f9f" FOREIGN KEY ("protocolId") REFERENCES "protocol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset_wallets_wallet" ADD CONSTRAINT "FK_14d40dfdaa727f84d0abe52e15f" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "asset_wallets_wallet" ADD CONSTRAINT "FK_77a2324efd68e99b867cbc6f437" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asset_wallets_wallet" DROP CONSTRAINT "FK_77a2324efd68e99b867cbc6f437"`);
        await queryRunner.query(`ALTER TABLE "asset_wallets_wallet" DROP CONSTRAINT "FK_14d40dfdaa727f84d0abe52e15f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_20aecaef95140a727ea90ec0f9f"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_900eb6b5efaecf57343e4c0e79d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77a2324efd68e99b867cbc6f43"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_14d40dfdaa727f84d0abe52e15"`);
        await queryRunner.query(`DROP TABLE "asset_wallets_wallet"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP TYPE "public"."asset_assettype_enum"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TABLE "protocol"`);
    }

}
