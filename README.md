# @egoist/router

An Express-like router that works in Node.js, browser and Deno.

## Install

For Node.js:

```bash
npm i @egoist/router
```

```ts
import { Router } from '@egoist/router'
```

For Deno:

```ts
import { Router } from 'https://unpkg.com/@egoist/router/mod.js'
```

## Usage

```ts
const router = new Router()

router.get('/user/:user', (params) => {
  console.log(params.user)
})

router.get('/', () => {
  // do something
})

const matches = router.find('GET', '/user/egoist')

for (const m of matches) {
  m.handler(m.params)
}
// prints: 'egoist'
```

## Supported route pattern

All patterns that [Vue Router](https://next.router.vuejs.org/guide/essentials/route-matching-syntax.html) supports:

- `/user/:user`: Parameter
- `/:orderId(\\d+)`: Custom regexp
- `/:chapters+`: Repeatable params
- Consult the Vue Router docs for more..

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
