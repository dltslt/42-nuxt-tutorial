<script setup lang="ts">
import type { RequestTrace } from '../../utils/story'

type Actor = { id: string, name: string }

type Probe = {
  status: number
  user: Actor | null
  cookie: { name: string, bytes: number } | null
  missing: boolean
}

const session = useUserSession()
const pending = ref(false)
const error = ref('')
const showPassword = ref(false)
const probe = ref<Probe | null>(null)

const oauth = ref(0)
const oauthSteps = [
  {
    title: 'The browser leaves this app',
    sentence: 'The page would open 42’s authorize URL. The person signs in on 42, not in this form.'
  },
  {
    title: '42 redirects back',
    sentence: '42 sends the browser to a URL on this server, with a short-lived code in the query.'
  },
  {
    title: 'The server trades the code',
    sentence: 'The server sends that code and a secret to 42, and 42 returns a token. The secret never goes to the browser.'
  },
  {
    title: 'This tutorial stops here',
    sentence: 'There are no 42 credentials in this app, so that exchange is not wired. The password form above is the one that runs.'
  }
]
const oauthStep = computed(() => oauthSteps[oauth.value]!)

function go(next: number) {
  oauth.value = Math.min(Math.max(next, 0), oauthSteps.length - 1)
}

function syncInvalid(input: EventTarget | null) {
  if (!(input instanceof HTMLInputElement)) return
  input.setAttribute('aria-invalid', input.matches(':user-invalid') ? 'true' : 'false')
}

function responseOf(cause: unknown) {
  if (!cause || typeof cause !== 'object' || !('response' in cause)) return null
  const response = (cause as { response?: { status?: number, headers?: { get: (name: string) => string | null } } }).response
  return response ?? null
}

async function ask() {
  let status = 0
  let user: Actor | null = null
  let traceId = ''
  try {
    const response = await $fetch.raw<{ user: Actor }>('/api/me')
    status = response.status
    user = response._data?.user ?? null
    traceId = response.headers.get('x-trace-id') ?? ''
  } catch (cause) {
    const response = responseOf(cause)
    status = response?.status ?? 0
    traceId = response?.headers?.get('x-trace-id') ?? ''
  }
  let cookie: Probe['cookie'] = null
  let missing = false
  if (traceId) {
    try {
      const trace = await $fetch<RequestTrace>(`/api/_xray/${traceId}`)
      cookie = trace.cookie ?? null
    } catch {
      missing = true
    }
  }
  probe.value = { status, user, cookie, missing }
}

async function onSubmit(event: Event) {
  const form = event.currentTarget
  if (!(form instanceof HTMLFormElement) || pending.value) return
  if (!form.reportValidity()) {
    form.querySelectorAll('input').forEach(syncInvalid)
    return
  }
  const data = new FormData(form)
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/login', {
      method: 'POST',
      body: { id: String(data.get('username') ?? ''), password: String(data.get('password') ?? '') }
    })
    await session.fetch()
    await ask()
  } catch {
    error.value = 'Unknown name or password.'
  } finally {
    pending.value = false
  }
}

async function signOut() {
  if (pending.value) return
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/logout', { method: 'POST' })
    await session.fetch()
    await ask()
  } catch {
    error.value = 'Sign out did not finish.'
  } finally {
    pending.value = false
  }
}

const signedInName = computed(() => session.user.value?.name ?? '')

const resultText = computed(() => {
  const current = probe.value
  if (!current) return 'Asking…'
  if (current.missing) return 'This request is no longer in memory. Ask again.'
  const carried = current.cookie
    ? `This request carried \`${current.cookie.name}\`, ${current.cookie.bytes} bytes. The sealed value is not in the trace.`
    : 'This request did not carry `nuxt-auth-session`.'
  if (current.status === 200) return `Status 200. The handler returned ${current.user?.name ?? 'the user'}. ${carried}`
  if (current.status === 401) return `Status 401. \`requireUserSession\` found no user. ${carried}`
  return `Status ${current.status || 'unknown'}. ${carried}`
})

onMounted(() => {
  ask()
})
</script>

<template>
  <section class="mt-8" aria-labelledby="login-form-title">
    <h2 id="login-form-title" class="text-lg font-semibold tracking-tight text-highlighted">Sign in as an actor</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="The password is checked against `password_hash` on `actors`. The session stores the id and the name. The routes table omits that column." />
    </p>
    <ul class="mt-3 max-w-xl list-disc ps-5 text-sm leading-relaxed text-pretty text-muted">
      <li><InlineText text="Ada signs in as `ada` with password `bread`." /></li>
      <li><InlineText text="Lin signs in as `lin` with password `knife`." /></li>
    </ul>

    <form class="login-form mt-4" :aria-busy="pending" @submit.prevent="onSubmit" @blur.capture="syncInvalid($event.target)">
      <div class="login-field">
        <label for="actor-id">Actor id <span aria-hidden="true">*</span></label>
        <input
          id="actor-id"
          name="username"
          type="text"
          autocomplete="username"
          autocapitalize="none"
          autocorrect="off"
          spellcheck="false"
          required
          enterkeyhint="next"
          aria-errormessage="actor-id-error"
          @input="syncInvalid($event.target)"
        >
        <p id="actor-id-error" class="field-error"><span aria-hidden="true">!</span> Actor id is required.</p>
      </div>
      <div class="login-field">
        <label for="actor-password">Password <span aria-hidden="true">*</span></label>
        <input
          id="actor-password"
          name="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
          enterkeyhint="done"
          aria-errormessage="actor-password-error"
          @input="syncInvalid($event.target)"
        >
        <p id="actor-password-error" class="field-error"><span aria-hidden="true">!</span> Password is required.</p>
      </div>
      <button
        type="button"
        class="justify-self-start rounded-md px-3 py-2 text-sm ring ring-default"
        :aria-pressed="showPassword"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? 'Hide password' : 'Show password' }}
      </button>
      <div class="flex flex-wrap gap-2">
        <button type="submit" class="rounded-md px-3 py-2 text-sm ring ring-default">Sign in</button>
        <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" @click="signOut">Sign out</button>
        <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" @click="ask">Ask who I am</button>
      </div>
      <p v-if="error" role="alert" class="text-sm">{{ error }}</p>
    </form>
  </section>

  <section class="mt-10" aria-labelledby="session-title">
    <h2 id="session-title" class="text-lg font-semibold tracking-tight text-highlighted">The cookie on the next request</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="Sign in tells the browser to store `nuxt-auth-session`. Page script cannot read that header. `GET /api/me` is the request that shows it. Turn on X-ray, open the sample, and point at a word: the network card names the same cookie when the browser sent it." />
    </p>
    <div class="mt-4 grid gap-3" style="grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))">
      <article class="layer-card p-3" :style="{ borderLeftColor: 'var(--layer-vue)', background: 'var(--layer-vue-bg)' }">
        <h3 class="text-sm font-semibold">In the page</h3>
        <p class="mt-2 text-sm leading-relaxed text-pretty">
          <template v-if="signedInName">Signed in as {{ signedInName }}.</template>
          <template v-else>No session in the page.</template>
        </p>
      </article>
      <article class="layer-card p-3" :style="{ borderLeftColor: 'var(--layer-network)', background: 'var(--layer-network-bg)' }">
        <h3 class="text-sm font-semibold">GET /api/me</h3>
        <p class="mt-2 text-sm leading-relaxed text-pretty"><InlineText :text="resultText" /></p>
      </article>
    </div>
    <p class="sr-only" aria-live="polite">{{ resultText.replaceAll('`', '') }}</p>
  </section>

  <section class="mt-10" aria-labelledby="oauth-title">
    <h2 id="oauth-title" class="text-lg font-semibold tracking-tight text-highlighted">42 intra, explained only</h2>
    <p class="mt-1 max-w-xl text-sm leading-relaxed text-pretty text-muted">
      <InlineText text="An OAuth login would replace the password check. `nuxt-auth-utils` knows several providers. 42 intra is not one of them." />
    </p>
    <div class="mt-3 flex items-center gap-2">
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="oauth === 0" @click="go(oauth - 1)">
        Previous
      </button>
      <ol class="flex flex-1 items-center gap-1" aria-label="Steps of an OAuth login">
        <li v-for="(item, index) in oauthSteps" :key="item.title" class="flex-1">
          <button
            type="button"
            class="h-2 w-full rounded-full bg-accented"
            :style="index === oauth ? { background: 'var(--layer-network)' } : undefined"
            :aria-current="index === oauth ? 'step' : undefined"
            :aria-label="`${index + 1}. ${item.title}`"
            @click="go(index)"
          />
        </li>
      </ol>
      <button type="button" class="rounded-md px-3 py-2 text-sm ring ring-default" :disabled="oauth >= oauthSteps.length - 1" @click="go(oauth + 1)">
        Next
      </button>
    </div>
    <article class="layer-card mt-4 p-3" :style="{ borderLeftColor: 'var(--layer-network)', background: 'var(--layer-network-bg)' }">
      <h3 class="text-sm font-semibold">{{ oauthStep.title }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-pretty">{{ oauthStep.sentence }}</p>
    </article>
    <p class="sr-only" aria-live="polite">{{ oauthStep.title }}. {{ oauthStep.sentence }}</p>
  </section>
</template>
