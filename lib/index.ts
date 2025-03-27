import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';
import { arch } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { OpusEncoder as OpusEncoderType } from '../typings';

const require = createRequire(import.meta.url);
const __dirname = resolve(fileURLToPath(import.meta.url), '..');

const find = async (dir: string, library: string): Promise<string> => {
	let platform: string = process.platform;
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
const lib = require(await find(resolve(__dirname, '..', 'dist'), 'node-opus'));

export const OpusEncoder: typeof OpusEncoderType = lib.OpusEncoder;
