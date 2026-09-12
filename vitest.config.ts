import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Exclude .claude/ so agent git worktrees checked out under the repo root
    // don't get their own copy of the test suite picked up and run too.
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
});
