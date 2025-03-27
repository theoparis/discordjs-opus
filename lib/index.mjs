import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';
import { arch } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = resolve(fileURLToPath(import.meta.url), '..');

/**
 * Find the node addon file based on the platform and architecture
 * @param {string} dir
 * @param {string} library
 * @returns {Promise<string>}
 */
const find = async (dir, library) => {
	let platform = process.platform;
	let architecture = arch();

	if (process.platform != 'darwin' && process.arch == 'arm64') {
		architecture = 'aarch64';
	}

	if (process.arch == 'x64') {
		architecture = 'x86_64';
	} else if (process.arch == 'ia32') {
		architecture = 'i686';
	}

	if (process.platform == 'win32') {
		platform = 'windows';
	}

	const files = await readdir(dir);
	const regex = new RegExp(`^${library}-${platform}-${architecture}.node$`);

	const addonFile = files.find((f) => regex.test(f));

	if (!addonFile) {
		throw new Error('No matching addon file found');
	}

	return resolve(dir, addonFile);
};

// eslint-disable-next-line import/no-dynamic-require
const lib = require(
	await find(resolve(__dirname, '..', 'build', 'lib'), 'node-opus'),
);

export const OpusEncoder = lib.OpusEncoder;
