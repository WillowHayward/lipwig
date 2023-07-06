import { SyncDepsExecutorSchema } from './schema';
import executor from './executor';

const options: SyncDepsExecutorSchema = {};

describe('SyncDeps Executor', () => {
    it('can run', async () => {
        const output = await executor(options);
        expect(output.success).toBe(true);
    });
});
