// For TypeORM Cli
import { DataSource } from "typeorm";

import config from "src/common/config/postgres.config";

export default new DataSource(config().postgres);
