import { arch } from 'node:os';
import { getDtsBunPlugin } from './dtsPlugin';

// TODO: support building for multiple platforms
process.env.CC = 'clang';
process.env.CXX = 'clang++';
process.env.AR = 'llvm-ar';
process.env.RANLIB = 'llvm-ranlib';
process.env.LDFLAGS = '-fuse-ld=lld';
await Bun.spawn(['meson', 'setup', '--reconfigure', 'build'], {
	stdio: ['inherit', 'inherit', 'inherit'],
}).exited;
await Bun.spawn(['meson', 'compile', '-C', 'build'], {
	stdio: ['inherit', 'inherit', 'inherit'],
}).exited;

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

await Bun.build({
	entrypoints: ['./lib/index.ts'],
	root: 'lib',
	outdir: './dist',
	format: 'esm',
	minify: process.env.NODE_ENV === 'production',
	target: 'node',
	plugins: [getDtsBunPlugin()],
});

const file = Bun.file('build/node-opus.node');
await Bun.write(`dist/node-opus-${platform}-${architecture}.node`, file);
