// `pnpm content:edit` (ADR-0034): the site in development with edit mode on. Starts the edit server, then
// `next dev` with EDIT_MODE set, which makes the root layout load the overlay. Extra arguments go
// to `next dev`, e.g. `pnpm content:edit --port 3001`.
import { spawn } from 'node:child_process';
import { startEditServer } from './edit/server.ts';

const editServer = await startEditServer(Number(process.env.EDIT_PORT ?? 4310));
console.log(`edit mode: edit server on ${editServer.origin}; switch editing on with the "Edit text" button or Alt + E`);

const next = spawn('next', ['dev', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, EDIT_MODE: '1', EDIT_SERVER: editServer.origin },
});

const stop = () => next.kill('SIGINT');
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
next.on('exit', (code) => {
  editServer.close();
  process.exit(code ?? 0);
});
