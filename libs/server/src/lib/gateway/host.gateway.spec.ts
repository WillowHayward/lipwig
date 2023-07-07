import { Test, TestingModule } from '@nestjs/testing';
import { HostGateway } from './host.gateway';

describe('HostGateway', () => {
    let gateway: HostGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [HostGateway],
        }).compile();

        gateway = module.get<HostGateway>(HostGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
