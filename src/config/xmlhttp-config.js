/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

if (typeof window === 'undefined') {
  // @ts-expect-error types for xhr2 are not valid
  import('xhr2').then((xhr2) => {
    global.XMLHttpRequest = xhr2.default;
  }).catch((err) => {
    console.error(err);
  })
}
