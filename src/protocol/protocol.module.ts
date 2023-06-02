import { Module } from '@nestjs/common';
import { ProtocolController } from './protocol.controller';
import { ProtocolService } from './protocol.service';

@Module({
  controllers: [ProtocolController],
  providers: [ProtocolService]
})
export class ProtocolModule {}
