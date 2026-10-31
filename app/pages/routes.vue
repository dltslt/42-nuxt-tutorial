<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Server routes and database</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="Nitro listens on the same port as the page. A file in `server/api/` is a route on that port. The handlers read SQLite through `query()`." />
    </p>
    <ChaptersApiExplorer />
    <ChaptersTableViewer />
  </div>
</template>
