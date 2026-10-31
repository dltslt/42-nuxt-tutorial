<script setup lang="ts">
import type { XrayElement } from '../../composables/useXray'

const { enabled, selected, pinned, hover, pin } = useXray()
const box = ref<{ top: number, left: number, width: number, height: number } | null>(null)
const label = ref('')

function pick(target: EventTarget | null): XrayElement | null {
  if (!(target instanceof HTMLElement)) return null
  if (target.closest('[data-xray-ui]')) return null
  let node: HTMLElement | null = target
  while (node) {
    if ((node as XrayElement)._xrayHit) return node
    node = node.parentElement
  }
  if (target === document.body || target === document.documentElement) return null
  return target
}

function onMove(event: PointerEvent) {
  const el = pick(event.target)
  if (el) hover(el)
}

function onClick(event: MouseEvent) {
  const el = pick(event.target)
  if (!el) return
  // Tagged words are only there to be read. Other controls, such as Add task, still do their job.
  const tagged = event.target instanceof Element && event.target.closest('.xray-hit')
  if (tagged) {
    event.preventDefault()
    event.stopPropagation()
  }
  pin(pinned.value === el ? null : el)
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') pin(null)
}

let frame = 0
function track() {
  const el = selected.value
  if (el && el.isConnected) {
    const rect = el.getBoundingClientRect()
    box.value = { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
    label.value = labelFor(el)
  } else {
    box.value = null
  }
  frame = requestAnimationFrame(track)
}

function start() {
  document.addEventListener('pointermove', onMove, true)
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKey)
  frame = requestAnimationFrame(track)
}

function stop() {
  document.removeEventListener('pointermove', onMove, true)
  document.removeEventListener('click', onClick, true)
  document.removeEventListener('keydown', onKey)
  cancelAnimationFrame(frame)
  box.value = null
  pin(null)
}

onMounted(() => {
  watch(enabled, on => (on ? start() : stop()), { immediate: true })
})
onBeforeUnmount(stop)
</script>

<template>
  <div
    v-if="enabled && box"
    data-xray-ui
    class="xray-outline"
    :class="{ 'xray-outline-pinned': pinned }"
    :style="{ top: `${box.top}px`, left: `${box.left}px`, width: `${box.width}px`, height: `${box.height}px` }"
    aria-hidden="true"
  >
    <span class="xray-label">{{ label }}<template v-if="pinned"> · pinned</template></span>
  </div>
</template>
