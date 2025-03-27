import * as childProcess from 'node:child_process';

const exec = (command) =>
	new Promise((resolve, reject) => {
		const child = childProcess.exec(command, (error) => {
			if (error) {
				reject(error);
			} else {
				resolve();
			}
		});

		child.stdout.pipe(process.stdout);
		child.stderr.pipe(process.stderr);
	});

const buildType = process.env.CMAKE_BUILD_TYPE ?? 'RelWithDebInfo';
const buildDir = process.env.BUILD_DIR ?? 'build';
let buildFlags = [
	'-DBUILD_SHARED_LIBS=OFF',
	'-GNinja',
	`-DCMAKE_BUILD_TYPE=${buildType}`,
];

if (process.platform === 'win32') {
	// Github actions uses mingw which breaks the build due to undefined symbols
	buildFlags.push('-DCMAKE_CXX_COMPILER=clang');
	buildFlags.push('-DCMAKE_C_COMPILER=clang');
}

await exec(`cmake -S . -B ${buildDir} ${buildFlags.join(' ')}`);
await exec(`cmake --build build`);
