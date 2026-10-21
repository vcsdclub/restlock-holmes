import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const executable =
	process.env.SECURE_BUN ||
	fileURLToPath(
		new URL(`../.tools/bun/${process.platform === 'win32' ? 'bun.exe' : 'bun'}`, import.meta.url)
	);
const revision = execFileSync(executable, ['--revision'], { encoding: 'utf8' }).trim();
if (revision !== '1.4.4-canary.1+963452075') {
	throw new Error(`Unverified Bun revision: ${revision}. Run scripts/install-secure-bun.mjs.`);
}
execFileSync(executable, process.argv.slice(2), { stdio: 'inherit' });
