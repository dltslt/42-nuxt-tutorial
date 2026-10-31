<template>
  <div>
    <h1 class="text-2xl font-semibold tracking-tight text-pretty text-highlighted">Login</h1>
    <p class="mt-2 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="`nuxt-auth-utils` seals a session into the cookie `nuxt-auth-session`. The password check uses the `actors` table. Nuxt derives the seal from `appSecret`. In development that secret is generated under `.nuxt/`. A build needs `NUXT_APP_SECRET`." />
    </p>
    <ChaptersLogin />
    <p class="mt-8 text-sm text-pretty text-muted">
      Continue with
      <NuxtLink to="/testing" class="font-medium text-highlighted underline decoration-1 underline-offset-2">Testing</NuxtLink>.
    </p>
  </div>
</template>
