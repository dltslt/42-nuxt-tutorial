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
        id: 'app-config',
        name: 'app.config.ts',
        kind: 'source',
        becomes: 'the Nuxt UI colors',
        text: '`defineAppConfig` sets the primary and neutral colors. `@nuxt/ui` reads them when it paints `UButton` and the rest of the shell.'
      },
      {
        id: 'auth-dts',
        name: 'auth.d.ts',
        kind: 'source',
        becomes: 'the type of the session user',
        text: 'This augments `#auth-utils`. The session user is an `id` and a `name`, which is what `GET /api/me` returns.'
      },
      {
        id: 'xray-sources-dts',
        name: 'xray-sources.d.ts',
        kind: 'source',
        becomes: 'the type of `#xray-sources`',
        text: 'The modules chapter imports `#xray-sources`. This file tells TypeScript the virtual module is a record of snippets. `modules/xray/index.ts` writes that record at build time.'
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
            id: 'inline-text',
            name: 'InlineText.vue',
            kind: 'component',
            becomes: 'the backtick spans in a sentence',
            text: 'Chapter sentences pass through this component. A span wrapped in backticks becomes a `code` element. `test/component.test.ts` mounts this file.'
          },
          {
            id: 'board',
            name: 'board',
            children: [
              {
                id: 'task-board',
                name: 'TaskBoard.vue',
                kind: 'component',
                becomes: 'the columns on `/sample`',
                text: '`sample.vue` places this on the page. It reads the board and renders one `TaskCard` for each task.'
              },
              {
                id: 'task-form',
                name: 'TaskForm.vue',
                kind: 'component',
                becomes: 'the form that posts a new task',
                text: 'The sample page places this under the board. Submitting it calls `POST /api/tasks`.'
              },
              {
                id: 'task-card',
                name: 'TaskCard.vue',
                kind: 'component',
                becomes: 'a component inside the board',
                text: '`TaskBoard` places one of these for each task. The template name is `BoardTaskCard`, from the folder plus the file name.'
              }
            ]
          },
          {
            id: 'chapters',
            name: 'chapters',
            children: [
              {
                id: 'anatomy-branch',
                name: 'AnatomyBranch.vue',
                kind: 'component',
                becomes: 'the body of this chapter page',
                text: 'A file in `pages/` is the URL. This component is what `/anatomy` draws, and the other files in this folder do the same for their page. The nodes come from `app/utils/anatomy.ts`.'
              }
            ]
          },
          {
            id: 'xray-components',
            name: 'xray',
            children: [
              {
                id: 'xray-panel',
                name: 'Panel.vue',
                kind: 'component',
                becomes: 'the drawer beside the page',
                text: 'The layout mounts this beside the page when x-ray is on. It reads `useXray` and shows `StructureView` or `DataView`.'
              },
              {
                id: 'xray-selector',
                name: 'Selector.vue',
                kind: 'component',
                becomes: 'hover and pin',
                text: 'The layout mounts this with the drawer. Hovering an element selects it. A click pins it, and Esc clears the pin.'
              },
              {
                id: 'xray-structure',
                name: 'StructureView.vue',
                kind: 'component',
                becomes: 'which file drew the element',
                text: 'Given the selected element, this walks the Vue instance tree and names the component and the template line.'
              },
              {
                id: 'xray-data',
                name: 'DataView.vue',
                kind: 'component',
                becomes: 'which query produced the words',
                text: 'This follows a marked value from the template, through the fetch, to the SQL on the trace.'
              },
              {
                id: 'xray-journey',
                name: 'Journey.vue',
                kind: 'component',
                becomes: 'the first load against a later click',
                text: '`sample.vue` places this under the board. It reads the trace from the first `GET /api/board` and the trace from the last create or move.'
              },
              {
                id: 'xray-replay',
                name: 'Replay.vue',
                kind: 'component',
                becomes: 'the create and move steps',
                text: '`sample.vue` places this under the board. After a create or a move, it walks that request one layer at a time.'
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
      },
      {
        id: 'composables',
        name: 'composables',
        children: [
          {
            id: 'use-xray',
            name: 'useXray.ts',
            kind: 'source',
            becomes: '`useXray` and the trace state, with no import line',
            text: 'A file in `composables/` is available in every component. `useXray` holds the hovered element. `useTraceIds` holds one trace id per fetch marker.'
          }
        ]
      },
      {
        id: 'plugins',
        name: 'plugins',
        children: [
          {
            id: 'plugin-xray',
            name: 'xray.ts',
            kind: 'source',
            becomes: 'the `v-xray` directive',
            text: 'Nuxt runs a file in `plugins/` when the app starts. This one registers `v-xray`, which hangs the data lineage on an element for the selector.'
          },
          {
            id: 'plugin-xray-ssr',
            name: 'xray-ssr.client.ts',
            kind: 'source',
            becomes: 'which elements came from the server HTML',
            text: 'The `.client` suffix means this plugin runs in the browser only. It records the elements already in the document before Vue mounts, so the structure view can tell a server render from a later update.'
          }
        ]
      },
      {
        id: 'utils',
        name: 'utils',
        children: [
          {
            id: 'util-anatomy',
            name: 'anatomy.ts',
            kind: 'source',
            becomes: 'this tree',
            text: 'The anatomy page imports `tree` from here. Exports in `utils/` are also available to components without an import line.'
          },
          {
            id: 'util-board',
            name: 'board.ts',
            kind: 'source',
            becomes: 'the board types and `placeTask`',
            text: '`TaskBoard` and `TaskForm` share `Board` from here. `placeTask` moves a task into the column named by `column_id`.'
          },
          {
            id: 'util-story',
            name: 'story.ts',
            kind: 'source',
            becomes: 'the layers in the data view',
            text: '`buildStory` turns a trace and the marked snippets into the layers `DataView` and `Replay` render.'
          },
          {
            id: 'util-structure',
            name: 'structure.ts',
            kind: 'source',
            becomes: 'the steps in the structure view',
            text: '`buildStructure` turns the selected element into the steps `StructureView` renders: the route, the layout, the page, the component, and the element.'
          },
          {
            id: 'util-vue-tree',
            name: 'vueTree.ts',
            kind: 'source',
            becomes: 'the component name and file for an element',
            text: 'These helpers read the Vue instance attached to an element in the dev build, and return the component name and the file under `app/`.'
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
          },
          {
            id: 'xray-api',
            name: '_xray',
            children: [
              {
                id: 'xray-id-get',
                name: '[id].get.ts',
                kind: 'endpoint',
                becomes: '`GET /api/_xray/:id`',
                text: 'The drawer and the sample page call this with a trace id. The handler returns that trace, or 404 when the id is unknown.'
              },
              {
                id: 'xray-source-get',
                name: 'source.get.ts',
                kind: 'endpoint',
                becomes: '`GET /api/_xray/source`',
                text: 'The structure view calls this with a file and a line. The handler reads that `.vue` file under `app/` and returns the element around that line.'
              },
              {
                id: 'xray-highlight-post',
                name: 'highlight.post.ts',
                kind: 'endpoint',
                becomes: '`POST /api/_xray/highlight`',
                text: 'The drawer posts snippets here. The handler returns highlighted HTML and writes nothing.'
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
      },
      {
        id: 'middleware',
        name: 'middleware',
        children: [
          {
            id: 'trace-middleware',
            name: 'trace.ts',
            kind: 'source',
            becomes: 'a step before every `/api/` handler',
            text: 'Nitro runs a file in `middleware/` before the route handler. This one starts a trace and sets `x-trace-id`, and it skips `/api/_xray`.'
          }
        ]
      },
      {
        id: 'server-utils',
        name: 'utils',
        children: [
          {
            id: 'util-sql',
            name: 'sql.ts',
            kind: 'source',
            becomes: '`query`',
            text: 'A file in `server/utils/` is available to every handler without an import line. `query` runs the SQL and keeps a copy on the request trace.'
          },
          {
            id: 'util-task',
            name: 'task.ts',
            kind: 'source',
            becomes: '`readTask`',
            text: 'The create and move handlers call this to load one task in the same shape the board prints.'
          },
          {
            id: 'util-trace',
            name: 'trace.ts',
            kind: 'source',
            becomes: '`beginTrace` and `readTrace`',
            text: '`server/middleware/trace.ts` calls `beginTrace`. `GET /api/_xray/:id` calls `readTrace`.'
          },
          {
            id: 'util-highlight',
            name: 'highlight.ts',
            kind: 'source',
            becomes: 'highlighted source for the drawer',
            text: '`POST /api/_xray/highlight` and `GET /api/_xray/source` call this to turn a snippet into HTML.'
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
          },
          {
            id: 'xray-locate',
            name: 'locate.ts',
            kind: 'source',
            becomes: 'the line stamp on each template node',
            text: '`index.ts` calls `locate` while Vue compiles a template. The transform writes the file and the line onto elements under `app/`, so the browser can point back at the source.'
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
