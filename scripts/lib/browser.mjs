import { existsSync } from 'node:fs';

const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export function installedChrome() {
  return existsSync(macChrome) ? macChrome : undefined;
}
