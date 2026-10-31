<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Rendering</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      Node can send a finished page. The <strong class="term-browser">browser</strong> paints it, then <strong class="term-vue">Vue</strong> attaches. A later click stays in the browser and patches that page.
    </p>
    <ChaptersRendering />
  </div>
</template>
