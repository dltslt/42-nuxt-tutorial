export default defineNuxtPlugin((nuxtApp) => {
  // A directive is a marker on an element. v-xray="..." calls inspect on click.
  nuxtApp.vueApp.directive('xray', {
    mounted(el, binding) {
      const onClick = () => useXray().inspect(binding.value)
      el.addEventListener('click', onClick)
      ;(el as HTMLElement & { _xrayClick?: () => void })._xrayClick = onClick
    },
    updated(el, binding) {
      const node = el as HTMLElement & { _xrayClick?: (event: Event) => void }
      if (node._xrayClick) el.removeEventListener('click', node._xrayClick)
      const onClick = () => useXray().inspect(binding.value)
      el.addEventListener('click', onClick)
      node._xrayClick = onClick
    },
    unmounted(el) {
      const node = el as HTMLElement & { _xrayClick?: () => void }
      if (node._xrayClick) el.removeEventListener('click', node._xrayClick)
    }
  })
})
