# Theory of Forms

A mobile-first PWA about exploring the pocket dimensions left behind after
the end of the world. The old world's objects — precious minerals, tools,
oddities — have coalesced into disparate pocket universes. You explore them
as a grid of unopened squares, each an abstraction of a place within that
universe (an aisle, a shaft, a corner of a warehouse floor).

Every item exists as a concrete instance of an unobtainable perfect "Form,"
in a rarity ladder from broken to cartoon to fully anthropomorphized. Back
at the hub — the last bastion of society, still getting by — collectors
like the Miner want a complete Master Set of the things they care about.

There's no safe stash mid-run: whatever loadout and inventory you carry
into a pocket dimension is lost for good if you die there. Extract before
that happens, and it all comes home with you.

## Status

Early scaffold: one pocket dimension (The Old Warehouse), one collector
(the Miner), and the full core loop — explore, find, survive or don't,
extract or lose it all.

## Stack

- React + TypeScript + Vite
- [zustand](https://github.com/pmndrs/zustand) for state, split into a
  persisted meta store (stash, collector progress) and an ephemeral
  per-run store
- [idb-keyval](https://github.com/jakearchibald/idb-keyval) backing that
  persistence via IndexedDB — no backend, no accounts, for now
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for installability
  (manifest + service worker, works offline after first visit)
- [vitest](https://vitest.dev/) for the pure game-logic tests

## Development

```bash
npm install
npm run dev       # start the dev server
npm run test      # run the unit tests
npm run build     # typecheck + production build
npm run preview   # serve the production build locally
```
