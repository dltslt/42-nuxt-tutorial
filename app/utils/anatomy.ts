export type AnatomyKind = 'url' | 'component' | 'endpoint' | 'generated' | 'source'

export type AnatomyNode = {
  id: string
  name: string
  kind?: AnatomyKind
  becomes?: string
  text?: string
  open?: boolean
  children?: AnatomyNode[]
}

export const kindLabel: Record<AnatomyKind, string> = {
  url: 'URL',
  component: 'Component',
  endpoint: 'API endpoint',
  generated: 'Generated output',
  source: 'Source'
}

export const tree: AnatomyNode[] = [
  {
    id: 'makefile',
    name: 'Makefile',
    kind: 'source',
    becomes: 'the dev server, the tests, and `.output/` after `make build`',
    text: '`make dev` starts Nuxt on port 3042. `make test` runs Vitest. `make build` writes the generated app into `.output/`. The file itself stays in the repository.'
  },
  {
    id: 'package',
    name: 'package.json',
    kind: 'source',
    becomes: '`node_modules/` and the scripts that start Nuxt',
    text: '`pnpm install` reads `dependencies` and fetches those packages. `scripts.dev` is `nuxt dev`. `scripts.test` is `vitest run`, which is what `make test` calls. Nuxt is one of those packages.'
  },
  {
    id: 'config',
    name: 'nuxt.config.ts',
    kind: 'source',
    becomes: 'the modules, the CSS, and the database path inside `.nuxt/`',
    text: 'Nuxt reads this file when the process starts. It loads `@nuxt/ui` and `modules/xray/`, pulls in `app/assets/css/main.css`, and points Nitro at `.data/tutorial.sqlite`.'
  },
  {
    id: 'app',
    name: 'app',
    open: true,
    children: [
      {
        id: 'app-vue',
        name: 'app.vue',
        kind: 'component',
        becomes: 'the root component',
        text: 'This is the component at the top of the page. It renders the layout, and the layout renders whichever page matches the URL.'
      },
      {
        id: 'layouts',
        name: 'layouts',
        open: true,
        children: [
          {
            id: 'layout',
            name: 'default.vue',
            kind: 'component',
            becomes: 'the shell around every page',
            text: 'The header, the chapter list, and the page slot live here. Every URL uses this layout unless a page asks for another one.'
          }
        ]
      },
      {
        id: 'pages',
        name: 'pages',
        open: true,
        children: [
          {
            id: 'page-index',
            name: 'index.vue',
            kind: 'url',
            becomes: '`/`',
            text: 'A file in `pages/` becomes a URL. `index.vue` is the path `/`, the welcome page.'
          },
          {
            id: 'page-from-c',
            name: 'from-c.vue',
            kind: 'url',
            becomes: '`/from-c`',
            text: 'The file name becomes the path. `from-c.vue` is the chapter about processes and the socket.'
          },
          {
            id: 'page-anatomy',
            name: 'anatomy.vue',
            kind: 'url',
            becomes: '`/anatomy`',
            text: 'This page. The file name is the path, so the chapter is available at `/anatomy`.'
          },
          {
            id: 'page-sample',
            name: 'sample.vue',
            kind: 'url',
            becomes: '`/sample`',
            text: 'The board lives at `/sample`. The page calls `useFetch` on `/api/board` while Nuxt is building the HTML.'
          },
          {
            id: 'page-rendering',
            name: 'rendering.vue',
            kind: 'url',
            becomes: '`/rendering`',
            text: 'The rendering chapter. Node renders it to HTML, and the page shows the time that render wrote.'
          },
          {
            id: 'page-reactivity',
            name: 'reactivity.vue',
            kind: 'url',
            becomes: '`/reactivity`',
            text: 'The reactivity chapter. The page holds a `ref` for the title and the count, and a `computed` for the double.'
          },
          {
            id: 'page-routes',
            name: 'routes.vue',
            kind: 'url',
            becomes: '`/routes`',
            text: 'The routes chapter. It calls `GET /api/board` and `GET /api/tables`, and it lists the rows in `.data/tutorial.sqlite`.'
          },
          {
            id: 'page-languages',
            name: 'languages.vue',
            kind: 'url',
            becomes: '`/languages`',
            text: 'The languages chapter. It places TypeScript, the Vue file, CSS, and SQL in this app, and explains WebAssembly without shipping a `.wasm` file.'
          },
          {
            id: 'page-modules',
            name: 'modules.vue',
            kind: 'url',
            becomes: '`/modules`',
            text: 'The modules chapter. It reads `#xray-sources`, the file `modules/xray/` wrote at build time, and it uses a `UButton` from `@nuxt/ui`.'
          },
          {
            id: 'page-login',
            name: 'login.vue',
            kind: 'url',
            becomes: '`/login`',
            text: 'The login chapter. The form posts to `/api/login`, and Ask who I am calls `/api/me` so the trace can show the session cookie.'
          },
          {
            id: 'page-testing',
            name: 'testing.vue',
            kind: 'url',
            becomes: '`/testing`',
            text: 'The testing chapter. It shows `test/routes.test.ts` and `test/component.test.ts`, the files `make test` runs.'
          },
          {
            id: 'page-deploy',
            name: 'deploy.vue',
            kind: 'url',
            becomes: '`/deploy`',
            text: 'The build chapter. It reads `.output/` when that folder exists, and it explains the other shapes a Nuxt app can take. Docker is one of those explanations.'
          }
        ]
      },
      {
        id: 'components',
        name: 'components',
        children: [
          {
            id: 'board',
            name: 'board',
            children: [
              {
                id: 'task-card',
                name: 'TaskCard.vue',
                kind: 'component',
                becomes: 'a component inside the board',
                text: '`sample.vue` places one of these on the board for each task. The template name is `BoardTaskCard`, from the folder plus the file name.'
              }
            ]
          }
        ]
      },
      {
        id: 'assets',
        name: 'assets',
        children: [
          {
            id: 'css',
            name: 'css',
            children: [
              {
                id: 'main-css',
                name: 'main.css',
                kind: 'component',
                becomes: 'styles on the components',
                text: '`nuxt.config.ts` points `css` at this file. The layer colors and the board columns are defined here, and the components pick them up by class.'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'server',
    name: 'server',
    open: true,
    children: [
      {
        id: 'api',
        name: 'api',
        open: true,
        children: [
          {
            id: 'login-post',
            name: 'login.post.ts',
            kind: 'endpoint',
            becomes: '`POST /api/login`',
            text: 'The login form posts an actor id and a password here. The handler checks `password_hash` and seals a session cookie. The hash is not part of the traced rows.'
          },
          {
            id: 'logout-post',
            name: 'logout.post.ts',
            kind: 'endpoint',
            becomes: '`POST /api/logout`',
            text: 'Sign out calls this. The handler clears the session cookie.'
          },
          {
            id: 'me-get',
            name: 'me.get.ts',
            kind: 'endpoint',
            becomes: '`GET /api/me`',
            text: '`requireUserSession` runs first. Without a cookie that opens, the handler answers 401. With one, it returns the id and the name from the session.'
          },
          {
            id: 'output-get',
            name: 'output.get.ts',
            kind: 'endpoint',
            becomes: '`GET /api/output`',
            text: 'The build chapter calls this. The handler lists names inside `.output/` when `make build` has written that folder, and it does not open the files.'
          },
          {
            id: 'tables-get',
            name: 'tables.get.ts',
            kind: 'endpoint',
            becomes: '`GET /api/tables`',
            text: 'The routes chapter calls this with `?table=`. The handler allows `actors`, `columns`, `tasks`, and `blockers`, and returns those rows.'
          },
          {
            id: 'board-get',
            name: 'board.get.ts',
            kind: 'endpoint',
            becomes: '`GET /api/board`',
            text: 'A file under `server/api/` becomes an endpoint. The name before the dot is the path. The verb is `.get`, so the browser reaches it with `GET /api/board`.'
          },
          {
            id: 'tasks-post',
            name: 'tasks.post.ts',
            kind: 'endpoint',
            becomes: '`POST /api/tasks`',
            text: 'The sample form sends the new task here. The handler inserts a row and returns that task as JSON.'
          },
          {
            id: 'tasks-patch',
            name: 'tasks',
            children: [
              {
                id: 'task-patch',
                name: '[id].patch.ts',
                kind: 'endpoint',
                becomes: '`PATCH /api/tasks/:id`',
                text: 'Brackets in a file name are a parameter. `[id]` is the task id in the path. Moving a card sends `PATCH /api/tasks/` and that id.'
              }
            ]
          }
        ]
      },
      {
        id: 'plugins',
        name: 'plugins',
        children: [
          {
            id: 'seed',
            name: 'seed.ts',
            kind: 'source',
            becomes: 'the tables and the Dinner rows',
            text: 'Nitro runs this file once, when the server process starts. It creates the tables and, on an empty database, the Dinner tasks. The API handlers then read those rows.'
          }
        ]
      }
    ]
  },
  {
    id: 'modules',
    name: 'modules',
    children: [
      {
        id: 'xray',
        name: 'xray',
        children: [
          {
            id: 'xray-index',
            name: 'index.ts',
            kind: 'generated',
            becomes: 'a virtual module of the xray markers',
            text: 'This file is source, and it runs at build time. It scans the app for xray markers and emits a module the pages import. That emitted module is generated output.'
          }
        ]
      }
    ]
  },
  {
    id: 'vitest',
    name: 'vitest.config.ts',
    kind: 'source',
    becomes: 'the two Vitest projects',
    text: '`make test` reads this file. One project runs `test/routes.test.ts` in Node. The other mounts a component in the Nuxt test environment.'
  },
  {
    id: 'test',
    name: 'test',
    children: [
      {
        id: 'routes-test',
        name: 'routes.test.ts',
        kind: 'source',
        becomes: 'checks against the HTTP routes',
        text: 'Vitest runs this file in Node. `setup()` builds the app, and `$fetch` calls `/api/board`, `/api/me`, and `/api/login`.'
      },
      {
        id: 'component-test',
        name: 'component.test.ts',
        kind: 'source',
        becomes: 'a check of one component',
        text: '`mountSuspended` renders `InlineText` inside Vitest. The check reads the `code` element the backtick span became.'
      }
    ]
  },
  {
    id: 'nuxt-dir',
    name: '.nuxt/',
    kind: 'generated',
    becomes: 'types and the development build',
    text: 'Nuxt writes this directory while `make dev` is running. It holds generated types and the current build. It is not committed.'
  },
  {
    id: 'output',
    name: '.output/',
    kind: 'generated',
    becomes: 'the production server',
    text: '`make build` writes this directory. It contains the server Node will run, plus the client files the browser downloads. It is not committed.'
  },
  {
    id: 'sqlite',
    name: '.data/tutorial.sqlite',
    kind: 'source',
    becomes: 'the database the endpoints read',
    text: 'The first `make dev` creates this file. `server/plugins/seed.ts` fills it, and the handlers under `server/api/` query it. Git ignores it.'
  }
]
