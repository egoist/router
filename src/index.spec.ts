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

test('wildcard path', () => {
  const router = new Router<Handler>({ sortRoutes: true })
  router.use('/*', (params) => params.wild)
  router.use('/user/*', (params) => params.wild)

  const route1 = router.find('GET', '/foo')
  expect(route1.handlers[0](route1.params)).toBe('foo')

  const route2 = router.find('GET', '/user/foo')
  expect(route2.handlers[0](route2.params)).toBe('foo')
})
