import type { XrayElement } from '../composables/useXray'

export default defineNuxtPlugin((nuxtApp) => {
  // A directive is a marker on an element. v-xray="..." hangs the data lineage on it for the selector.
  nuxtApp.vueApp.directive('xray', {
    mounted(el: XrayElement, binding) {
      el._xrayHit = binding.value
    },
    updated(el: XrayElement, binding) {
      el._xrayHit = binding.value
    },
    getSSRProps() {
      return {}
    }
  })
})
