import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import postgresConfig from "@common/config/postgres.config";
import { EtherscanApiModule } from "./external-api/etherscan/etherscan-api.module";
import etherscanApiConfig from "./common/config/etherscan.api.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, etherscanApiConfig],
      envFilePath: path.join("env", `.${process.env.NODE_ENV}.env`),
      ignoreEnvFile: !(process.env.NODE_ENV === "local"),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
    TypeOrmModule.forRoot({
      ...postgresConfig().postgres,
    }),
    EtherscanApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
