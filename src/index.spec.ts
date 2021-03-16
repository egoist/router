import { Router } from './'

type Handler = (params: Record<string, string | string[]>) => void

test('simple', () => {
  const router = new Router<Handler>()
  router.get('/:user', (params) => params.user)
  router.get('/home', () => 'home')
  const route = router.find('GET', '/home')
  const result = route.handlers[0](route.params)
  expect(result).toBe('home')
})
