# Nuxt tutorial

A Nuxt app that shows how a word on the screen comes from a file, a request, and a database row.

```
make setup
make dev
```

Open http://localhost:3042. The app opens on Welcome. The board to click is Sample content. Turn on X-ray and point at a title.

`make reset-db` deletes `.data/tutorial.sqlite`. The next start creates it again.

Nuxt UI and this SQLite file are choices for these pages. They are not decisions for Lerch.
