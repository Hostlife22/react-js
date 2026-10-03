import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { stripVTControlCharacters } from 'node:util';
import { chromium } from 'playwright';
import { installedChrome } from './browser.mjs';

async function waitForServer(server, url, getOutput, getFailure) {
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    if (getFailure()) throw getFailure();
    if (server.exitCode !== null) throw new Error(`Preview exited: ${getOutput()}`);
    // Only probe after our Vite process announces its URL; another process may own the port.
    if (stripVTControlCharacters(getOutput()).includes(url)) {
      try {
        if ((await fetch(url, { signal: AbortSignal.timeout(500) })).ok) return;
      } catch {
        // Vite may still be starting.
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Preview did not start at ${url}: ${getOutput()}`);
}

/** Own the server and browser, including cleanup when startup or a check fails. */
export async function withPreview({ port, production = false }, check) {
  await mkdir('out/checks', { recursive: true });
  const server = spawn(
    process.execPath,
    [
      'node_modules/vite/bin/vite.js',
      ...(production ? ['preview'] : []),
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );
  let output = '';
  let failure;
  const closed = new Promise((resolve) => server.once('close', resolve));
  server.on('error', (error) => {
    failure = error;
  });
  server.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });
  const url = `http://127.0.0.1:${port}${production ? '/cat-through-time/' : ''}`;
  let browser;
  try {
    await waitForServer(
      server,
      url,
      () => output,
      () => failure,
    );
    browser = await chromium.launch({ headless: true, executablePath: installedChrome() });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
    await check({ page, url });
  } finally {
    try {
      await browser?.close();
    } finally {
      if (server.exitCode === null) server.kill('SIGTERM');
      const timeout = setTimeout(() => server.kill('SIGKILL'), 5000);
      try {
        await closed;
      } finally {
        clearTimeout(timeout);
      }
    }
  }
}
