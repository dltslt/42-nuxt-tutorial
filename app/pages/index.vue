<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Welcome</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      This is a self-contained, interactive breakdown of how a modern full-stack web framework (here <strong class="term">Nuxt</strong>) actually works. It is written specifically for 42 students stepping out of C and C++ into web architecture for <code class="token">ft_transcendence</code>.
    </p>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Instead of abstract slides or disconnected snippets, this entire site <em>is</em> the application you are studying. No prior knowledge of Vue, TypeScript, or frontend tooling is required.
    </p>

    <section
      class="mt-8 max-w-xl rounded-lg border-2 border-primary bg-elevated p-5"
      aria-labelledby="xray-title"
    >
      <p class="text-xs font-semibold uppercase tracking-wide text-primary">Start here</p>
      <h2 id="xray-title" class="mt-1 text-lg font-semibold tracking-tight text-highlighted">Turn on X-ray</h2>
      <p class="mt-2 text-sm leading-relaxed text-pretty text-muted">
        Web frameworks hide a lot of machinery behind convenience. <strong class="term">X-ray</strong> pulls back that curtain by mapping any rendered element on your screen directly to the underlying engineering chain:
      </p>
      <ol class="mt-3 list-decimal space-y-2 ps-5 text-sm leading-relaxed text-pretty text-muted">
        <li>Toggle <strong class="text-highlighted">X-ray</strong> on in the header (top-right).</li>
        <li>Hover over any component to reveal the source file and template line that rendered it.</li>
        <li>Click to lock selection and trace the full execution path: from the <strong class="term-vue">Vue component</strong> &rarr; across the <strong class="term-network">HTTP request</strong> &rarr; into the <strong class="term-server">server endpoint</strong> &rarr; down to the exact <strong class="term-database">SQLite row</strong>.</li>
      </ol>
      <p class="mt-3 text-sm leading-relaxed text-pretty text-muted">
        Toogle X-ray on/off as you navigate the chapters—each topic directly references this live pipeline.
      </p>
    </section>

    <h2 class="mt-10 text-lg font-semibold tracking-tight text-highlighted">The Reference Architecture</h2>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      To keep concepts concrete, the tutorial runs an embedded Kanban board on the 
      <NuxtLink to="/sample" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Sample board</NuxtLink> page. 
    </p>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      The board exercises every tier of a typical web system:
    </p>
    <ul class="mt-3 max-w-xl list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-pretty text-muted">
      <li><strong>Persistence:</strong> Native SQLite stored locally on disk (<code class="token">.data/tutorial.sqlite</code>).</li>
      <li><strong>Server engine:</strong> Nitro / Node.js handling API routing, session cookies, and database transactions.</li>
      <li><strong>Client runtime:</strong> Vue managing DOM updates and client-side reactivity without full page reloads.</li>
    </ul>
    <p class="mt-3 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      The same unified codebase handles the initial server-side HTML rendering (SSR) and every subsequent client-side JSON interaction.
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
