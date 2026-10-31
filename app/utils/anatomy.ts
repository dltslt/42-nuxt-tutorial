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
    becomes: 'the dev server, and `.output/` after `make build`',
    text: '`make dev` starts Nuxt on port 3042. `make build` writes the generated app into `.output/`. The file itself stays in the repository.'
  },
  {
    id: 'package',
    name: 'package.json',
    kind: 'source',
    becomes: '`node_modules/` and the scripts that start Nuxt',
    text: '`pnpm install` reads `dependencies` and fetches those packages. `scripts.dev` is `nuxt dev`. Nuxt is one of those packages.'
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
