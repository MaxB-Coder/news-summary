import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});
// jsdom doesn't scroll (and node-environment tests have no window)
if (typeof window !== 'undefined') window.scrollTo = () => {};
