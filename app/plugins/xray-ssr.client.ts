// Plugins run before Vue mounts, so everything in the document now came from the server's HTML.
export default defineNuxtPlugin(() => {
  const fromServer = new WeakSet<Element>(document.querySelectorAll('#__nuxt *'))
  return { provide: { xrayFromServer: (el: Element) => fromServer.has(el) } }
})
