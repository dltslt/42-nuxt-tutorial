import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import InlineText from '../app/components/InlineText.vue'

// `mountSuspended` renders the component. No browser and no server are required.
describe('InlineText', () => {
  it('renders a backtick span as code', async () => {
    const wrapper = await mountSuspended(InlineText, {
      props: { text: 'Ask `GET /api/me`.' }
    })
    const code = wrapper.find('code')
    expect(code.exists()).toBe(true)
    expect(code.text()).toBe('GET /api/me')
    expect(wrapper.text()).toBe('Ask GET /api/me.')
  })
})
