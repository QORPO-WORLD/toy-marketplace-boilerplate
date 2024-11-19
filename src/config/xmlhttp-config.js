try {
  if (typeof window === 'undefined') {
    // @ts-expect-error types for xhr2 are not valid
    const xhr2 = require('xhr2');
    global.XMLHttpRequest = xhr2.default;
  }
} catch (error) {
  console.error('XMLHttpRequest configuration failed:', error);
}
