/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

try {
  if (typeof window === 'undefined') {
    // @ts-expect-error types for xhr2 are not valid
    const xhr2 = require('xhr2');
    global.XMLHttpRequest = xhr2.default;
  }
} catch (error) {
  console.error('XMLHttpRequest configuration failed:', error);
}
