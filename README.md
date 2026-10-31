# Nuxt tutorial

This repository was created in the last stage of the 42 common core, as preparation for `ft_transcendence`. It started as part of a larger repository and was split out so it can stand on its own.

It is not a full Nuxt course. It is a small, working web application meant to help you understand how a Nuxt app is built and how it works: what runs in the browser, what runs on the server, and where the data lives.

## Overview

Every piece of text on the screen comes from somewhere. Here, the path is always the same:

**a file in the UI → an HTTP request → a server endpoint → a row in a database**

The app shows that path for real data. Open the Sample board, then turn on **X-ray** in the header and point at a title. The panel names the file that drew it, the request that carried it, and the row it came from.

The chapters in the app walk through the same path from different angles: the rendering, the reactivity, the routes, the database, and the tooling around them.

## Prerequisites

- **Node.js**: `^22.22.3`, `^24.15.0`, or `26` and newer. The app uses `node:sqlite`, which is built into these versions.
- **pnpm**: `12.16.1`. `package.json` pins this version, so with [Corepack](https://nodejs.org/api/corepack.html) enabled pnpm picks it up automatically.
- **make**: optional, only needed for the Makefile shortcuts.

## Quickstart

```bash
# Using Make:
make setup
make dev

# Or standard pnpm:
pnpm install
pnpm dev
```

`make dev` serves the app at http://localhost:3042. `pnpm dev` uses Nuxt's default port, http://localhost:3000.

Setup only installs dependencies. The database file is created the first time the server starts.

## Key features and exploration guide

**Pages: `app/pages/`**
A file in this folder becomes a URL. `index.vue` is `/`, and `sample.vue` is `/sample`, the board you can click and inspect with X-ray. Start with `from-c.vue` and `anatomy.vue` if you are new to the web side, then continue with the chapters on rendering, reactivity, and routes.

**Server endpoints: `server/api/`**
A file here becomes an API route, with the HTTP method in its name. `server/api/board.get.ts` answers `GET /api/board`. Its handler queries the database and returns JSON, which the page then renders.

**Database: SQLite through db0**
The data lives in `.data/tutorial.sqlite`. The app reads it through [db0](https://db0.unjs.io/) with its `node-sqlite` connector, which uses the built-in `node:sqlite` module. A server plugin in `server/plugins/` creates the tables and seeds the sample board on first start. There is no database server to install or run.

**Resetting state: `make reset-db`**
This deletes `.data/tutorial.sqlite`. The next start creates the file again and seeds the board. Use it after you change a seed or when you want a clean board.

**Other commands**
- `make test` runs the route and component tests (Vitest).
- `make build` writes the production build to `.output/`.
- `make preview` serves that build on port 3042.

## Architectural disclaimer

This is a demonstration, not a production template. Two choices are deliberate:

- **Nuxt UI** provides ready-made components, so the focus stays on the page structure and the data path rather than on styling.
- **Embedded SQLite** keeps the whole app in one process with one file. Clone, install, and run: no database service, no Docker, no environment variables.

Both choices trade realism for a frictionless start. A real project would likely need a hosted database, authentication that goes beyond a demo login, and a deployment setup suited to its target. The chapters on deployment and testing point in those directions.
