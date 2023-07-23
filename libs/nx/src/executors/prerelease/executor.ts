import { spawnSync } from 'child_process';
import { PrereleaseExecutorSchema } from './schema';
import { readFileSync } from 'fs';

interface Version {
    major: number;
    minor: number;
    patch: number;
}

export default async function runExecutor(options: PrereleaseExecutorSchema) {
    const currentVersion = getCurrentVersion();
    const nextVersion = getNextVersion();

    const releaseType = getReleaseType(currentVersion, nextVersion);

    spawnSync('nx', ['run', 'workspace:release', `--releaseAs=${releaseType}`, `--preid=next`], { encoding: 'utf8' });

    return {
        success: true,
    };
}

function getCurrentVersion(): Version {
    const packageJson = JSON.parse(readFileSync('./package.json', { encoding: 'utf8' }));
    const packageVersion = packageJson.version;
    if (packageVersion.includes('-')) {
        // TODO - Already a prerelease. Parseint should handle it fine?
    }
    const versionParts = packageJson.version.split('.');

    const version: Version = {
        major: Number.parseInt(versionParts[0]),
        minor: Number.parseInt(versionParts[1]),
        patch: Number.parseInt(versionParts[2]),
    }

    return version;
}

function getNextVersion(): Version {
    const dryRun = spawnSync('nx', ['run', 'workspace:release', '--dryRun'], { encoding: 'utf8' }).stdout;
    const newVersion = dryRun.match(/Calculated new version "(?<major>[0-9]+)\.(?<minor>[0-9]+)\.(?<patch>[0-9]+)"/);

    if (!newVersion.groups) {
        throw new Error('Could not parse new version');
    }

    const version: Version = {
        major: Number.parseInt(newVersion.groups['major']),
        minor: Number.parseInt(newVersion.groups['minor']),
        patch: Number.parseInt(newVersion.groups['patch']),
    }

    return version;
}

function getReleaseType(current: Version, next: Version): 'premajor' | 'preminor' | 'prepatch' | 'prerelease' {
    if (next.major > current.major) {
        return 'premajor';
    }

    if (next.minor > current.minor) {
        return 'preminor';
    }

    if (next.patch > current.patch) {
        return 'prepatch';
    }

    return 'prerelease';
}
