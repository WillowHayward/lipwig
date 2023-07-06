import { join } from 'path';
import { SyncDepsExecutorSchema } from './schema';
import { ExecutorContext} from '@nx/devkit';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';

export default async function runExecutor(options: SyncDepsExecutorSchema, context: ExecutorContext) {
    if (!context.projectName) {
        throw new Error('No project');
    }
    const config = context.projectsConfigurations.projects[context.projectName];
    const root = join(context.root, config.root);
    const path = `${root}/package.json`;

    if (!existsSync(path)) {
        throw new Error(`No package.json at ${path}`);
    }

    const jsonRaw = readFileSync(path, { encoding: 'utf8' });
    const json = JSON.parse(jsonRaw);

    const version = json.version;

    for (const dependency of options.dependencies) {
        json.dependencies[dependency] = version;
    }

    writeFileSync(path, JSON.stringify(json, null, 4), { encoding: 'utf8' });

    // Get tag
    const tag = spawnSync('git', ['tag', '--points-at', 'HEAD'], { encoding: 'utf8' }).stdout.split('\n').shift();
    console.log('TAG', tag);


    spawnSync('git', ['commit', '-a', '--amend', '--no-edit']);

    spawnSync('git', ['tag', '-d', tag]);
    spawnSync('git', ['tag', '-a', tag, '-m', `"Release ${tag}"`]);

    return {
        success: true,
    };
}
