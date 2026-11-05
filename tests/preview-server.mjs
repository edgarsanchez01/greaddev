import { error as logError } from 'node:console';
import process from 'node:process';
import { preview } from 'astro';

// Own the HTTP server in this process: the CLI launcher can detach in this harness.
// Astro's programmatic preview API is pinned and exercised by the E2E suite.
const server = await preview({
  server: { host: '127.0.0.1', port: 4321 },
  logLevel: 'silent',
});

let stopping = false;
async function shutdown() {
  if (stopping) return;
  stopping = true;
  try {
    await server.stop();
    process.exitCode = 0;
  } catch (error) {
    logError(error);
    process.exitCode = 1;
  }
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
