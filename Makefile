# Tutorial app. Fixed port, no prototype-run wiring.
# setup installs only. The SQLite file is created on first `make dev`.
# reset-db deletes it so the next start creates it again.

PORT ?= 3042

.PHONY: setup dev test build preview reset-db

setup:
	pnpm install

dev:
	pnpm exec nuxt dev --port $(PORT)

test:
	pnpm exec vitest run

build:
	pnpm exec nuxt build

preview:
	pnpm exec nuxt preview --port $(PORT)

reset-db:
	rm -f .data/tutorial.sqlite
