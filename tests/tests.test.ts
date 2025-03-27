import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { OpusEncoder } from '../lib';
import { fileURLToPath } from 'node:url';
import { test } from 'bun:test';

test('decode', () => {
	const __dirname = join(fileURLToPath(import.meta.url), '..');

	const opus = new OpusEncoder(16_000, 1);

	const frame = readFileSync(join(__dirname, 'frame.opus'));

	const decoded = opus.decode(frame);

	assert(decoded.length === 640, 'Decoded frame length is not 640');
});
