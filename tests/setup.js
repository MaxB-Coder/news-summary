import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
// jsdom doesn't scroll (and node-environment tests have no window)
if (typeof window !== 'undefined') window.scrollTo = () => {};
