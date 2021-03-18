import { Router } from './'

type Handler = (params: Record<string, string | string[]>) => void

test('simple', () => {
  const router = new Router<Handler>()
  let msg = ''
  router.get('/:user', (params) => params.user)
  router.get('/home', () => (msg = 'home'))
  const matches = router.find('GET', '/home')
  for (const m of matches) {
    m.handler(m.params)
  }
  expect(msg).toBe('home')
})

test('wildcard path', () => {
  const router = new Router<Handler>({ sortRoutes: true })

  let msg = ''
  router.use('/*', (params) => (msg += params.wild as string))
  router.use('/user/*', (params) => (msg += params.wild as string))

  for (const m of router.find('GET', '/foo')) {
    m.handler(m.params)
  }
  expect(msg).toBe('foo')

  msg = ''

  for (const m of router.find('GET', '/user/bar')) {
    m.handler(m.params)
  }
  expect(msg).toBe('baruser/bar')
})
