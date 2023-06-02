import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolService } from './protocol.service';

describe('ProtocolService', () => {
  let service: ProtocolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtocolService],
    }).compile();

    service = module.get<ProtocolService>(ProtocolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
