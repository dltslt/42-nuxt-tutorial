<script lang="ts">
import { defineComponent, h, onUpdated, ref } from 'vue'

// The render function runs again only when a prop this box reads has changed.
// The count lives in a plain variable so recording it does not schedule another render.
export default defineComponent({
  name: 'RenderProbe',
  props: {
    title: { type: String, required: true },
    value: { type: [String, Number], required: true }
  },
  setup(props) {
    const root = ref<HTMLElement | null>(null)
    let renders = 0

    onUpdated(() => {
      const el = root.value
      if (!el || renders < 2) return
      el.classList.remove('probe-flash')
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
      void el.offsetWidth
      el.classList.add('probe-flash')
    })

    return () => {
      renders += 1
      const times = renders === 1 ? 'time' : 'times'
      return h('article', { ref: root, class: 'probe' }, [
        h('h3', { class: 'text-sm font-semibold' }, props.title),
        h('p', { class: 'probe-value' }, String(props.value)),
        h('p', { class: 'probe-count' }, `Rendered ${renders} ${times}`)
      ])
    }
  }
})
</script>
