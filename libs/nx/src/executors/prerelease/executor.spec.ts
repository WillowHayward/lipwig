import { PrereleaseExecutorSchema } from './schema';
import executor from './executor';

const options: PrereleaseExecutorSchema = {};

describe('Prerelease Executor', () => {
    it('can run', async () => {
        const output = await executor(options);
        expect(output.success).toBe(true);
    });
});
