import { Protocol } from "../../common/database/entities/protocol.entity";
import { Transaction } from "../../common/database/entities/transaction.entity";
import { Wallet } from "../../common/database/entities/wallet.entity";
import { DataSourceOptions } from "typeorm";

export default () =>
  ({
    postgres: {
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Protocol, Transaction, Wallet],
      migrations: [__dirname + "/../database/migrations/*.{js,ts}"],
      logging: process.env.NODE_ENV === "local",
    },
  } as { postgres: DataSourceOptions });
