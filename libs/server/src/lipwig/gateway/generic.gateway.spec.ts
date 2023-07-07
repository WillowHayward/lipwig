import { Test, TestingModule } from '@nestjs/testing';
import { GenericGateway } from './generic.gateway';

describe('GenericGateway', () => {
    let gateway: GenericGateway;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GenericGateway],
        }).compile();

        gateway = module.get<GenericGateway>(GenericGateway);
    });

    it('should be defined', () => {
        expect(gateway).toBeDefined();
    });
});
