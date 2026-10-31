<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Welcome</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      This is a small working <strong class="term">Nuxt</strong> app, built to be read. Every page you see is a piece of it, and every chapter explains one part of how it is put together. The app is a task board: a list of tasks in columns, with a few things you can do to them. You do not need to know Nuxt or Vue first. You do need to know C or C++.
    </p>

    <section
      class="mt-8 max-w-xl rounded-lg border-2 border-primary bg-elevated p-5"
      aria-labelledby="xray-title"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-primary">Start here</p>
      <h2 id="xray-title" class="mt-1 text-lg font-semibold tracking-tight text-highlighted">Turn on X-ray</h2>
      <p class="mt-2 text-sm leading-relaxed text-pretty text-muted">
        <strong class="term">X-ray</strong> is the feature this tutorial is built around. It is the only place where the path behind a word on the screen is shown. Chapters explain the parts; X-ray shows how they connect in the running app.
      </p>
      <ol class="mt-3 list-decimal space-y-2 ps-5 text-sm leading-relaxed text-pretty text-muted">
        <li>Switch <strong class="text-highlighted">X-ray</strong> on in the header, at the top right.</li>
        <li>Hover over any word or box on the page. The panel on the right shows the file and the element behind it.</li>
        <li>Click it to keep it selected. Then follow the path: the <strong class="term-vue">page</strong>, the <strong class="term-network">request</strong>, the <strong class="term-server">server</strong>, and the <strong class="term-database">row</strong>.</li>
      </ol>
      <p class="mt-3 text-sm leading-relaxed text-pretty text-muted">
        Leave X-ray on while you read. The chapters refer to the same path, and X-ray is how you check each one against the running app.
      </p>
    </section>

    <h2 class="mt-10 text-lg font-semibold tracking-tight text-highlighted">What the app is</h2>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      The board on <NuxtLink to="/sample" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Sample content</NuxtLink> is the running example. Its tasks are stored in a <strong class="term-database">SQLite</strong> file on the server. When you add or move a task, the browser sends a <strong class="term-network">request</strong>, the <strong class="term-server">server</strong> writes the change, and the page shows the result. The same app serves the first HTML page and every later click.
    </p>

    <h2 class="mt-10 text-lg font-semibold tracking-tight text-highlighted">How the chapters go</h2>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      The chapters follow the path of one request, from the browser to the database and back, and then the parts around it: the language, the modules, login, tests, and the build.
    </p>
    <ul class="mt-4 max-w-xl list-disc space-y-2 ps-5 text-sm leading-relaxed text-pretty text-muted">
      <li><NuxtLink to="/from-c" class="font-medium text-highlighted underline decoration-1 underline-offset-2">A web app for a C programmer</NuxtLink>: two programs, a socket between them.</li>
      <li><NuxtLink to="/anatomy" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Project anatomy</NuxtLink>: which file becomes a URL, a component, or an API endpoint.</li>
      <li><NuxtLink to="/sample" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Sample content</NuxtLink>: the board itself, with Replay and the two ways its words arrive.</li>
      <li><NuxtLink to="/rendering" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Rendering</NuxtLink>: the HTML Node sends, and how Vue attaches to it.</li>
      <li><NuxtLink to="/reactivity" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Vue reactivity</NuxtLink>: how a changed value re-renders the parts that read it.</li>
      <li><NuxtLink to="/routes" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Server routes and database</NuxtLink>: the API, and the rows it reads.</li>
      <li><NuxtLink to="/languages" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Languages</NuxtLink>: TypeScript, Vue, CSS, SQL, and WebAssembly.</li>
      <li><NuxtLink to="/modules" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Modules</NuxtLink>: code that runs at build time, including X-ray itself.</li>
      <li><NuxtLink to="/login" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Login</NuxtLink>: the session cookie and the actors table.</li>
      <li><NuxtLink to="/testing" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Testing</NuxtLink>: the route and component checks behind <code class="token">make test</code>.</li>
      <li><NuxtLink to="/deploy" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Build and deploy</NuxtLink>: what <code class="token">make build</code> writes to <code class="token">.output/</code>.</li>
    </ul>

    <p class="mt-10 text-sm text-pretty text-muted">
      Continue with
      <NuxtLink to="/from-c" class="font-medium text-highlighted underline decoration-1 underline-offset-2">A web app for a C programmer</NuxtLink>.
    </p>
  </div>
</template>
